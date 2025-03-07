'use client';

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";


const images = [
  "https://picsum.photos/id/233/200/300",
  "https://picsum.photos/id/234/200/300",
  "https://picsum.photos/id/235/200/300",
  "https://picsum.photos/id/236/200/300",
  "https://picsum.photos/id/239/200/300",
  "https://picsum.photos/id/238/200/300",
];


export default function Page() {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card
                className="overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedImage(img)}
              >
                <CardContent className="p-0">
                  <img src={img} alt="Gallery" className="w-full h-40 object-cover" />
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <img src={selectedImage} alt="Gallery Preview" className="w-full rounded-lg" />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}
