import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { getBotResponse, getWelcomeMessage } from '../utils/chatbot';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg: Message = {
        id: 'welcome',
        text: getWelcomeMessage(),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

    const response = getBotResponse(text);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: 'bot',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'How to order?',
    'Contact info',
    'Available medicines',
    'Become a seller',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-pink-50 rounded-2xl shadow-2xl border border-pink-200 overflow-hidden chat-open">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">G&S MEDICAL Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
                  <p className="text-emerald-200 text-xs">Online • Always here to help</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-pink-100/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.sender === 'bot'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gold-400 text-white'
                }`}>
                  {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-tr-sm'
                      : 'bg-pink-50 text-foreground shadow-xs border border-pink-200 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-pink-50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs border border-pink-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-pink-200 bg-pink-50">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInputValue(q);
                      setTimeout(() => sendMessage(), 50);
                    }}
                    className="text-xs bg-pink-100 hover:bg-pink-200 text-emerald-700 px-2.5 py-1 rounded-full border border-pink-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-pink-200 bg-pink-50 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 text-sm border border-pink-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-pink-100/50"
            />
            <Button
              onClick={sendMessage}
              size="icon"
              disabled={!inputValue.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl w-9 h-9 flex-shrink-0"
            >
              <Send size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-emerald-hover flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-emerald-800 rotate-0'
            : 'bg-gradient-to-br from-emerald-600 to-emerald-800 animate-float'
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* Notification dot */}
      {!isOpen && (
        <div className="absolute top-0 right-0 w-4 h-4 bg-gold-400 rounded-full border-2 border-white animate-pulse-slow" />
      )}
    </div>
  );
}
