import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth";
import { Role } from '@prisma/client';
import bcryptjs from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email as string
                        }
                    });

                    if (!user || !user.hashedPassword) {
                        return null;
                    }

                    // Check if email is verified
                    if (!user.emailVerified) {
                        throw new Error('EmailNotVerified');
                    }

                    const isPasswordValid = await bcryptjs.compare(
                        credentials.password as string,
                        user.hashedPassword
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role,
                    };
                } catch (err) {
                    console.error("Authorization error:", err);
                    throw err;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_SECRET_ID || ""
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                const existingUser = await prisma.user.findUnique({
                    where: { email: profile?.email as string }
                });

                if (existingUser) {
                    // Update existing user with Google data
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            emailVerified: new Date(),
                            name: user.name || existingUser.name,
                            image: user.image || existingUser.image
                        }
                    });
                    return true;
                } else {
                    // Create new user with Google data
                    await prisma.user.create({
                        data: {
                            email: profile?.email as string,
                            name: user.name || "",
                            image: user.image,
                            emailVerified: new Date(),
                            role: 'CLIENT'
                        }
                    });
                    return true;
                }
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
    },
    pages: {
        signIn: '/signin',
        error: '/error',
        signOut: '/'
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        csrfToken: {
            name: "next-auth.csrf-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    debug: process.env.NODE_ENV === "development"
})