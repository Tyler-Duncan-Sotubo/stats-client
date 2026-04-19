import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      accessTokenExpiresAt: number;
    };
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      accessTokenExpiresAt: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      accessTokenExpiresAt: number;
    };
  }
}
