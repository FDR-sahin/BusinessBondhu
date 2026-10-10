import { NextResponse } from "next/server";
import { handleIdeasGet } from "./ideas";
import { handleBlogsGet } from "./blogs";
import {
  handleAuthSignup,
  handleAuthLogin,
  handleAuthMeGet,
  handleAuthMePut,
  handleAuthForgotPassword,
  handleAuthResetPassword,
} from "./auth";
import {
  handleBlogList,
  handleBlogFeatured,
  handleBlogSlug,
  handleBlogCommentsGet,
  handleBlogCommentsOptions,
  handleBlogRelated,
} from "./blog";
import {
  handlePostsGet,
  handlePostsPost,
  handlePostDetailGet,
  handlePostDetailPut,
  handlePostDetailDelete,
  handlePostLike,
  handlePostDislike,
  handlePostCommentsGet,
  handlePostCommentsPost,
  handlePostMe,
  handlePostRelated,
} from "./posts";
import {
  handleMeDelete,
  handleMeProfileGet,
  handleMeProfilePut,
  handleMeOverview,
  handleMePosts,
  handleMePostDetail,
  handleMeSaved,
  handleMeSettings,
  handleMeComments,
  handleMeDislikes,
  handleMeLikes,
  handleMeNotifications,
} from "./me";
import { handleAdvisorSuggest } from "./advisor";
import { handleChat } from "./chat";
import { handleStatsAnalysis, handleStatsTopDistricts } from "./stats";
import { handleNotificationsUnreadCount } from "./notifications";

export async function dispatchApiRequest(request: Request, pathSegments: string[]): Promise<Response> {
  const method = request.method.toUpperCase();

  // 1. Root /api/ideas
  if (pathSegments.length === 1 && pathSegments[0] === "ideas") {
    if (method === "GET") return handleIdeasGet();
  }

  // 2. Root /api/blogs
  if (pathSegments.length === 1 && pathSegments[0] === "blogs") {
    if (method === "GET") return handleBlogsGet();
  }

  // 3. /api/v1/*
  if (pathSegments.length >= 1 && pathSegments[0] === "v1") {
    const rest = pathSegments.slice(1);

    // /api/v1/advisor/suggest
    if (rest[0] === "advisor" && rest[1] === "suggest") {
      if (method === "POST") return handleAdvisorSuggest(request);
    }

    // /api/v1/auth/*
    if (rest[0] === "auth") {
      const action = rest[1];
      if (action === "signup" && method === "POST") return handleAuthSignup(request);
      if (action === "login" && method === "POST") return handleAuthLogin(request);
      if (action === "me") {
        if (method === "GET") return handleAuthMeGet(request);
        if (method === "PUT") return handleAuthMePut(request);
      }
      if (action === "forgot-password" && method === "POST") return handleAuthForgotPassword();
      if (action === "reset-password" && method === "POST") return handleAuthResetPassword();
    }

    // /api/v1/chat
    if (rest[0] === "chat" && method === "POST") {
      return handleChat(request);
    }

    // /api/v1/stats/*
    if (rest[0] === "stats") {
      if (rest[1] === "analysis" && method === "GET") return handleStatsAnalysis();
      if (rest[1] === "top-districts" && method === "GET") return handleStatsTopDistricts();
    }

    // /api/v1/notifications/*
    if (rest[0] === "notifications") {
      if (rest[1] === "unread-count" && method === "GET") return handleNotificationsUnreadCount();
    }

    // /api/v1/me/*
    if (rest[0] === "me") {
      const meSub = rest.slice(1);
      if (meSub.length === 0) {
        if (method === "DELETE") return handleMeDelete();
      }
      if (meSub[0] === "profile") {
        if (method === "GET") return handleMeProfileGet(request);
        if (method === "PUT") return handleMeProfilePut(request);
      }
      if (meSub[0] === "overview" && method === "GET") return handleMeOverview(request);
      if (meSub[0] === "posts") {
        if (meSub.length === 1 && method === "GET") return handleMePosts(request);
        if (meSub.length === 2 && method === "GET") return handleMePostDetail(meSub[1]);
      }
      if (meSub[0] === "saved" && method === "GET") return handleMeSaved();
      if (meSub[0] === "settings" && method === "GET") return handleMeSettings();
      if (meSub[0] === "comments" && method === "GET") return handleMeComments();
      if (meSub[0] === "dislikes" && method === "GET") return handleMeDislikes();
      if (meSub[0] === "likes" && method === "GET") return handleMeLikes();
      if (meSub[0] === "notifications" && method === "GET") return handleMeNotifications();
    }

    // /api/v1/blog/*
    if (rest[0] === "blog") {
      const blogSub = rest.slice(1);
      if (blogSub.length === 0 && method === "GET") return handleBlogList(request);
      if (blogSub[0] === "featured" && method === "GET") return handleBlogFeatured();
      if (blogSub.length === 1 && method === "GET") return handleBlogSlug(blogSub[0]);
      if (blogSub.length === 2) {
        const slug = blogSub[0];
        const subAction = blogSub[1];
        if (subAction === "comments") {
          if (method === "GET") return handleBlogCommentsGet(request);
          if (method === "OPTIONS") return handleBlogCommentsOptions(request);
        }
        if (subAction === "related" && method === "GET") return handleBlogRelated(slug);
      }
    }

    // /api/v1/posts/*
    if (rest[0] === "posts") {
      const postSub = rest.slice(1);
      if (postSub.length === 0) {
        if (method === "GET") return handlePostsGet(request);
        if (method === "POST") return handlePostsPost(request);
      }
      if (postSub.length === 1) {
        const id = postSub[0];
        if (method === "GET") return handlePostDetailGet(id);
        if (method === "PUT") return handlePostDetailPut(id, request);
        if (method === "DELETE") return handlePostDetailDelete(id);
      }
      if (postSub.length === 2) {
        const id = postSub[0];
        const action = postSub[1];
        if (action === "like" && method === "POST") return handlePostLike(id, request);
        if (action === "dislike" && method === "POST") return handlePostDislike(id, request);
        if (action === "comments") {
          if (method === "GET") return handlePostCommentsGet(id);
          if (method === "POST") return handlePostCommentsPost(id, request);
        }
        if (action === "me" && method === "GET") return handlePostMe(id, request);
        if (action === "related" && method === "GET") return handlePostRelated(id);
      }
    }
  }

  return NextResponse.json({ message: "API endpoint not found", path: pathSegments }, { status: 404 });
}
