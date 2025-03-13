"use client";

import { Info, Menu, MoonIcon, SunIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { headerContent } from "@/lib/content";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  setIsAboutModalOpen: (value: boolean) => void;
}

export default function Header({ setIsAboutModalOpen }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Abre o modal Sobre e fecha o menu mobile
  const handleAboutClick = () => {
    setIsAboutModalOpen(true);
    closeMenu();
  };

  // Alterna o tema e fecha o menu mobile
  const handleThemeToggle = () => {
    toggleTheme();
    closeMenu();
  };

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl sm:text-3xl">💪</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="font-bold text-lg sm:text-xl md:text-2xl tracking-tight"
          >
            {headerContent.title}
          </motion.div>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAboutClick}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-4 w-4 mr-2" />
                  <span>{headerContent.about}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{headerContent.about}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleThemeToggle}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">{headerContent.toggleTheme}</span>
                  <SunIcon className="h-4 w-4 mr-2 dark:block hidden" />
                  <MoonIcon className="h-4 w-4 mr-2 dark:hidden block" />
                  <span>{headerContent.toggleTheme}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{headerContent.toggleTheme}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-t",
          isMenuOpen ? "max-h-56" : "max-h-0 border-t-0"
        )}
      >
        <div className="container mx-auto py-2 px-4 flex flex-col gap-2">
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary text-left w-full"
            onClick={handleAboutClick}
          >
            <Info className="h-5 w-5 flex-shrink-0" />
            <span>{headerContent.about}</span>
          </button>
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary text-left w-full"
            onClick={handleThemeToggle}
          >
            <span className="sr-only">{headerContent.toggleTheme}</span>
            <SunIcon className="h-5 w-5 flex-shrink-0 dark:block hidden" />
            <MoonIcon className="h-5 w-5 flex-shrink-0 dark:hidden block" />
            <span>{headerContent.toggleTheme}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
