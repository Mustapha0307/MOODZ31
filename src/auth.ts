import NextAuth from "next-auth";
import { prisma } from "@/utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";



const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // أول مرة فقط
        token.role = user.role;
      } else if (token.sub && !token.role) {
        // الطلبات التالية: نجيب الدور من قاعدة البيانات
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string; // ← أضفنا الدور للـ session
      }
      return session;
    },
  },
});
export {handlers, auth, signIn, signOut }
