import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider !== "google") return true;

      try {
        await connectMongoDB();

        const existingUser = await User.findOne({ email: user.email });

        if (existingUser?.isDeleted || existingUser?.isSuspended) {
          return false;
        }

        if (
          existingUser &&
          !["student", "teacher", "admin"].includes(existingUser.role)
        ) {
          return false;
        }

        if (!existingUser) {
          // AUTO-REGISTER: create account on first Google sign-in
          await User.create({
            fullName: user.name,
            email: user.email.toLowerCase(),
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

    async jwt({ token }) {
      if (token.email) {
        try {
          await connectMongoDB();
          const dbUser = await User.findOne({
            email: token.email.toLowerCase(),
            isDeleted: { $ne: true },
          });
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
