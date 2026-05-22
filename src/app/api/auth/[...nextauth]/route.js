import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectMongoDB } from "../../../../../lib/connect";
import User from "../../../../../models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider !== "google") return true;

      try {
        await connectMongoDB();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // AUTO-REGISTER: create account on first Google sign-in
          await User.create({
            fullName: user.name,
            email: user.email,
            password: "", // no password for Google users
            role: "student",
            isVerified: true, // Google already verified the email
            avatar: user.image || "",
          });
        }

        return true;

      } catch (error) {
        console.log("Google sign-in error:", error);
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account?.provider === "google") {
        try {
          await connectMongoDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.isSuspended = dbUser.isSuspended;
          }
        } catch (error) {
          console.log(error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isSuspended = token.isSuspended;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login/student",
    error: "/login/student",
  },
});

export { handler as GET, handler as POST };