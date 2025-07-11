import { auth } from "@/auth"
import { NextResponse } from "next/server"

const protectedRoutes = [
	'/dashboard',
	'/profile',
	'/team',
	'/admin',
	'/settings'
]

const publicRoutes = [
	'/',
	'/signin',
	'/signup',
	'/register',
	'/verify',
	'/verifyemail',
	'/forgot-password',
	'/forgotpassword',
	'/reset-password',
	'/error',
	'/aboutus',
	'/contact',
	'/accelerator',
	'/budgetestimator',
	'/nexinvoice',
	'/projectsdelivered'
]

const apiRoutes = [
	'/api/auth',
	'/api/health',
	'/api/register',
	'/api/verify-email',
	'/api/resend-otp',
	'/api/forgot-password',
	'/api/reset-password',
	'/api/contact',
	'/api/sendinvoice'
]

export default auth((req) => {
	const { nextUrl } = req
	const isLoggedIn = !!req.auth

	console.log(`Middleware: ${nextUrl.pathname}, isLoggedIn: ${isLoggedIn}`) // Debug log

	if (apiRoutes.some(route => nextUrl.pathname.startsWith(route))) {
		return NextResponse.next()
	}

	// Allow static files and Next.js internals
	if (
		nextUrl.pathname.startsWith('/_next/') ||
		nextUrl.pathname.startsWith('/api/') ||
		nextUrl.pathname.includes('.') ||
		nextUrl.pathname.startsWith('/favicon')
	) {
		return NextResponse.next()
	}

	// Check if current path is a protected route
	const isProtectedRoute = protectedRoutes.some(route =>
		nextUrl.pathname.startsWith(route)
	)

	// Check if current path is a public route
	const isPublicRoute = publicRoutes.some(route =>
		nextUrl.pathname === route || nextUrl.pathname.startsWith(route)
	)

	// If it's a public route, allow access
	if (isPublicRoute) {
		return NextResponse.next()
	}

	// If user is not logged in and trying to access protected route
	if (!isLoggedIn && isProtectedRoute) {
		const signInUrl = new URL('/signin', nextUrl.origin)
		signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
		return NextResponse.redirect(signInUrl)
	}

	// If user is logged in and trying to access auth pages, redirect to dashboard
	if (isLoggedIn && (nextUrl.pathname === '/signin' || nextUrl.pathname === '/signup' || nextUrl.pathname === '/register')) {
		return NextResponse.redirect(new URL('/dashboard', nextUrl.origin))
	}

	return NextResponse.next()
})

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 