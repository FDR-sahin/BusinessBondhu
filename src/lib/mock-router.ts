import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { MyPost } from "@/types";
import {
  MOCK_ANALYSIS_DATA,
  MOCK_BLOG_POSTS,
  MOCK_DASHBOARD_OVERVIEW,
  MOCK_POSTS,
  MOCK_TOP_DISTRICTS,
  getMockAdvisorSuggestions,
  getMockComments,
  getMockPaginatedPosts,
  getMockPostDetail,
} from "@/lib/mock-data";

export function handleMockFallback(config?: AxiosRequestConfig): AxiosResponse | null {
  if (!config) return null;
  const url = config.url || "";
  const params = config.params || {};

  // Clean endpoint path
  const path = url.replace(/^https?:\/\/[^\/]+/, "").replace(/^\/api\/v1/, "");

  // Auth Fallbacks
  if (path.includes("/auth/signup") || path.includes("/auth/login")) {
    let body: any = {};
    try {
      body = typeof config.data === "string" ? JSON.parse(config.data || "{}") : config.data || {};
    } catch {
      body = {};
    }
    const name = body.name || (body.email ? body.email.split("@")[0] : "উদ্যোক্তা");
    return createAxiosResponse(
      {
        user: {
          id: `u-${Date.now()}`,
          name,
          email: body.email || "user@example.com",
          division: body.division || "",
          district: body.district || "",
          role: "user",
          createdAt: new Date().toISOString(),
        },
        accessToken: `token-${Date.now()}`,
        refreshToken: `rtoken-${Date.now()}`,
      },
      config,
    );
  }

  if (path.includes("/auth/forgot-password") || path.includes("/auth/reset-password")) {
    return createAxiosResponse({ success: true, message: "অপারেশনটি সফল হয়েছে" }, config);
  }

  // GET /posts/stats/top-districts or /stats/top-districts
  if (path.includes("/stats/top-districts")) {
    return createAxiosResponse(MOCK_TOP_DISTRICTS, config);
  }

  // GET /stats/analysis
  if (path.includes("/stats/analysis")) {
    return createAxiosResponse(MOCK_ANALYSIS_DATA, config);
  }

  // GET /posts/:id/comments
  if (path.match(/\/posts\/[^\/]+\/comments/)) {
    const postId = path.split("/")[2] || "post-1";
    return createAxiosResponse(getMockComments(postId), config);
  }

  // GET /posts/:id/related
  if (path.match(/\/posts\/[^\/]+\/related/)) {
    return createAxiosResponse(MOCK_POSTS.slice(0, 4), config);
  }

  // GET /posts/:id/me
  if (path.match(/\/posts\/[^\/]+\/me/)) {
    const postId = path.split("/")[2] || "post-1";
    let reaction: string | null = null;
    let saved = false;
    if (typeof window !== "undefined") {
      reaction = localStorage.getItem(`reaction_${postId}`);
      saved = localStorage.getItem(`saved_${postId}`) === "true";
    }
    return createAxiosResponse({ reaction, saved }, config);
  }

  // GET /posts/:id
  if (path.match(/\/posts\/[^\/]+$/) && !path.includes("/posts?")) {
    const id = path.split("/").pop() || "post-1";
    return createAxiosResponse(getMockPostDetail(id), config);
  }

  // GET /posts
  if (path.startsWith("/posts")) {
    return createAxiosResponse(getMockPaginatedPosts(params), config);
  }

  // GET /blog/featured
  if (path.includes("/blog/featured")) {
    return createAxiosResponse(MOCK_BLOG_POSTS[0], config);
  }

  // GET /blog/:slug/related
  if (path.match(/\/blog\/[^\/]+\/related/)) {
    return createAxiosResponse(MOCK_BLOG_POSTS.slice(0, 3), config);
  }

  // GET /blog/:slug
  if (path.match(/\/blog\/[^\/]+$/) && !path.includes("/blog?")) {
    const slug = path.split("/").pop();
    const blog = MOCK_BLOG_POSTS.find((b) => b.slug === slug || b.id === slug) || MOCK_BLOG_POSTS[0];
    return createAxiosResponse(
      {
        ...blog,
        content: blog.content || `<p>${blog.excerpt}</p>`,
        commentsEnabled: true,
      },
      config,
    );
  }

  // GET /blog
  if (path.startsWith("/blog")) {
    return createAxiosResponse(
      {
        items: MOCK_BLOG_POSTS,
        total: MOCK_BLOG_POSTS.length,
        page: 1,
        limit: 9,
        totalPages: 1,
      },
      config,
    );
  }

  // POST /advisor/suggest
  if (path.includes("/advisor/suggest")) {
    const body = typeof config.data === "string" ? JSON.parse(config.data || "{}") : config.data || {};
    return createAxiosResponse(getMockAdvisorSuggestions(body.budget || 20000, body.category), config);
  }

  // Auth /me & Profile & Settings mock endpoints
  if (path.includes("/auth/me") || path.includes("/me/profile") || path.includes("/me/settings")) {
    let storedUser: any = null;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("bhbd_user_profile");
        if (raw) storedUser = JSON.parse(raw);
        if (!storedUser) {
          const authRaw = localStorage.getItem("bhbd-auth");
          if (authRaw) {
            const parsed = JSON.parse(authRaw);
            if (parsed?.state?.user) storedUser = parsed.state.user;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    let body: any = {};
    try {
      body = typeof config.data === "string" ? JSON.parse(config.data || "{}") : config.data || {};
    } catch {
      body = {};
    }

    const isPut = config.method?.toLowerCase() === "put" || Object.keys(body).length > 0;

    const user = {
      id: storedUser?.id || "u-1",
      name: (isPut ? body.name : undefined) || storedUser?.name || "উদ্যোক্তা",
      email: (isPut ? body.email : undefined) || storedUser?.email || "user@example.com",
      bio: (isPut && body.bio !== undefined ? body.bio : storedUser?.bio) || "",
      division: (isPut && body.division !== undefined ? body.division : storedUser?.division) || "",
      district: (isPut && body.district !== undefined ? body.district : storedUser?.district) || "",
      area: (isPut && body.area !== undefined ? body.area : storedUser?.area) || "",
      avatar: (isPut && body.avatar !== undefined ? body.avatar : storedUser?.avatar) || "",
      role: storedUser?.role || "user",
      createdAt: storedUser?.createdAt || new Date().toISOString(),
    };

    if (isPut && typeof window !== "undefined") {
      try {
        localStorage.setItem("bhbd_user_profile", JSON.stringify(user));
        const authRaw = localStorage.getItem("bhbd-auth");
        if (authRaw) {
          const parsed = JSON.parse(authRaw);
          if (parsed?.state) {
            parsed.state.user = user;
            localStorage.setItem("bhbd-auth", JSON.stringify(parsed));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    return createAxiosResponse({ user }, config);
  }

  // POST /posts (Create post or save draft fallback)
  if (config.method?.toLowerCase() === "post" && path === "/posts") {
    let body: any = {};
    try {
      body = typeof config.data === "string" ? JSON.parse(config.data || "{}") : config.data || {};
    } catch {
      body = {};
    }
    const newPost = {
      id: `post-${Date.now()}`,
      title: body.title || "নতুন খসড়া",
      status: body.status || "pending",
      category: body.category || "general",
      division: body.division || "Dhaka",
      district: body.district || "ঢাকা",
      area: body.area || "",
      exactLocation: body.exactLocation || "",
      wholesalePrice: Number(body.wholesalePrice || 0),
      wholesalePriceMax: body.wholesalePriceMax ? Number(body.wholesalePriceMax) : undefined,
      wholesalePriceText: body.wholesalePriceText,
      retailPrice: Number(body.retailPrice || 0),
      retailPriceMax: body.retailPriceMax ? Number(body.retailPriceMax) : undefined,
      retailPriceText: body.retailPriceText,
      retailSellPrice: Number(body.retailSellPrice || body.retailPrice || 0),
      profitPotential: body.profitPotential || "medium",
      description: body.description || "",
      image: body.image || "/images/ideas/default.jpg",
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
    };
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("user_local_posts") || "[]");
        stored.unshift(newPost);
        localStorage.setItem("user_local_posts", JSON.stringify(stored));
      } catch (e) {
        console.error(e);
      }
    }
    return createAxiosResponse({ success: true, post: newPost, id: newPost.id }, config);
  }

  // DELETE /posts/:id
  if (config.method?.toLowerCase() === "delete" && path.startsWith("/posts/")) {
    const id = path.split("/").pop();
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("user_local_posts") || "[]");
        const filtered = stored.filter((p: any) => p.id !== id);
        localStorage.setItem("user_local_posts", JSON.stringify(filtered));
      } catch (e) {
        console.error(e);
      }
    }
    return createAxiosResponse({ success: true, message: "পোস্ট মুছে ফেলা হয়েছে" }, config);
  }

  // POST /posts/:id/like, /posts/:id/dislike (Facebook-like toggle in local storage)
  if (path.match(/\/posts\/[^\/]+\/(like|dislike)/)) {
    const parts = path.split("/");
    const postId = parts[2];
    const action = parts[3]; // 'like' or 'dislike'
    if (typeof window !== "undefined") {
      const current = localStorage.getItem(`reaction_${postId}`);
      if (current === action) {
        localStorage.removeItem(`reaction_${postId}`);
      } else {
        localStorage.setItem(`reaction_${postId}`, action);
      }
    }
    return createAxiosResponse({ success: true, message: "অপারেশনটি সফল হয়েছে" }, config);
  }

  // POST /advisor/saved, /posts/:id/save, /posts/:id/view
  if (
    path.includes("/advisor/saved") ||
    path.includes("/save") ||
    path.includes("/view") ||
    path === "/me" ||
    path === "/me/"
  ) {
    return createAxiosResponse({ success: true, message: "অপারেশনটি সফল হয়েছে" }, config);
  }

  // Notifications unread count
  if (path.includes("/notifications/unread-count")) {
    return createAxiosResponse({ count: 0 }, config);
  }

  // Dashboard APIs
  if (path.includes("/me/dashboard") || path.includes("/me/overview")) {
    return createAxiosResponse(
      {
        totals: { posts: 0, likes: 0, views: 0, comments: 0 },
        weeklyLikes: [],
        postsByCategory: [],
        activity: [],
      },
      config,
    );
  }
  if (path.includes("/me/posts")) {
    let items: any[] = [];
    if (typeof window !== "undefined") {
      try {
        items = JSON.parse(localStorage.getItem("user_local_posts") || "[]");
      } catch (e) {
        console.error(e);
      }
    }
    const status = params.status;
    if (status && status !== "all") {
      items = items.filter((p: any) => p.status === status);
    }
    return createAxiosResponse(
      {
        items,
        total: items.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(items.length / 10),
      },
      config,
    );
  }
  if (
    path.includes("/me/collections") ||
    path.includes("/me/likes") ||
    path.includes("/me/dislikes") ||
    path.includes("/me/saved")
  ) {
    return createAxiosResponse(
      {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      config,
    );
  }
  if (path.includes("/me/comments")) {
    return createAxiosResponse(
      {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      config,
    );
  }
  if (path.includes("/me/notifications")) {
    return createAxiosResponse({ items: [], unreadCount: 0 }, config);
  }

  // Generic Fallback
  return createAxiosResponse({ items: MOCK_POSTS, total: MOCK_POSTS.length }, config);
}

function createAxiosResponse(data: any, config: AxiosRequestConfig): AxiosResponse {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: config as any,
  };
}
