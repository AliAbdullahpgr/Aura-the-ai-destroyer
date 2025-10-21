'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Image from 'next/image';
import { story, type StoryNode, type Choice } from '@/lib/game-story';
import { getAiVoice, getDynamicBackground } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { ChatMessage } from './ChatMessage';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type GameState = {
  certainty: number;
  empathy: number;
  logic: number;
};

type ChatLogEntry = {
  speaker: 'AI' | 'PLAYER';
  text: string;
  isGlitching?: boolean;
};

export function GameClient() {
  const [gameState, setGameState] = useState<GameState>({ certainty: 75, empathy: 10, logic: 90 });
  const [currentNode, setCurrentNode] = useState<StoryNode>(story[0]);
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(
    PlaceHolderImages.find(p => p.id === 'initial-background')?.imageUrl || null
  );
  const [isPending, startTransition] = useTransition();
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Start the game with the first AI message
    processAiTurn(story[0]);
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [audioUrl]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableViewport) {
            scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        }
    }
  }, [chatLog]);

  const processAiTurn = async (node: StoryNode) => {
    if (node.type !== 'AI') return;

    setIsAiThinking(true);
    setAudioUrl(null);
    
    setChatLog(prev => [...prev, { speaker: 'AI', text: node.text, isGlitching: Math.abs(gameState.empathy - gameState.logic) > 50 }]);
    
    startTransition(async () => {
      const [voiceResult, backgroundResult] = await Promise.all([
        getAiVoice({
          certaintyMeter: gameState.certainty,
          empathyMeter: gameState.empathy,
          logicMeter: gameState.logic,
          text: node.text,
        }),
        getDynamicBackground({
          empathyLevel: gameState.empathy,
          certaintyLevel: gameState.certainty,
        }),
      ]);

      if (voiceResult.success) {
        setAudioUrl(voiceResult.data.audioUri);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: voiceResult.error });
      }

      if (backgroundResult.success) {
        setBackgroundUrl(backgroundResult.data.imageUrl);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: backgroundResult.error });
      }
      
      setIsAiThinking(false);

      if (node.ending) {
        // Handle ending logic here
        return;
      }
      
      const nextNode = story.find(n => n.id === node.nextId);
      if (nextNode) {
        setCurrentNode(nextNode);
      }
    });
  };

  const handleChoice = (choice: Choice) => {
    if (isAiThinking) return;

    // Add player's choice to chat log
    setChatLog(prev => [...prev, { speaker: 'PLAYER', text: choice.text }]);

    // Update game state
    startTransition(() => {
        setGameState(prev => ({
            certainty: Math.max(0, Math.min(100, prev.certainty + (choice.effects.certainty || 0))),
            empathy: Math.max(0, Math.min(100, prev.empathy + (choice.effects.empathy || 0))),
            logic: Math.max(0, Math.min(100, prev.logic + (choice.effects.logic || 0))),
        }));

        const nextNode = story.find(n => n.id === choice.nextId);
        if (nextNode) {
            setCurrentNode(nextNode);
            processAiTurn(nextNode);
        }
    });
  };
  
  return (
    <>
      {backgroundUrl && (
        <div className="fixed inset-0 -z-10 transition-opacity duration-1000">
            <Image
                key={backgroundUrl} // Force re-render on change
                src={backgroundUrl}
                alt="Dynamic AI background"
                fill
                className="object-cover opacity-20 animate-in fade-in-0 duration-1000"
            />
        </div>
      )}
      <div className="w-full max-w-4xl h-[85vh] flex flex-col gap-4">
        <div className='text-center'>
            <h1 className="text-4xl font-headline font-bold text-accent">Negotiate or Never</h1>
            <p className="text-foreground/60 mt-2">The fate of humanity rests on your words.</p>
        </div>
        <StatusBar {...gameState} />
        <Card className="flex-1 flex flex-col p-4 bg-black/20 backdrop-blur-sm border-primary/20">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {chatLog.map((entry, index) => (
                <ChatMessage key={index} {...entry} />
              ))}
              {isAiThinking && (
                 <div className="flex items-start gap-3 justify-start">
                    <div className="w-8 h-8 border border-primary rounded-full flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    </div>
                    <div className="max-w-md rounded-lg px-4 py-2.5 bg-primary/10 text-foreground italic">
                        AURA is processing...
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="mt-4 pt-4 border-t border-primary/20">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentNode.type === 'PLAYER' && !isAiThinking ? (
                currentNode.choices?.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto min-h-12 justify-start text-left whitespace-normal leading-snug border-accent/50 hover:bg-accent/20 hover:text-accent-foreground"
                    onClick={() => handleChoice(choice)}
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {choice.text}
                  </Button>
                ))
              ) : (
                <div className="text-center text-foreground/50 col-span-2">
                    {currentNode.ending ? `Ending: ${currentNode.ending}` : 'Awaiting AURA\'s response...'}
                </div>
              )}
            </div>
          </div>
        </Card>
        {audioUrl && <audio ref={audioRef} src={audioUrl} />}
      </div>
    </>
  );
}
