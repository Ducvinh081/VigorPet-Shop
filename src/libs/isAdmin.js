import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/connectDB";
import UserInfo from "@/models/UserInfo";

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;

  await connectDB();
  const info = await UserInfo.findOne({ email: session.user.email });
  return info?.admin || false;
}