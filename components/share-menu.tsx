"use client";

import { useCallback, useState } from "react";
import { Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { shareMenuContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Joke } from "@/types/jokes";
import { ShareCheckIcon, WhatsAppIcon } from "./icons";
import { toast } from "sonner";

interface ShareMenuProps {
  joke: Joke;

  variant?: "default" | "outline" | "ghost";

  size?: "default" | "sm" | "lg" | "icon";

  className?: string;
}

// Componente para compartilhar piadas através de diferentes canais

export default function ShareMenu({
  joke,
  variant = "ghost",
  size = "sm",
  className,
}: ShareMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verifica se a API Web Share está disponível
  const isShareAvailable: boolean =
    typeof navigator !== "undefined" &&
    !!navigator.share &&
    !!window.isSecureContext;

  const canShare = !!isShareAvailable;

  // Função para compartilhar conteúdo
  const shareContent = useCallback(
    async (data: {
      title?: string;
      text?: string;
      url?: string;
    }): Promise<boolean> => {
      if (!isShareAvailable) return false;

      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        // Ignora erros de cancelamento pelo usuário
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Erro ao compartilhar conteúdo:", error);
        }
        return false;
      }
    },
    [isShareAvailable]
  );

  // Função para copiar texto para a área de transferência
  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      // Verifica se a API Clipboard está disponível
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (error) {
          console.error("Erro ao copiar para a área de transferência:", error);
          return false;
        }
      } else {
        // Fallback para navegadores que não suportam a API Clipboard
        // Nota: Este método não manipula diretamente o DOM
        console.warn(
          "API Clipboard não disponível. Usando método alternativo."
        );
        return false;
      }
    },
    []
  );

  // Compartilhar piada usando a API Web Share ou fallback para clipboard
  const shareJoke = useCallback(
    async (joke: Joke) => {
      // Tentar usar a API Web Share se disponível
      if (canShare) {
        const shareData = {
          title: "Chuck Norris Joke",
          text: joke.value,
          url: joke.url || window.location.href,
        };

        const success = await shareContent(shareData);

        if (success) {
          toast("Shared!", {
            description: "Joke shared successfully",
            duration: 2000,
          });
          return;
        }
      }

      // Fallback para clipboard se Web Share não estiver disponível ou falhar
      await copyToClipboard(joke.value);
    },
    [canShare, shareContent, copyToClipboard]
  );

  // Copia o texto da piada para a área de transferência

  const handleCopyToClipboard = async () => {
    if (joke.value) {
      await copyToClipboard(joke.value);
      setIsMenuOpen(false);
    }
  };

  // Compartilha a piada via WhatsApp
  const handleShareViaWhatsApp = () => {
    if (joke.value) {
      const text = encodeURIComponent(joke.value);
      window.open(
        `https://wa.me/?text=${text}`,
        "_blank",
        "noopener,noreferrer"
      );
      setIsMenuOpen(false);
    }
  };

  // Compartilha a piada usando a API Web Share

  const handleShare = async () => {
    await shareJoke(joke);
    setIsMenuOpen(false);
  };

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn("whitespace-nowrap", className)}>
          <Share2 className="h-4 w-4 mr-1" />
          <span className="text-sm">{shareMenuContent.shareButton}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={handleCopyToClipboard}
          className="cursor-pointer"
        >
          <Copy className="h-4 w-4 mr-2" />
          <span>{shareMenuContent.copyToClipboard}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleShareViaWhatsApp}
          className="cursor-pointer"
        >
          <WhatsAppIcon className="h-4 w-4 mr-2" />
          <span>{shareMenuContent.shareViaWhatsApp}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
          <ShareCheckIcon className="h-4 w-4 mr-2" />
          <span>{shareMenuContent.share}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
