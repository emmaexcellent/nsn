"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Gates Scholar",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "NSN helped me discover the Gates Scholarship. Their resources and guidance were invaluable in my application process.",
  },
  {
    name: "Miguel Rodriguez",
    role: "Fulbright Scholar",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The comprehensive database and application tips on NSN made all the difference in securing my Fulbright scholarship.",
  },
  {
    name: "Aisha Patel",
    role: "Rhodes Scholar",
    image: "/placeholder.svg?height=80&width=80",
    quote: "Thanks to NSN's mentorship program, I was able to craft a winning application for the Rhodes Scholarship.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Success Stories</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from scholars who achieved their dreams with NSN's help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</blockquote>
                <div className="flex items-center space-x-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
