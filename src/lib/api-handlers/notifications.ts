import { NextResponse } from "next/server";

export async function handleNotificationsUnreadCount() {
  return NextResponse.json({ count: 0 });
}
