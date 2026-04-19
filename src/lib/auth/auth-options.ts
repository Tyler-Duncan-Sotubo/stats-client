import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (!res.ok) return null;

          const data = await res.json();

          return {
            id: data.id,
            email: data.email,
            name: data.name ?? "",
            role: data.role ?? "both",
            backendTokens: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresIn: data.expiresIn,
              accessTokenExpiresAt: data.expiresIn, // see note below
            },
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // First sign in — attach backend tokens to the JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.backendTokens = user.backendTokens;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose backend tokens and user info to the client session
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.backendTokens = token.backendTokens as any;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Convenience helper for server components
export const getServerAuthSession = () => getServerSession(authOptions);
