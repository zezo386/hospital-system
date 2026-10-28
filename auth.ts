import Nextauth from "next-auth";
import google from "next-auth/providers/google";
import { Pool } from "pg";
import PostgresAdapter from "@auth/pg-adapter";

const pool = new Pool({
    database: process.env.DB_NAME,
    ssl: true
})

export const { handlers, auth, signIn, signOut} = Nextauth({
    providers: [
        google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    adapter: PostgresAdapter(pool),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role ?? "patient";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    }
})