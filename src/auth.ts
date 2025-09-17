import NextAuth from "next-auth";
import { prisma } from "./utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
 
        const user = await prisma.user.findUnique({ where: { id: token.sub } });
        if (user) {
          session.user.role = user.role;
          session.user.isTwoStepEnabled = user.isTwoStepEnabled;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const userFromdb = await prisma.user.findUnique({
        where: { id: user.id },
      });
      return true;
    },
  },
  // events: {
  //   async linkAccount({ user }) {
  //   },
  // },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,

});

export { handlers, auth, signIn, signOut };
