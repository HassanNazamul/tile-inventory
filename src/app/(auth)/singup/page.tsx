'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface DataInterface {
    name: string;
    email: string;
    password: string;
    acceptTerms: boolean;
}

export default function SignUp() {
    const router = useRouter();
    const [data, setData] = useState<DataInterface>({
        name: '',
        email: '',
        password: '',
        acceptTerms: false,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({ ...prev, acceptTerms: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/singup', data);
            router.push('/login');
        } catch (err: any) {
            setErrors(err.response?.data?.errors || {});
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign Up</CardTitle>
                        <CardDescription>Enter your details to create an account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" name="name" value={data.name} onChange={handleChange} required />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" name="email" value={data.email} onChange={handleChange} required />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" name="password" value={data.password} onChange={handleChange} required />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input id="acceptTerms" type="checkbox" name="acceptTerms" checked={data.acceptTerms} onChange={handleCheckboxChange} className="w-4 h-4" />
                                <Label htmlFor="acceptTerms">I agree to the <a href="#" className="underline">terms and conditions</a></Label>
                            </div>
                            {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}

                            <Button type="submit" className="w-full">Sign Up</Button>

                            <p className="mt-4 text-center text-sm">
                                Already have an account? <Link href="/login" className="underline">Log in</Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}