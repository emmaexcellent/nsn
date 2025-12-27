"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/home/hero";
import Testimonials from "@/components/home/testimonials";
import { ScholarshipCard } from "@/components/schorlarships/scholarship-card";
import { Models } from "appwrite";
import HomeBlogList from "@/components/home/blogs";

type HomePageProps = {
  featuredScholarships: Models.Document[];
};

export default function HomePageMain({ featuredScholarships }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Scholarships */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Featured Opportunities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover prestigious scholarships that could transform your
              educational journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-3">
            {featuredScholarships.map((scholarship, index) => (
              <ScholarshipCard
                key={scholarship.$id}
                scholarship={scholarship}
                variant="featured"
                animationDelay={index * 200}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/scholarships">
              <Button
                size="lg"
                variant="outline"
                className="border-navy text-navy hover:bg-navy hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy bg-transparent"
              >
                View All Scholarships
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Blog/Resources Preview */}
      <HomeBlogList />

      {/* CTA Section */}
      <section className="py-20 bg-navy dark:bg-gray-800 text-white">
        <div className="w-full max-w-6xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Scholarship Journey?
            </h2>
            <p className="text-xl text-gray-200">
              Join thousands of students who have already discovered their
              perfect scholarship opportunities through NSN.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scholarships">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4"
                >
                  Explore Scholarships
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-navy text-lg px-8 py-4 bg-transparent"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
