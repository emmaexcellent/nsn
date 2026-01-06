"use client";

import { useEffect, useState } from "react";
import { databases, databaseId } from "@/lib/appwrite"; // your Appwrite config
import { Models, Query } from "appwrite";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import { testimonials } from "@/public/constants";

const Testimonials = () => {

  return (
    <section className="w-full max-w-6xl mx-auto py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from scholars who achieved their dreams with NSN&apos;s help
          </p>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <Card className="border shadow-sm hover:shadow transition-all duration-300 mx-3 my-8">
                <CardContent className="p-6 space-y-4  !h-500px] flex flex-col justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-300 italic line-clamp-8">
                    &quot;{testimonial.comment}&quot;
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center rounded-full border">
                      {/* {" "}
                      <User className="h-5 w-5 text-gray-500" /> */}
                      <Image src={testimonial.image} width={50} height={50} alt="testimonial" className="w-15 h-15 object-cover rounded-full" />
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-xs">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
