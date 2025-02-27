"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

const Header = () => {
    return (
        <div className="flex items-center justify-between px-4 py-2 bg-purple-100 text-blue-950">
            {/* Logo on the left */}
            <div className="flex items-center space-x-2">
                {/* Uncomment and adjust the Image component if needed */}
                <div className="relative w-12 h-12 max-w-[50px] max-h-[50px]">
                    <Image
                        src="/assets/nazx-logo.png"
                        alt="Logo"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <span className="font-bold text-sm">Inventory</span>
            </div>

            {/* Buttons in the center */}
            <div className="flex space-x-4">
                <Button variant="link" className="text-blue-950">Home</Button>
                <Button variant="link" className="text-blue-950">About</Button>
                <Button variant="link" className="text-blue-950">Contact</Button>
            </div>

            {/* Profile logo on the right */}
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    );
}

export default Header