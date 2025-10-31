import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Role } from '@prisma/client';
import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
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

                    // Special case for post-verification automatic signin
                    if (credentials.password === "verified") {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            role: user.role,
                        };
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
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role;
                
                // Check if user needs onboarding (Google users without role)
                if (!user.role && user.email) {
                    const dbUser = await prisma.user.findUnique({
                        where: { email: user.email },
                        include: {
                            ownedCompany: true,
                            company: true,
                            teamMemberships: { where: { isActive: true } }
                        }
                    });
                    
                    if (!dbUser) {
                        token.needsOnboarding = true;
                        token.googleUser = {
                            email: user.email,
                            name: user.name || '',
                            image: user.image || undefined
                        };
                    } else {
                        // Update token with fresh user data
                        token.role = dbUser.role;
                        token.companyId = dbUser.ownedCompany?.id || dbUser.company?.id;
                        token.isCompanyOwner = dbUser.role === Role.COMPANY_OWNER;
                        token.hasTeams = dbUser.teamMemberships.length > 0;
                    }
                } else if (user.role) {
                    // Fetch additional user context for existing users
                    const dbUser = await prisma.user.findUnique({
                        where: { id: user.id as string },
                        include: {
                            ownedCompany: true,
                            company: true,
                            teamMemberships: { where: { isActive: true } },
                            ledTeams: true
                        }
                    });
                    
                    if (dbUser) {
                        token.companyId = dbUser.ownedCompany?.id || dbUser.company?.id;
                        token.isCompanyOwner = dbUser.role === Role.COMPANY_OWNER;
                        token.isTeamHead = dbUser.role === Role.TEAM_HEAD;
                        token.hasTeams = dbUser.teamMemberships.length > 0 || dbUser.ledTeams.length > 0;
                    }
                }
            }
            
            // Refresh user data on update
            if (trigger === 'update' && token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    include: {
                        ownedCompany: true,
                        company: true,
                        teamMemberships: { where: { isActive: true } },
                        ledTeams: true
                    }
                });
                
                if (dbUser) {
                    token.role = dbUser.role;
                    token.companyId = dbUser.ownedCompany?.id || dbUser.company?.id;
                    token.isCompanyOwner = dbUser.role === Role.COMPANY_OWNER;
                    token.isTeamHead = dbUser.role === Role.TEAM_HEAD;
                    token.hasTeams = dbUser.teamMemberships.length > 0 || dbUser.ledTeams.length > 0;
                }
            }
            
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
                session.user.companyId = token.companyId as string;
                session.user.isCompanyOwner = token.isCompanyOwner as boolean;
                session.user.isTeamHead = token.isTeamHead as boolean;
                session.user.hasTeams = token.hasTeams as boolean;
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
                    // New Google user - they need to go through onboarding
                    // Let them sign in, we'll handle onboarding in the redirect callback
                    return true;
                }
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            // If the URL already includes onboarding, allow it
            if (url.includes('/onboarding')) {
                return url;
            }
            
            // Handle direct callbackUrl parameters
            if (url.includes('callbackUrl')) {
                const urlObj = new URL(url);
                const callbackUrl = urlObj.searchParams.get('callbackUrl');
                
                if (callbackUrl?.includes('/onboarding')) {
                    return callbackUrl;
                }
            }
            
            // Check if this is a Google auth success and determine redirect
            // For new Google users, we need to check if they need onboarding
            try {
                if (url === baseUrl || url === `${baseUrl}/`) {
                    // This is a successful auth callback, check if user needs onboarding
                    const urlObj = new URL(url);
                    
                    // Default redirect logic
                    if (url.startsWith("/")) return `${baseUrl}${url}`;
                    if (new URL(url).origin === baseUrl) return url;
                    return `${baseUrl}/dashboard`;
                }
            } catch (e) {
                console.error("Redirect error:", e);
            }
            
            // Default redirect logic
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
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
}

// Helper function for server-side auth check (compatible with v5 syntax used in the app)
export async function auth() {
	const { getServerSession } = await import('next-auth/next');
	return await getServerSession(authOptions);
}

// Export getServerSession for direct use if needed
export { getServerSession } from 'next-auth/next';