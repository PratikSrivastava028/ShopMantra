import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Trash2,
  Plus,
  MessageSquare,
  Mic,
  MicOff,
  ShoppingBag,
  Check,
  ArrowRight,
  TrendingUp,
  User
} from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';

export const AiBuddyDrawer: React.FC = () => {
  const {
    isOpen,
    setOpen,
    messages,
    conversations,
    activeConversationId,
    isAiTyping,
    sendMessage,
    startNewChat,
    selectConversation,
    clearHistory
  } = useChatStore();

  const { addToCart, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: 'Find Best Deals', prompt: 'Show me the best trending deals in the electronics department' },
    { label: 'Build Workstation', prompt: 'I want to build a setup with a quiet wireless mouse and keyboard' },
    { label: 'Budget Laptop', prompt: 'Find me a high performance gaming laptop under $1000' },
    { label: 'Black Shirts', prompt: 'I need a black office shirt' }
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiTyping]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const textToSend = input;
    setInput('');
    await sendMessage(textToSend);
  };

  const handleQuickAction = async (promptText: string) => {
    setInput('');
    await sendMessage(promptText);
  };

  const handleAddProduct = (product: Product) => {
    if (!isAuthenticated) {
      setOpen(false);
      navigate('/login');
      return;
    }
    addToCart(product, 1);
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice trigger response
      setTimeout(() => {
        setInput('Show me a gaming laptop under $1000');
        setIsListening(false);
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setOpen(false)}
      />

      {/* Main Drawer Container */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-brand-border dark:border-slate-800 flex overflow-hidden animate-slide-in-right">

        {/* Conversations Sidebar (Collapsible) */}
        {showSidebar && (
          <div className="w-64 border-r border-brand-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col shrink-0">
            <div className="p-4 border-b border-brand-border dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">History</span>
              <button
                onClick={startNewChat}
                className="p-1 rounded bg-white dark:bg-slate-800 border hover:text-indigo-600 text-xs flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectConversation(chat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs transition-colors ${activeConversationId === chat.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-muted hover:text-brand-text dark:hover:text-slate-100'
                    }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <div className="truncate">
                    <p className="truncate">{chat.title}</p>
                    <span className={`text-[9px] block ${activeConversationId === chat.id ? 'text-slate-200' : 'text-slate-400'
                      }`}>
                      {chat.date}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-brand-border dark:border-slate-800">
              <button
                onClick={clearHistory}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-brand-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg border border-transparent hover:border-red-100 dark:hover:border-red-900"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            </div>
          </div>
        )}

        {/* Chat Window Panel */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 relative">

          {/* Header */}
          <div className="p-4 border-b border-brand-border dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${showSidebar ? 'bg-slate-100 text-indigo-600 border-indigo-200' : 'text-brand-muted bg-white dark:bg-slate-900'
                  }`}
                title="Toggle conversation list"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                </div>
                <span className="font-extrabold text-sm text-brand-text dark:text-slate-100 tracking-tight">AI Buddy</span>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${msg.sender === 'user'
                    ? 'bg-slate-100 dark:bg-slate-800 text-brand-text dark:text-slate-200'
                    : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white'
                  }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div className={`p-3.5 rounded-2xl text-xs leading-normal shadow-sm ${msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-brand-text dark:text-slate-100 rounded-tl-none border dark:border-slate-800'
                    }`}>
                    {/* Render simple markdown bold / list markers */}
                    <div className="whitespace-pre-line space-y-1">
                      {msg.content.split('\n').map((line, idx) => {
                        let content: React.ReactNode = line;

                        // Simple parser for bold **
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          content = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part);
                        }

                        // Simple parser for lists *
                        if (line.startsWith('* ')) {
                          return (
                            <li key={idx} className="list-disc ml-4 pl-1">
                              {line.substring(2).split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)}
                            </li>
                          );
                        }
                        return <p key={idx}>{content}</p>;
                      })}
                    </div>
                  </div>

                  {/* Recommendation Cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="grid grid-cols-1 gap-2.5 mt-2 max-w-sm">
                      {msg.recommendations.map(({ product, matchPercent, reason }) => (
                        <div
                          key={product.id}
                          className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col gradient-border-glow"
                        >
                          <div className="flex p-3 gap-3 items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 rounded-lg object-cover bg-slate-50 border shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-1">
                                <h5 className="font-semibold text-xs text-brand-text dark:text-slate-100 truncate">{product.name}</h5>
                                <span className="shrink-0 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <TrendingUp className="w-3 h-3" /> {matchPercent}% Match
                                </span>
                              </div>
                              <p className="text-[10px] text-brand-muted mt-0.5 truncate">{reason}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">${product.price}</span>
                                {product.discount > 0 && (
                                  <span className="text-[9px] text-brand-danger line-through">${product.originalPrice}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/40 px-3 py-2 flex items-center justify-between border-t border-brand-border/60 dark:border-slate-800/60">
                            <span className="text-[9px] text-brand-muted">Stock: {product.stock} items left</span>
                            <button
                              onClick={() => handleAddProduct(product)}
                              className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all ${addedItemMap[product.id]
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                            >
                              {addedItemMap[product.id] ? (
                                <><Check className="w-3 h-3" /> Added</>
                              ) : (
                                <><ShoppingBag className="w-3 h-3" /> Add to Cart</>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`text-[9px] text-brand-muted block ${msg.sender === 'user' ? 'text-right' : ''
                    }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* AI thinking state loader */}
            {isAiTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 border shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none flex items-center justify-center min-w-[70px]">
                  <div className="dot-flashing" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations block (when history is empty/short) */}
          {messages.length <= 1 && !isAiTyping && (
            <div className="px-4 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block mb-2">Suggested Actions</span>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(item.prompt)}
                    className="p-2.5 rounded-xl border text-left hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-all flex flex-col justify-between"
                  >
                    <span className="font-semibold text-brand-text dark:text-slate-100 block">{item.label}</span>
                    <span className="text-[10px] text-brand-muted line-clamp-1 mt-1 font-medium">{item.prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Voice active overlay visual */}
          {isListening && (
            <div className="absolute inset-x-0 bottom-16 bg-slate-900/90 text-white py-4 px-6 flex flex-col items-center gap-2 animate-slide-up z-20">
              <span className="text-xs font-semibold tracking-wider text-indigo-400">Listening to your request...</span>
              <div className="flex gap-1 items-center h-8">
                <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 h-6 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                <span className="w-1 h-8 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                <span className="w-1 h-4 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <button
                onClick={() => setIsListening(false)}
                className="text-xs text-brand-danger font-semibold mt-1"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Form Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-brand-border dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-2 items-center"
          >
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all ${isListening
                  ? 'bg-rose-500 text-white border-transparent'
                  : 'bg-white dark:bg-slate-800 text-brand-muted hover:text-indigo-600 hover:border-indigo-100'
                }`}
              title="Voice search input simulation"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder="Ask AI: e.g. Add keycaps and mouse to cart..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none border dark:border-slate-800 focus:border-brand-primary"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-semibold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </>
  );
};
