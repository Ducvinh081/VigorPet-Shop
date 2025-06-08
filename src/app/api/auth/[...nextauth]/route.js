// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default NextAuth(authOptions);
