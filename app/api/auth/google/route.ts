// DISABLED: Using NextAuth for Google authentication instead
// Keep this code for future Supabase migration if needed

/*
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const ref = searchParams.get('ref') // Get referral code

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback${ref ? `?ref=${ref}` : ''}`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        })

        if (error) {
            console.error('Google auth error:', error)
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=AuthError`)
        }

        if (data.url) {
            return NextResponse.redirect(data.url)
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin`)
    } catch (error) {
        console.error('Auth handler error:', error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=AuthError`)
    }
}
*/
