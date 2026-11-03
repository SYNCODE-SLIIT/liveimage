import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clearEvents, clientIp, countRecent, hashIp, recordEvent } from "@/lib/rateLimit";

const LOCK_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_EMAIL = 5;
const MAX_FAILS_PER_IP = 20;
export const LOGIN_LOCKED_MESSAGE =
  "Too many failed attempts. Please wait 15 minutes and try again.";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const ip = hashIp(clientIp(req?.headers));
        const [emailFails, ipFails] = await Promise.all([
          countRecent("login-email", email, LOCK_WINDOW_MS),
          countRecent("login-ip", ip, LOCK_WINDOW_MS),
        ]);
        if (emailFails >= MAX_FAILS_PER_EMAIL || ipFails >= MAX_FAILS_PER_IP) {
          throw new Error(LOGIN_LOCKED_MESSAGE);
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
          await Promise.all([
            recordEvent("login-email", email),
            recordEvent("login-ip", ip),
          ]);
          return null;
        }
        await clearEvents("login-email", email);
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
