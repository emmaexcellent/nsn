"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { NewsletterSubscription } from "./newsletter-subscription";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-navy dark:bg-gray-900 text-white">
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Image
              src="/images/nsn-white.png"
              width={100}
              height={50}
              alt="NSN Logo"
            />
            <p className="text-gray-300 text-sm">
              Connecting students with national and international scholarship
              opportunities to unlock their potential.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/profile.php?id=61581827137272">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-gold hover:bg-white/10"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://www.instagram.com/newtonscholarshipnexus?igsh=dnV3aXIyOGFsZzF6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-gold hover:bg-white/10"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="https://chat.whatsapp.com/FHcHvaVlmR8CljrgLiHewk?mode=hqrc">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-gold hover:bg-white/10"
                >
                  <svg
                    viewBox="0 0 48 48"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <title>Whatsapp-color</title>{" "}
                      <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                      <g
                        id="Icons"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        {" "}
                        <g
                          id="Color-"
                          transform="translate(-700.000000, -360.000000)"
                          fill="#67C15E"
                        >
                          {" "}
                          <path
                            d="M723.993033,360 C710.762252,360 700,370.765287 700,383.999801 C700,389.248451 701.692661,394.116025 704.570026,398.066947 L701.579605,406.983798 L710.804449,404.035539 C714.598605,406.546975 719.126434,408 724.006967,408 C737.237748,408 748,397.234315 748,384.000199 C748,370.765685 737.237748,360.000398 724.006967,360.000398 L723.993033,360.000398 L723.993033,360 Z M717.29285,372.190836 C716.827488,371.07628 716.474784,371.034071 715.769774,371.005401 C715.529728,370.991464 715.262214,370.977527 714.96564,370.977527 C714.04845,370.977527 713.089462,371.245514 712.511043,371.838033 C711.806033,372.557577 710.056843,374.23638 710.056843,377.679202 C710.056843,381.122023 712.567571,384.451756 712.905944,384.917648 C713.258648,385.382743 717.800808,392.55031 724.853297,395.471492 C730.368379,397.757149 732.00491,397.545307 733.260074,397.27732 C735.093658,396.882308 737.393002,395.527239 737.971421,393.891043 C738.54984,392.25405 738.54984,390.857171 738.380255,390.560912 C738.211068,390.264652 737.745308,390.095816 737.040298,389.742615 C736.335288,389.389811 732.90737,387.696673 732.25849,387.470894 C731.623543,387.231179 731.017259,387.315995 730.537963,387.99333 C729.860819,388.938653 729.198006,389.89831 728.661785,390.476494 C728.238619,390.928051 727.547144,390.984595 726.969123,390.744481 C726.193254,390.420348 724.021298,389.657798 721.340985,387.273388 C719.267356,385.42535 717.856938,383.125756 717.448104,382.434484 C717.038871,381.729275 717.405907,381.319529 717.729948,380.938852 C718.082653,380.501232 718.421026,380.191036 718.77373,379.781688 C719.126434,379.372738 719.323884,379.160897 719.549599,378.681068 C719.789645,378.215575 719.62006,377.735746 719.450874,377.382942 C719.281687,377.030139 717.871269,373.587317 717.29285,372.190836 Z"
                            id="Whatsapp"
                          >
                            {" "}
                          </path>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/scholarships", label: "Browse Scholarships" },
                { href: "/blog", label: "Resources & Tips" },
                { href: "/about", label: "About NSN" },
                { href: "/contact", label: "Contact Us" },
                { href: "/dashboard", label: "Student Dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold" />
                <span className="text-gray-300">
                  info@newtonscholarshipnexus.org
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gold" />
                <span className="text-gray-300">
                  123 Education Blvd, Learning City, LC 12345
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="text-gray-300 text-sm">
              Subscribe to our newsletter for the latest scholarship
              opportunities and tips.
            </p>
            <NewsletterSubscription />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Newton Scholarship Nexus. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-gold text-sm transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-300 hover:text-gold text-sm transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
