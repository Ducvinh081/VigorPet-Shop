import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDB from "@/libs/mongoConnect";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import { getServerSession } from "next-auth/next";

export const authOptions = {
    session: {
      strategy: "jwt", 
      
    },
    providers: [
      // --- Google Provider ---
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        async profile(profile) {
        
          await connectDB();
          const email = profile.email;
          let user = await User.findOne({ email });
  
          if (!user) {
            user = await User.create({
              email,
              name: profile.name,
              image: profile.picture,
              // Mật khẩu trống vì Google login
            });
          } else {
            user.name = profile.name;
            user.image = profile.picture;
            await user.save();
          }
  
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        },
      }),
  
      // --- Credentials Provider ---
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "test@example.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          await connectDB();
          const email = credentials?.email;
          const password = credentials?.password;
          if (!email || !password) return null;
  
          const user = await User.findOne({ email });
          if (!user || !user.password) return null; // nếu user không tồn tại hoặc là Google-only account
  
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;
  
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        },
      }),
    ],
  
    callbacks: {
      async jwt({ token, user, account, profile }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
  
        await connectDB();
        const userInfo = await UserInfo.findOne({ email: session.user.email });
        session.user.admin = userInfo?.admin || false;
  
        return session;
      },
    },
  
    secret: process.env.SECRET,
  };
  export async function isAdmin() { // No 'request' parameter needed here for App Router Route Handler context
    const session = await getServerSession(authOptions); // This should now work
    if (!session?.user?.email) return false;
  
    await connectDB(); // Ensure connectDB is imported and works
    const info = await UserInfo.findOne({ email: session.user.email }); // Ensure UserInfo model is imported
    return info?.admin || false;
  }