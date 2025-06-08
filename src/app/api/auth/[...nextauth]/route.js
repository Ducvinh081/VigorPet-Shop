// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/libs/authOptions";

export default NextAuth(authOptions);
