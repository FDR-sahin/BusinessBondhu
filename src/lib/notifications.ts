import { connectToDatabase } from "@/lib/db";
import { NotificationModel } from "@/lib/models";
import type { NotificationType } from "@/types";

export interface CreateNotificationParams {
  recipientUserId?: string;
  recipientUserEmail?: string;
  type: NotificationType;
  title: string;
  message: string;
  postId?: string;
  actorUserId?: string;
  actorUserEmail?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  const {
    recipientUserId,
    recipientUserEmail,
    type,
    title,
    message,
    postId = "",
    actorUserId = "",
    actorUserEmail = "",
  } = params;

  const targetEmail = (recipientUserEmail || "").toLowerCase().trim();
  const targetId = (recipientUserId || "").trim();

  // If no recipient is specified, don't create
  if (!targetEmail && !targetId) return;

  // Do not notify self
  if (actorUserEmail && targetEmail && actorUserEmail.toLowerCase().trim() === targetEmail) {
    return;
  }
  if (actorUserId && targetId && actorUserId === targetId) {
    return;
  }

  try {
    await connectToDatabase();
    const newId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await NotificationModel.create({
      customId: newId,
      id: newId,
      recipientUserId: targetId,
      recipientUserEmail: targetEmail,
      type,
      title,
      message,
      postId,
      read: false,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}

