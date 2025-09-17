import NextAuth, {type defaultSession} from 'next-auth'
import { Role } from '@/generated/prisma'

declare module "next-auth"{
    interface Session{
    user: defaultSession["user"] & {role: Role, isTwoStepEnabled: boolean} 
}
} 


import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      areu?: string;
      role?: string;
      isTwoStepEnabled?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    areu?: string;
    role?: string;
    isTwoStepEnabled?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    areu?: string;
    role?: string;
    sub?: string;
  }
}
