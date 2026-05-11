"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  FaXTwitter,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaLink,
} from "react-icons/fa6";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string; // make required — always pass explicitly
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const platforms = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&via=tooxclusive_com`,
      icon: <FaXTwitter />,
      color: "hover:text-black dark:hover:text-white",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebook />,
      color: "hover:text-[#1877F2]",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedUrl}`,
      icon: <FaWhatsapp />,
      color: "hover:text-[#25D366]",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: <FaTelegram />,
      color: "hover:text-[#229ED9]",
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          title={p.name}
          className={`p-2 rounded-lg text-muted-foreground transition-colors hover:bg-muted/40 text-base ${p.color}`}
        >
          {p.icon}
        </a>
      ))}
      <button
        onClick={copyLink}
        title="Copy link"
        className="p-2 rounded-lg text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors text-base"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <FaLink />}
      </button>
    </div>
  );
}
