import { NextResponse } from "next/server";
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Database files
import { users } from '@/db/schema';
import { db } from '@db/db';


// Define a schema using Zod
const userSchema = z.object({
    name: z.string().min(3, { message: "Name is required." }),
    email: z.string().email({ message: "A valid email is required." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
    acceptTerms: z.literal(true, { message: "You must accept the terms and conditions." })
});

export async function POST(req) {
    const { name, email, password, acceptTerms } = await req.json() //awaiting our JSON666


    const duplicateEmailCount = await db.execute(`SELECT COUNT(*) AS count FROM users WHERE email = '${email}'`);

    if (duplicateEmailCount[0][0].count >= 1) {
        return NextResponse.json({ errors: { email: 'This email is taken!' } }, { status: 400 });
    }

    // Validate incoming data
    try {
        userSchema.parse({ name, email, password, acceptTerms });
    } catch (err) {

        const result = err.errors.reduce((acc, { path, message }) => {
            const key = path.join('.');
            acc[key] = message;
            return acc;
        }, {});

        return NextResponse.json({ errors: result }, { status: 400 });
    }

    try {

        // const password = bcrypt.hashSync(password, 10);
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({ name, email, password: hashedPassword, acceptTerms });

        return NextResponse.json({ name, email, hashedPassword, acceptTerms, message: "User data received successfully" }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ errors: { email: err.message } }, { status: 500 });
    }
}




/*

export async function POST(req) {
    const { name, email, password, acceptTerms } = await req.json();

    // Validate incoming data
    try {
        userSchema.parse({ name, email, password, acceptTerms });
    } catch (err) {
        return NextResponse.json({ error: err.errors.map(e => e.message) }, { status: 400 });
    }

    try {
        console.log(name, email, password, acceptTerms);

        // Save the user to the database
        const result = await db.insert(users).values({ name, email, password, acceptTerms });
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