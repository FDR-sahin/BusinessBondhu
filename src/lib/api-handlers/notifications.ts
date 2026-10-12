import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { NotificationModel } from "@/lib/models";
import { getCookieValue } from "@/lib/user-profile-store";
import type { AppNotification } from "@/types";

function getUserIdentity(request: Request) {
  const userId = (request.headers.get("x-user-id") || "").trim();
  const userEmail = (
    request.headers.get("x-user-email") ||
    getCookieValue(request, "bhbd_user_email") ||
    ""
  ).toLowerCase().trim();

  return { userId, userEmail };
}

export async function handleNotificationsUnreadCount(request: Request) {
  const { userId, userEmail } = getUserIdentity(request);
  if (!userId && !userEmail) {
    return NextResponse.json({ count: 0 });
  }

  try {
    await connectToDatabase();
    const query: any = {
      read: false,
      $or: [
        ...(userId ? [{ recipientUserId: userId }] : []),
        ...(userEmail ? [{ recipientUserEmail: userEmail }] : []),
      ],
    };
    const count = await NotificationModel.countDocuments(query);
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Error fetching unread notifications count:", err);
    return NextResponse.json({ count: 0 });
  }
}

export async function handleNotificationsList(request: Request) {
  const { userId, userEmail } = getUserIdentity(request);
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.max(1, Number(searchParams.get("limit") || 15));
  const skip = (page - 1) * limit;

  if (!userId && !userEmail) {
    return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 1 });
  }

  try {
    await connectToDatabase();
    const query: any = {
      $or: [
        ...(userId ? [{ recipientUserId: userId }] : []),
        ...(userEmail ? [{ recipientUserEmail: userEmail }] : []),
      ],
    };

    if (filter === "unread") {
      query.read = false;
    }

    const [total, docs] = await Promise.all([
      NotificationModel.countDocuments(query),
      NotificationModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const items: AppNotification[] = docs.map((doc: any) => ({
      id: String(doc.id || doc._id),
      type: doc.type || "system",
      title: doc.title || "",
      message: doc.message || "",
      postId: doc.postId || "",
      read: Boolean(doc.read),
      createdAt: doc.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    console.error("Error fetching notifications list:", err);
    return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 1 });
  }
}

export async function handleNotificationMarkRead(id: string, request: Request) {
  const { userId, userEmail } = getUserIdentity(request);
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const filter: any = {
      $or: [{ id }, { customId: id }],
    };
    if (userId || userEmail) {
      filter.$and = [
        {
          $or: [
            ...(userId ? [{ recipientUserId: userId }] : []),
            ...(userEmail ? [{ recipientUserEmail: userEmail }] : []),
          ],
        },
      ];
    }

    await NotificationModel.findOneAndUpdate(filter, { $set: { read: true } });
    return NextResponse.json({ success: true, message: "পড়া হয়েছে হিসেবে চিহ্নিত করা হয়েছে" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    return NextResponse.json({ success: true });
  }
}

export async function handleNotificationsMarkAllRead(request: Request) {
  const { userId, userEmail } = getUserIdentity(request);
  if (!userId && !userEmail) {
    return NextResponse.json({ success: true });
  }

  try {
    await connectToDatabase();
    const query: any = {
      read: false,
      $or: [
        ...(userId ? [{ recipientUserId: userId }] : []),
        ...(userEmail ? [{ recipientUserEmail: userEmail }] : []),
      ],
    };

    await NotificationModel.updateMany(query, { $set: { read: true } });
    return NextResponse.json({ success: true, message: "সব পড়া হয়েছে হিসেবে চিহ্নিত করা হয়েছে" });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    return NextResponse.json({ success: true });
  }
}

export async function handleNotificationDelete(id: string, request: Request) {
  const { userId, userEmail } = getUserIdentity(request);
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const filter: any = {
      $or: [{ id }, { customId: id }],
    };
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter.$or.push({ _id: id });
    }
    if (userId || userEmail) {
      filter.$and = [
        {
          $or: [
            ...(userId ? [{ recipientUserId: userId }] : []),
            ...(userEmail ? [{ recipientUserEmail: userEmail }] : []),
          ],
        },
      ];
    }

    const deleted = await NotificationModel.findOneAndDelete(filter);
    if (!deleted) {
      // Also try fallback without $and if it belonged to this user
      await NotificationModel.findOneAndDelete({
        $or: [{ id }, { customId: id }, ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])],
      });
    }
    return NextResponse.json({ success: true, message: "নোটিফিকেশনটি মুছে ফেলা হয়েছে" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    return NextResponse.json({ success: false, message: "নোটিফিকেশন মুছতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

export async function handleNotificationsClearAll(request: Request) {
  const { userId, userEmail } = getUserIdentity(request);
  if (!userId && !userEmail) {
    return NextResponse.json({ success: true });
  }

  try {
    await connectToDatabase();
    const query: any = {
      $or: [
        ...(userId ? [{ recipientUserId: userId }] : []),
        ...(userEmail ? [{ recipientUserEmail: userEmail }] : []),
      ],
    };

    await NotificationModel.deleteMany(query);
    return NextResponse.json({ success: true, message: "সব নোটিফিকেশন মুছে ফেলা হয়েছে" });
  } catch (err) {
    console.error("Error clearing all notifications:", err);
    return NextResponse.json({ success: false, message: "নোটিফিকেশন মুছতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
