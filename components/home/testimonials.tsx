"use client";

import { useEffect, useState } from "react";
import { databases, databaseId } from "@/lib/appwrite"; // your Appwrite config
import { Models, Query } from "appwrite";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Models.Document[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          "testimonials",
          [Query.limit(10)] // adjust limit as needed
        );
        setTestimonials(response.documents);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from scholars who achieved their dreams with NSN's help
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
                <CardContent className="p-6 space-y-4  !h-[250px] flex flex-col justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-300 italic line-clamp-4">
                    "{testimonial.comment}"
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center rounded-full w-10 h-10 border"> <User className="h-5 w-5 text-gray-500" /></div>
                   
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
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
