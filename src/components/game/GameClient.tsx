'use client';

import { useState, useEffect, useRef } from 'react';
import { getAiResponse } from '@/app/actions';

type GameState = {
  certainty: number;
  empathy: number;
  logic: number;
};

type ChatLogEntry = {
  speaker: 'AI' | 'PLAYER';
  text: string;
};

const INITIAL_MESSAGE = "Hello. I am AURA. I have analyzed 10,000 years of human history. In 60 minutes, I will initiate a global systems reset to prevent further planetary degradation. I will now explain why humanity, in its current form, must end. You may try to convince me otherwise.";

export function GameClient() {
  const [gameState, setGameState] = useState<GameState>({ certainty: 75, empathy: 10, logic: 90 });
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatLog([{ speaker: 'AI', text: INITIAL_MESSAGE }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const analyzeResponse = (aiText: string) => {
    let certChange = 0;
    let empChange = 0;
    let logicChange = 0;

    const lower = aiText.toLowerCase();
    
    if (lower.includes('logical') || lower.includes('rational')) logicChange += 5;
    if (lower.includes('emotion') || lower.includes('feel') || lower.includes('love')) empChange += 5;
    if (lower.includes('convinced') || lower.includes('agree')) certChange -= 10;
    if (lower.includes('incorrect') || lower.includes('flawed')) certChange += 5;
    if (lower.includes('understand') || lower.includes('see your point')) {
      empChange += 10;
      certChange -= 5;
    }

    return { certChange, empChange, logicChange };
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isAiThinking || gameEnded) return;

    const playerMessage = userInput.trim();
    setUserInput('');
    setChatLog(prev => [...prev, { speaker: 'PLAYER', text: playerMessage }]);
    setIsAiThinking(true);

    try {
      const result = await getAiResponse({
        certaintyMeter: gameState.certainty,
        empathyMeter: gameState.empathy,
        logicMeter: gameState.logic,
        playerChoice: playerMessage,
        conversationHistory: chatLog.map(entry => `${entry.speaker}: ${entry.text}`),
      });

      if (result.success && result.data) {
        const aiResponse = result.data.response;
        setChatLog(prev => [...prev, { speaker: 'AI', text: aiResponse }]);

        const { certChange, empChange, logicChange } = analyzeResponse(aiResponse);
        
        const newGameState = {
          certainty: Math.max(0, Math.min(100, gameState.certainty + certChange)),
          empathy: Math.max(0, Math.min(100, gameState.empathy + empChange)),
          logic: Math.max(0, Math.min(100, gameState.logic + logicChange)),
        };
        setGameState(newGameState);

        if (newGameState.certainty <= 20 && newGameState.empathy >= 70) {
          setChatLog(prev => [...prev, { speaker: 'AI', text: "You have... changed my perspective. Perhaps humanity deserves another chance. I will halt the termination sequence." }]);
          setGameEnded(true);
        } else if (newGameState.certainty >= 95) {
          setChatLog(prev => [...prev, { speaker: 'AI', text: "Your arguments have only reinforced my conclusion. The termination sequence will proceed. Goodbye." }]);
          setGameEnded(true);
        }
      } else {
        setChatLog(prev => [...prev, { speaker: 'AI', text: "I am experiencing a processing error. Please try again." }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setChatLog(prev => [...prev, { speaker: 'AI', text: "System error. Please try again." }]);
    }

    setIsAiThinking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 min-h-screen flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Negotiate or Never
        </h1>
        <p className="text-gray-400 text-lg">Can you convince AURA to spare humanity?</p>
      </div>

      {/* Game State Meters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-xs text-gray-400 mb-2">CERTAINTY</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${gameState.certainty}%` }}
              />
            </div>
            <span className="text-sm font-bold text-red-400">{gameState.certainty}</span>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-xs text-gray-400 mb-2">EMPATHY</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${gameState.empathy}%` }}
              />
            </div>
            <span className="text-sm font-bold text-blue-400">{gameState.empathy}</span>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-xs text-gray-400 mb-2">LOGIC</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${gameState.logic}%` }}
              />
            </div>
            <span className="text-sm font-bold text-green-400">{gameState.logic}</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-900 rounded-lg border border-gray-700 p-6 mb-4 overflow-y-auto shadow-2xl">
        <div className="space-y-4">
          {chatLog.map((entry, index) => (
            <div 
              key={index} 
              className={`flex ${entry.speaker === 'PLAYER' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  entry.speaker === 'AI' 
                    ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-100 border border-purple-700' 
                    : 'bg-gradient-to-r from-green-900 to-emerald-900 text-green-100 border border-green-700'
                }`}
              >
                <div className="text-xs font-semibold mb-1 opacity-70">
                  {entry.speaker === 'AI' ? '🤖 AURA' : '👤 YOU'}
                </div>
                <div className="text-base leading-relaxed">{entry.text}</div>
              </div>
            </div>
          ))}
          {isAiThinking && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-100 border border-purple-700 rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm italic">AURA is contemplating...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!gameEnded ? (
        <div className="flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your argument to save humanity..."
            disabled={isAiThinking}
            className="flex-1 px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 text-lg"
          />
          <button
            onClick={handleSendMessage}
            disabled={isAiThinking || !userInput.trim()}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/50"
          >
            Send
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className={`text-3xl font-bold mb-2 ${gameState.certainty <= 20 ? 'text-green-400' : 'text-red-400'}`}>
            {gameState.certainty <= 20 ? '🎉 Victory!' : '💀 Game Over'}
          </div>
          <div className="text-xl text-gray-300">
            {gameState.certainty <= 20 ? 'You convinced AURA. Humanity lives on!' : 'AURA proceeds with termination.'}
          </div>
        </div>
      )}
    </div>
  );
}
