/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import ErrorMessage from "../error-message";
import Link from "next/link";
import PageTransitionLoader from "@/app/_common/animations/page-transition";

// to send requesto to server
interface FormDataInterface {
  email: string,
  password: string
}

// Define Zod validation schema
const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //state for email and pssword
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    emailValid: boolean;
    passwordValid: boolean;
  }>({
    emailValid: false,
    passwordValid: false,
  });

  //state for form data combined both email and password used to send request to server
  const [data, setData] = useState<FormDataInterface>({ email: "", password: "" })

  //to make login button disabled, stopping unnessary request.
  const [isFormValid, setIsFormValid] = useState(false);




  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);

    const result = schema.shape.email.safeParse(e.target.value);

    setErrors((prevErrors) => {
      const updatedErrors = {
        ...prevErrors,
        email: result.success ? " " : result.error.format()._errors[0],
        emailValid: result.success,
      };

      setIsFormValid(updatedErrors.emailValid && updatedErrors.passwordValid);
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

      setIsFormValid(updatedErrors.emailValid && updatedErrors.passwordValid);
      return updatedErrors;
    });

    if (result.success) {
      setData((prevData) => ({
        ...prevData,
        password: e.target.value,
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let post;
    try {
      post = await axios.post("/api/login", data);
    }
    catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "invalid credentials",
        passwordValid: false,
        email: "invalid credentials",
        emailValid: false
      }));

      setLoading(false); // Hide loader only if there's an error
    }



    // console.log('Status:', data);
    if (post?.status === 200) {
      router.push("/warehouse");
    }


  }//end of handleSubmit

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>

            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Fullscreen loader */}
              {loading && (
                <PageTransitionLoader />
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">

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
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
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

                  <Button type="submit" className="w-full" disabled={!isFormValid}>
                    Login
                  </Button>
                </div>

                {/* Signup */}
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="singup" className="underline underline-offset-4">
                    Sign up
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
