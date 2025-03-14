"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Globe } from "lucide-react";
import { useMemo } from "react";
import { footerContent } from "@/lib/content";
import Link from "next/link";

export default function Footer() {
  // Obtém o ano atual para o copyright
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Mapeia os nomes dos ícones para os componentes reais
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return Github;
      case "Linkedin":
        return Linkedin;
      case "Globe":
        return Globe;
      default:
        return Globe;
    }
  };

  return (
    <footer className="border-t bg-background/95 h-full backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
      <div className="container mx-auto px-4 h-auto">
        <div className="flex my-4 flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xl md:text-2xl">🤠</span>
            </motion.div>
            <p className="text-xs md:text-sm text-muted-foreground">
              {footerContent.tagline}
            </p>
          </div>

          <div className="flex gap-4 items-center md:items-end mt-2 md:mt-0">
            <div className="text-xs md:text-sm font-medium">
              {footerContent.developer}{" "}
              <span className="text-[10px] md:text-xs">© {currentYear}</span>
            </div>
            <div className="flex items-center gap-3">
              {footerContent.socialLinks.map(
                (link: { name: string; url: string; icon: string }) => {
                  const IconComponent = getIconComponent(link.icon);
                  return (
                    <Link
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title={link.name}
                    >
                      <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
