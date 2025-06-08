import NextAuth from "next-auth";
import {authOptions, isAdmin} from "@/libs/authOptions";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
