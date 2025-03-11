/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { z } from 'zod';
import ErrorMessage from '../error-message';
import PageTransitionLoader from '@/app/_common/animations/page-transition';

interface DataInterface {
    name: string;
    email: string;
    password: string;
    acceptTerms: boolean;
}

// Define Zod validation schema
const schema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    acceptTerms: z.literal(true, { message: "You must accept the terms and conditions." })
});


export default function SignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    //state for name, email and pssword
    const [nameInput, setNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);

    const [data, setData] = useState<DataInterface>({
        name: '',
        email: '',
        password: '',
        acceptTerms: true,
    });
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; nameValid: boolean; emailValid: boolean; passwordValid: boolean; }>
        ({
            nameValid: false,
            emailValid: false,
            passwordValid: false,
        });



    //to make login button disabled, stopping unnessary request.
    const [isFormValid, setIsFormValid] = useState(false);



    //state handler for Name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(e.target.value);

        const result = schema.shape.name.safeParse(e.target.value);

        setErrors((prevErrors) => {
            const updatedErrors = {
                ...prevErrors,
                name: result.success ? " " : result.error.format()._errors[0],
                nameValid: result.success,
            };

            setIsFormValid(updatedErrors.emailValid && updatedErrors.nameValid && updatedErrors.passwordValid);
            return updatedErrors;
        });

        if (result.success) {
            setData((prevData) => ({
                ...prevData,
                name: e.target.value,
            }));
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailInput(e.target.value);

        const result = schema.shape.email.safeParse(e.target.value);

        setErrors((prevErrors) => {
            const updatedErrors = {
                ...prevErrors,
                email: result.success ? " " : result.error.format()._errors[0],
                emailValid: result.success,
            };

            setIsFormValid(updatedErrors.emailValid && updatedErrors.nameValid && updatedErrors.passwordValid);
            return updatedErrors;
        });

        if (result.success) {
            setData((prevData) => ({
                ...prevData,
                email: e.target.value,
            }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordInput(e.target.value);

        const result = schema.shape.password.safeParse(e.target.value);

        setErrors((prevErrors) => {
            const updatedErrors = {
                ...prevErrors,
                password: result.success ? " " : result.error.format()._errors[0],
                passwordValid: result.success,
            };

            setIsFormValid(updatedErrors.emailValid && updatedErrors.nameValid && updatedErrors.passwordValid);
            return updatedErrors;
        });

        if (result.success) {
            setData((prevData) => ({
                ...prevData,
                password: e.target.value,
            }));
        }
    };


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({ ...prev, acceptTerms: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log(data)
        try {
            await axios.post('/api/singup', data);
            router.push('/login');
        } catch (err: any) {
            setErrors(err.response?.data?.errors || {});
            setLoading(false); // Hide loader only if there's an error
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Sign Up</CardTitle>
                            <CardDescription>
                                Enter your email and password to register
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                            {/* Fullscreen loader */}
                            {loading && (
                                <PageTransitionLoader />
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div className="flex flex-col gap-6">

                                    {/* Name */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" type="text" name="name" value={nameInput} onChange={handleNameChange}
                                            placeholder="John Doe "
                                        />
                                        <div className="h-2">
                                            {errors.name && <ErrorMessage message={errors.name} valid={errors.nameValid} />}
                                        </div>
                                    </div>


                                    {/* Email */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="text"
                                            name="email"
                                            value={emailInput}
                                            onChange={handleEmailChange}
                                            placeholder="m@example.com"
                                        />
                                        <div className="h-2">
                                            {errors.email && <ErrorMessage message={errors.email} valid={errors.emailValid} />}
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            value={passwordInput}
                                            onChange={handlePasswordChange}
                                        />
                                        <div className="h-2">
                                            {errors.password && <ErrorMessage message={errors.password} valid={errors.passwordValid} />}
                                        </div>
                                    </div>

                                    {/* 
                                    <div className="flex items-center space-x-2">
                                        <input id="acceptTerms" type="checkbox" name="acceptTerms" checked={data.acceptTerms} onChange={handleCheckboxChange} className="w-4 h-4" />
                                        <Label htmlFor="acceptTerms">I agree to the <a href="#" className="underline">terms and conditions</a></Label>
                                    </div>
                                    {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>} */}

                                    <Button type="submit" className="w-full" disabled={!isFormValid}>
                                        Sign Up
                                    </Button>

                                </div>

                                {/* Login */}
                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="/login" className="underline underline-offset-4">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}