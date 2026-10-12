import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/lib/models";
import mongoose from "mongoose";

export async function isUserBlocked(userEmail?: string, userId?: string): Promise<boolean> {
  const email = (userEmail || "").toLowerCase().trim();
  const id = (userId || "").trim();

  if (!email && !id) return false;

  try {
    await connectToDatabase();
    const query: any = {
      $or: [
        ...(email ? [{ email }] : []),
        ...(id ? [{ customId: id }] : []),
      ],
    };
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const user = await UserModel.findOne(query).select("isBlocked").lean();
    return Boolean(user?.isBlocked);
  } catch (err) {
    console.error("Error checking blocked user status:", err);
    return false;
  }
}

