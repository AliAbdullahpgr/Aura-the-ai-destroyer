'use client';

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ChatMessageProps = {
  speaker: 'AI' | 'PLAYER';
  text: string;
  isGlitching?: boolean;
};

export function ChatMessage({ speaker, text, isGlitching = false }: ChatMessageProps) {
  const isAI = speaker === 'AI';

  return (
    <div className={cn("flex items-start gap-3", isAI ? "justify-start" : "justify-end")}>
      {isAI && (
        <Avatar className="w-8 h-8 border border-primary">
          <AvatarFallback className="bg-transparent text-primary text-xs font-bold">AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-md rounded-lg px-4 py-2.5 text-sm md:text-base relative",
          isAI ? "bg-primary/10 text-foreground" : "bg-accent text-accent-foreground",
          isGlitching && "glitch"
        )}
        data-text={isGlitching ? text : ''}
      >
        <p>{text}</p>
      </div>
      {!isAI && (
        <Avatar className="w-8 h-8 border border-accent">
          <AvatarFallback className="bg-transparent text-accent text-xs font-bold">YOU</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
