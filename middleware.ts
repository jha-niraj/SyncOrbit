import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const protectedRoutes = [
	'/dashboard',
	'/profile',
	'/team',
	'/admin',
	'/settings',
	'/notifications',
	'/role-settings',
	'/projects',
	'/companies',
	'/associations',
	'/analytics'
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
	'/onboarding',
	'/error',
	'/aboutus',
	'/contact',
	'/accelerator',
	'/budgetestimator',
	'/nexinvoice',
	'/projectsdelivered',
	'/pricing',
	'/terms',
	'/privacy'
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

export default withAuth(
	function middleware(req) {
		const { nextUrl, nextauth } = req
		const isLoggedIn = !!nextauth?.token

		console.log(`Middleware: ${nextUrl.pathname}, isLoggedIn: ${isLoggedIn}`) // Debug log

		// If user is logged in and trying to access auth pages, redirect to dashboard
		if (isLoggedIn && (
			nextUrl.pathname === '/signin' ||
			nextUrl.pathname === '/signup' ||
			nextUrl.pathname === '/register' ||
			nextUrl.pathname === '/' // Also redirect root to dashboard if logged in
		)) {
			return NextResponse.redirect(new URL('/dashboard', nextUrl.origin))
		}

		return NextResponse.next()
	},
	{
		callbacks: {
			authorized: ({ req, token }) => {
				const { pathname } = req.nextUrl

				// Allow API routes
				if (pathname.startsWith('/api/')) {
					return true
				}

				// Allow static files and Next.js internals
				if (
					pathname.startsWith('/_next/') ||
					pathname.includes('.') ||
					pathname.startsWith('/favicon')
				) {
					return true
				}

				// Check if current path is a public route
				const isPublicRoute = publicRoutes.some(route =>
					pathname === route || pathname.startsWith(route + '/')
				)

				// If it's a public route, allow access
				if (isPublicRoute) {
					return true
				}

				// Check if current path is a protected route
				const isProtectedRoute = protectedRoutes.some(route =>
					pathname === route || pathname.startsWith(route + '/')
				)

				// If it's a protected route, require authentication
				if (isProtectedRoute) {
					return !!token
				}

				// Default: require authentication for any other route not explicitly public
				return !!token
			},
		},
		pages: {
			signIn: '/signin',
		},
	}
)

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 