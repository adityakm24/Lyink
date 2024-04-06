import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add other providers as needed
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, `user` is defined
      if (user) {
        token.userId = user.id; // Ensure this aligns with how you're storing `userId` upon user creation
      }
      return token;
    },
    async session({ session, token }) {
      // Append `userId` to the session object
      if (token.userId) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  // Additional NextAuth configuration...
});
