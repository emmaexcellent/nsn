import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, MessageCircleCode, Share2, TwitterIcon } from "lucide-react";

const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${pageTitle}%20${pageUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={handleCopy}
      >
        <Share2 className="h-4 w-4 mr-2" />
        {copied ? "Link Copied!" : "Copy Link"}
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full">
           <MessageCircleCode className="text-green-600"/> WhatsApp
          </Button>
        </a>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full">
             <Facebook className="text-blue-600"/> Facebook
          </Button>
        </a>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full">
            <TwitterIcon className="text-blue-600"/> Twitter
          </Button>
        </a>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full">
            <Linkedin className="text-blue-600"/> LinkedIn
          </Button>
        </a>
      </div>
    </div>
  );
};

export default ShareButton;
