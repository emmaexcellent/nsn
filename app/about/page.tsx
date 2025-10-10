"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Users, Award, Globe, Heart, Target, Eye, ArrowRight, Linkedin, Twitter, Mail } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Students Helped", value: "10,000+", description: "Aspiring scholars guided to success" },
    { icon: Award, label: "Scholarships Listed", value: "200+", description: "Opportunities from around the world" },
    { icon: Globe, label: "Countries Covered", value: "25+", description: "Global reach and impact" },
    { icon: Heart, label: "Success Stories", value: "500+", description: "Dreams turned into reality" },
  ]

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & Executive Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Former scholarship recipient with a PhD in Education Policy. Passionate about breaking down barriers to higher education.",
      linkedin: "#",
      twitter: "#",
      email: "sarah@newtonscholarshipnexus.org",
    },
    {
      name: "Michael Rodriguez",
      role: "Director of Programs",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Rhodes Scholar and education advocate with 10+ years of experience in scholarship program management.",
      linkedin: "#",
      twitter: "#",
      email: "michael@newtonscholarshipnexus.org",
    },
    {
      name: "Dr. Aisha Patel",
      role: "Research & Analytics Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Data scientist specializing in educational analytics. Helps optimize our scholarship matching algorithms.",
      linkedin: "#",
      twitter: "#",
      email: "aisha@newtonscholarshipnexus.org",
    },
    {
      name: "David Chen",
      role: "Technology Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Full-stack developer and former Gates Scholar. Builds the technology that powers our platform.",
      linkedin: "#",
      twitter: "#",
      email: "david@newtonscholarshipnexus.org",
    },
    {
      name: "Lisa Thompson",
      role: "Community Outreach Manager",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Connects with schools, organizations, and communities to spread awareness about scholarship opportunities.",
      linkedin: "#",
      twitter: "#",
      email: "lisa@newtonscholarshipnexus.org",
    },
    {
      name: "James Wilson",
      role: "Content & Communications",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Former journalist and Fulbright Scholar. Creates educational content and manages our communications.",
      linkedin: "#",
      twitter: "#",
      email: "james@newtonscholarshipnexus.org",
    },
  ]

  const partners = [
    { name: "Gates Foundation", logo: "/placeholder.svg?height=80&width=160" },
    { name: "Ford Foundation", logo: "/placeholder.svg?height=80&width=160" },
    { name: "Rhodes Trust", logo: "/placeholder.svg?height=80&width=160" },
    { name: "Fulbright Program", logo: "/placeholder.svg?height=80&width=160" },
    { name: "College Board", logo: "/placeholder.svg?height=80&width=160" },
    { name: "UNCF", logo: "/placeholder.svg?height=80&width=160" },
  ]

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <section className="py-24 lg:py-40 bg-gradient-to-br from-navy to-navy/90 text-white">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold">
              About Newton Scholarship Nexus
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Bridging the gap between talented students and life-changing
              scholarship opportunities
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-gold" />
                  <div className="text-2xl md:text-3xl font-bold text-gold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Newton Scholarship Nexus was founded on the belief that every
                talented student, regardless of their background, deserves
                access to quality higher education. We exist to eliminate the
                information gap that prevents deserving students from
                discovering and securing scholarship opportunities.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Named after Sir Isaac Newton, who once said &quot;If I have seen
                further it is by standing on the shoulders of Giants,&quot; we
                believe in empowering the next generation of scholars to build
                upon the knowledge and achievements of those who came before
                them.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Students studying together"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our Vision & Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-navy dark:text-gold" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  A world where every student with potential has the opportunity
                  to pursue higher education, regardless of their economic
                  circumstances.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-navy dark:text-gold" />
                </div>
                <CardTitle>Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We make scholarship information accessible to all students,
                  breaking down barriers of geography, language, and
                  socioeconomic status.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-navy dark:text-gold" />
                </div>
                <CardTitle>Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We empower students with the knowledge, resources, and
                  confidence they need to successfully navigate the scholarship
                  application process.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-navy dark:text-gold" />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We foster a supportive community where scholars can connect,
                  share experiences, and support each other&apos;s educational
                  journeys.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-navy dark:text-gold" />
                </div>
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We maintain the highest standards in our research, platform
                  development, and student support services.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-navy dark:text-gold" />
                </div>
                <CardTitle>Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We work to create positive change on a global scale,
                  connecting students with opportunities worldwide.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Passionate educators, former scholarship recipients, and
              technology experts working together to make a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {member.bio}
                  </CardDescription>
                  <div className="flex justify-center space-x-4">
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`mailto:${member.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our Partners
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Working together with leading organizations to expand scholarship
              access
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex justify-center items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy dark:bg-gray-800 text-white">
        <div className="w-full max-w-6xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Join Our Mission</h2>
            <p className="text-xl text-gray-200">
              Whether you&apos;re a student seeking opportunities, an educator
              wanting to help, or an organization looking to partner with us,
              there&apos;s a place for you in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scholarships">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4"
                >
                  Find Scholarships
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-navy text-lg px-8 py-4 bg-transparent"
                >
                  Get Involved
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
