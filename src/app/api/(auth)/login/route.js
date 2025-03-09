import { NextResponse } from "next/server";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

// Database files
import { eq } from "drizzle-orm";
import { users } from '@db/schema';
import { db } from '@db/db';

// Define the secret key
const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// Define a schema using Zod
const userSchema = z.object({
    email: z.string().email({ message: "A valid email is required." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
    // rememberMe: z.boolean({ message: "Invalid input" }).optional()
});

export async function POST(req) {
    const { email, password } = await req.json() //awaiting our JSON666

    // Validate incoming data
    try {
        userSchema.parse({ email, password });
    } catch (err) {

        const result = err.errors.reduce((acc, { path, message }) => {
            const key = path.join('.');
            acc[key] = message;
            return acc; 
        }, {});

        return NextResponse.json({ errors: result }, { status: 400 });
    }

    try {

        // fetch email, password
        const fetchUserDetails = await db.execute(`SELECT email, password  FROM users WHERE email = '${email}' LIMIT 1`);

        // user not found
        if (fetchUserDetails[0].length == 0) {
            return NextResponse.json({ errors: { "email": "Invalid credentials" } }, { status: 400 });
        }

        //password compare
        try {
            const isMatch = await bcrypt.compare(password, fetchUserDetails[0][0].password);
            if (!isMatch) {
                return NextResponse.json({ errors: { "email": "Invalid credentials" } }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({ errors: { "email": "Invalid credentials" } }, { status: 400 });
        }


        // setting up client token
        const tokenData = {
            email: email
        };


        // Define token expiration and other claims
        const expirationTime = '30d'; // 30 days
        const issuedAt = Math.floor(Date.now() / 1000);

        // Generate the token
        const token = await new SignJWT(tokenData)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' }) // Algorithm and header
        .setIssuedAt(issuedAt)                            // Current time
        .setExpirationTime(expirationTime)                // Expiration time
        .sign(secret);   

        const response = NextResponse.json({ message: "Successfully logged in" }, { status: 200 });
        response.cookies.set("authToken", token, { httpOnly: true });
        return response; //returning our data so we can access it later

    }
    catch (err) {
        return NextResponse.json({ errors: { email: err.message } }, { status: 500 });
    }
}




/*

export async function POST(req) {
    const { name, email, password, rememberMe } = await req.json();

    // Validate incoming data
    try {
        userSchema.parse({ name, email, password, rememberMe });
    } catch (err) {
        return NextResponse.json({ error: err.errors.map(e => e.message) }, { status: 400 });
    }

    try {
        console.log(name, email, password, rememberMe);

        // Save the user to the database
        const result = await db.insert(users).values({ name, email, password, rememberMe });
        console.log(result);

        return NextResponse.json({ message: "User registered successfully.", userId: result.id }, { status: 201 });
    } catch (err) {
        console.error(err); // Log error for server-side debugging

        // Send back a user-friendly error message, while logging the detailed error
        let errorMessage = "An error occurred while processing your request.";

        // Check for specific database error types
        if (err.code === 'ER_DUP_ENTRY') {
            errorMessage = "An account with this email already exists.";
        } else if (err.code === 'ER_BAD_NULL_ERROR') {
            errorMessage = "Some required fields are missing.";
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
*/

// Sign Up,
// 1) Register a user.
//    - Get the details
//    - check for duplicate
//    - save in database
//    - directly login the user.

// 2) 