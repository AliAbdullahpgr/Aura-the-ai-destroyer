import Image from 'next/image';
import { GameClient } from '@/components/game/GameClient';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const initialBackground = PlaceHolderImages.find(p => p.id === 'initial-background');

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="fixed inset-0 -z-10">
        <Image
          src={initialBackground?.imageUrl || "https://picsum.photos/seed/1/1920/1080"}
          alt={initialBackground?.description || "Abstract background"}
          fill
          priority
          className="object-cover opacity-20"
          data-ai-hint={initialBackground?.imageHint || "abstract data"}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      </div>
      <GameClient />
    </main>
  );
}
