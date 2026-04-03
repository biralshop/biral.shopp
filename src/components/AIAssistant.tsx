import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  User, 
  Bot,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Salam! Mən BiralAI, sizin premium alış-veriş köməkçinizəm. Sizə necə kömək edə bilərəm?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000); // 40 seconds timeout

    try {
      // Determine the API URL automatically based on hostname
      const isLocal = window.location.hostname === 'localhost';
      const apiUrl = isLocal ? 'http://localhost:5000/api' : (import.meta.env.VITE_API_URL || 'https://biralstore-api.onrender.com/api');
      
      console.log(`BiralAI [${isLocal ? 'LOCAL' : 'PROD'}] calling: ${apiUrl}/ai/chat`);
      
      const response = await fetch(`${apiUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ 
          messages: messages.concat({ role: 'user', content: userMessage }).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (response.ok && data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        const errorMsg = data.error || data.details || 'Bilinməyən xəta';
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('BiralAI Error:', error);
      
      let displayError = error.message || 'Kiçik bir xəta baş verdi.';
      if (error.name === 'AbortError') {
        displayError = 'Server çox gec cavab verir (Timeout). Zəhmət olmasa yenidən cəhd edin.';
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Bağışlayın, problem yarandı: "${displayError}". Zəhmət olmasa bir az sonra yenidən yoxlayın.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className={cn(
          "bg-background/95 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-2xl mb-4 overflow-hidden flex flex-col transition-all duration-300 ease-in-out origin-bottom-right",
          isMinimized ? "h-14 w-64" : "h-[500px] w-[350px] md:w-[400px]"
        )}>
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">BiralAI Premium</h3>
                <p className="text-[10px] opacity-80">Claude 4.6 Opus tərəfindən</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 hover:bg-white/10" 
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 hover:bg-white/10" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={cn(
                      "flex gap-3 max-w-[85%]",
                      m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}>
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                        m.role === 'user' ? "bg-accent" : "bg-primary"
                      )}>
                        {m.role === 'user' ? <User className="h-4 w-4 text-accent-foreground" /> : <Bot className="h-4 w-4 text-primary-foreground" />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed",
                        m.role === 'user' 
                          ? "bg-accent text-accent-foreground rounded-tr-none" 
                          : "bg-muted text-foreground rounded-tl-none border border-border/50"
                      )}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 mr-auto items-center">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-muted/30">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="relative"
                >
                  <Input 
                    placeholder="Sualınızı yazın..."
                    className="pr-10 bg-background border-primary/20 focus-visible:ring-primary rounded-xl h-11"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    className="absolute right-1 top-1 h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  BiralAI hər zaman köməyə hazırdır ✨
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 hover:scale-110 transition-all flex items-center justify-center p-0 group"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground group-hover:hidden" />
          <Sparkles className="h-6 w-6 text-primary-foreground hidden group-hover:block animate-pulse" />
        </Button>
      )}
    </div>
  );
};

export default AIAssistant;
