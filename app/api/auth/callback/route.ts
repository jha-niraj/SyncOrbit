// DISABLED: Using NextAuth for authentication instead
// Keep this code for future Supabase migration if needed

import { NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabase'
// import { prisma } from '@/lib/prisma'

export async function GET() {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=Disabled`)
    // const { searchParams } = new URL(request.url)
    // const code = searchParams.get('code')
    // const ref = searchParams.get('ref') // Get referral code from callback

    // if (!code) {
    //     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=NoCode`)
    // }

    // try {
    //     // Exchange code for session
    //     const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    //     if (error) {
    //         console.error('Code exchange error:', error)
    //         return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=CodeExchange`)
    //     }

    //     if (!data.user) {
    //         return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=NoUser`)
    //     }

    //     // Check if user exists in our database
    //     const existingUser = await prisma.user.findUnique({
    //         where: { email: data.user.email! }
    //     })

    //     if (existingUser) {
    //         // User exists, update their info and redirect to dashboard
    //         await prisma.user.update({
    //             where: { id: existingUser.id },
    //             data: {
    //                 emailVerified: new Date(),
    //                 name: data.user.user_metadata?.full_name || existingUser.name,
    //                 image: data.user.user_metadata?.avatar_url || existingUser.image
    //             }
    //         })

    //         // Set session cookie and redirect to dashboard
    //         const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`)
    //         response.cookies.set('supabase-auth-token', data.session.access_token, {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === 'production',
    //             sameSite: 'lax',
    //             maxAge: 60 * 60 * 24 * 7 // 7 days
    //         })
    //         return response
    //     } else {
    //         // New user, redirect to onboarding
    //         const response = NextResponse.redirect(
    //             `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding${ref ? `?ref=${ref}` : ''}`
    //         )
    //         response.cookies.set('supabase-auth-token', data.session.access_token, {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === 'production',
    //             sameSite: 'lax',
    //             maxAge: 60 * 60 * 24 * 7 // 7 days
    //         })
    //         return response
    //     }
    // } catch (error) {
    //     console.error('Auth callback error:', error)
    //     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=CallbackError`)
    // }
}
