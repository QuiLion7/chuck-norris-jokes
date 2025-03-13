"use client";

import { motion } from "framer-motion";
import { X, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { aboutContent } from "@/lib/content";

interface AboutModalProps {
  onClose: () => void;
}

// Modal que exibe informações sobre o aplicativo

export default function AboutModal({ onClose }: AboutModalProps) {
  // Referência para o overlay do modal
  const overlayRef = useRef<HTMLDivElement>(null);

  // Função para lidar com clique no overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fechar apenas se o clique foi diretamente no overlay (não em seus filhos)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Função para lidar com teclas
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Animações simplificadas
  const animations = {
    container: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
    item: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    },
  };

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Necessário para capturar eventos de teclado
    >
      <motion.div
        variants={animations.container}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-background rounded-xl shadow-lg max-w-2xl w-full overflow-hidden relative"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <motion.h2
            variants={animations.item}
            className="text-xl font-bold flex items-center"
          >
            <span className="mr-2">ℹ️</span> {aboutContent.about}
          </motion.h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <motion.div variants={animations.item} className="mb-6">
            <p className="text-muted-foreground">
              {aboutContent.description.join(" ")}
            </p>
          </motion.div>

          <motion.div variants={animations.item} className="mb-6">
            <h3 className="text-lg font-medium mb-2">Recursos</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>{aboutContent.feature1}</li>
              <li>{aboutContent.feature2}</li>
              <li>{aboutContent.feature3}</li>
              <li>{aboutContent.feature4}</li>
              <li>{aboutContent.feature5}</li>
              <li>{aboutContent.feature6}</li>
              <li>{aboutContent.feature7}</li>
            </ul>
          </motion.div>

          <motion.div variants={animations.item} className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {aboutContent.technologies}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-secondary/50 p-2 rounded-md text-sm">
                {aboutContent.tech1}
              </div>
              <div className="bg-secondary/50 p-2 rounded-md text-sm">
                {aboutContent.tech2}
              </div>
              <div className="bg-secondary/50 p-2 rounded-md text-sm">
                {aboutContent.tech3}
              </div>
              <div className="bg-secondary/50 p-2 rounded-md text-sm">
                {aboutContent.tech4}
              </div>
              <div className="bg-secondary/50 p-2 rounded-md text-sm">
                {aboutContent.tech5}
              </div>
            </div>
          </motion.div>

          <motion.div variants={animations.item} className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {aboutContent.funFacts}
            </h3>
            <div className="space-y-2">
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-md text-sm">
                {aboutContent.fact1}
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-md text-sm">
                {aboutContent.fact2}
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-md text-sm">
                {aboutContent.fact3}
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-md text-sm">
                {aboutContent.fact4}
              </div>
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-md text-sm">
                {aboutContent.fact5}
              </div>
            </div>
          </motion.div>

          <motion.div variants={animations.item} className="mb-6">
            <h3 className="text-lg font-medium mb-2">{aboutContent.credits}</h3>
            <p className="text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {aboutContent.apiCredit}
            </p>
          </motion.div>

          <motion.div
            variants={animations.item}
            className="text-center text-sm text-muted-foreground"
          >
            <p className="flex items-center justify-center gap-1">
              {aboutContent.madeWith} <Heart className="h-3 w-3 text-red-500" />{" "}
              {new Date().getFullYear()}
            </p>
          </motion.div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <Button onClick={onClose}>{aboutContent.close}</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
