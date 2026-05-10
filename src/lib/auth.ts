import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
    providers: [
        //login
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials, req) {
                const email = credentials?.email;
                const password = credentials?.password;
                if (!email || !password) {
                    throw Error("Email and password are required");
                }
                await connectDB();
                const user = await User.findOne({ email });
                if (!user) {
                    throw Error("No user found with the provided email");
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw Error("Invalid password");
                }

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image || null
                }
            }
        }),

        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        })
    ],
    callbacks: {

        async signIn({ account, user }) {
            if (account?.provider === "google") {
                await connectDB();
                let existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    existingUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image
                    });
                }
                user.id = existingUser._id as string;
            }
            return true;
        },


        async jwt({ token, user, trigger, session }) {

            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
            }

            if (trigger === "update") {

                await connectDB();

                const dbUser = await User.findById(token.id);

                if (dbUser) {
                    token.name = dbUser.name;
                    token.image = dbUser.image;
                }
            }

            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image as string
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 15 * 24 * 60 * 60,
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET
}

export default authOptions;
