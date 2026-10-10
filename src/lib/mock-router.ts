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
    return createAxiosResponse({ reaction: null, saved: false }, config);
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

  // Profile & Settings mock endpoints
  if (path.includes("/me/profile") || path.includes("/me/settings")) {
    let body: any = {};
    try {
      body = typeof config.data === "string" ? JSON.parse(config.data || "{}") : config.data || {};
    } catch {
      body = {};
    }
    const updatedUser = {
      id: "u-1",
      name: body.name || "উদ্যোক্তা",
      email: body.email || "user@example.com",
      bio: body.bio || "",
      division: body.division || "",
      district: body.district || "",
      area: body.area || "",
      avatar: body.avatar || "",
      role: "user",
      createdAt: new Date().toISOString(),
    };
    return createAxiosResponse({ user: updatedUser }, config);
  }

  // POST /advisor/saved, /posts/:id/like, /posts/:id/dislike, /posts/:id/save, /posts/:id/view
  if (
    path.includes("/advisor/saved") ||
    path.includes("/like") ||
    path.includes("/dislike") ||
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
  if (
    path.includes("/me/posts") ||
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
