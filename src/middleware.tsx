import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define the secret key
const secret = new TextEncoder().encode('nazjwttest');

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value ?? '';

    // Define public pages
    const publicPages = ['/api/login', '/api/singup','/login', '/singup', '/'];
    const isPublicPage = publicPages.includes(request.nextUrl.pathname);

    let isVerified: boolean | object = false;

    // Verify the token if it exists
    if (token) {
        try {
            const { payload } = await jwtVerify(token, secret);
            isVerified = payload; // Assign payload to isVerified
        } catch (err) {
            console.error('Token verification failed:', err.message);
        }
    }

    // Redirect to /login if accessing a private page without a valid token
    if (!isPublicPage && !isVerified) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect authenticated users from /login or public pages
    if (isPublicPage && token && isVerified) {
        const previousUrl = request.headers.get('referer') || '/warehouse';
        return NextResponse.redirect(new URL(previousUrl, request.url));
    }

    // Allow the request to proceed for all other cases
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|public/).*)'], // Match all routes except excluded paths
};