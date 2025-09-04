import { ArrowRight, ChevronRight } from "lucide-react";
import CountUp from "react-countup";
import { Button } from "../ui/button";
import Link from "next/link";
import { Users, Award, Globe, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  {
    icon: Users,
    label: "Students Reached",
    value: "10000",
    color: "text-blue-600",
  },
  {
    icon: Award,
    label: "Scholarships Listed",
    value: "200",
    color: "text-gold",
  },
  { icon: Globe, label: "Countries", value: "25", color: "text-green-600" },
  {
    icon: DollarSign,
    label: "Total Awards",
    value: "500",
    color: "text-purple-600",
  },
];

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy/90 to-navy/80 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/hero.webp')] bg-cover bg-center"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-40 relative z-10">
        <div
          className={`text-center space-y-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Newton Scholarship
              <span className="block text-gold">Nexus</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Empowering scholars, one opportunity at a time
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-lg text-gray-300">
              Connect with national and international scholarship opportunities.
              Find the resources you need to unlock your educational potential.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/scholarships">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg group"
                >
                  Scholarship Opportunities
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-navy text-lg px-8 py-4 bg-transparent"
                >
                  Learn More About NSN
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 delay-${
                  index * 100
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl md:text-3xl font-bold text-gold">
                  <CountUp end={Number(stat.value)} delay={3} />
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronRight className="h-6 w-6 rotate-90 text-gold" />
      </div>
    </section>
  );
};

export default Hero;
