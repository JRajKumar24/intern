'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: string, content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Constants for retry logic
  const MAX_RETRIES = 3;
  const INITIAL_RETRY_DELAY = 1000; // 1 second

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]); // Immediately add user message
    setInput(''); // Clear input field

    let retries = 0;
    let delay = INITIAL_RETRY_DELAY;

    // Start retry loop
    while (retries < MAX_RETRIES) {
      try {
        // OPTIMIZATION: Only send the last N messages to the API
        // This '10' should match or be less than the number in route.ts
        const historyToSend = messages.slice(Math.max(0, messages.length - 10)); 
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...historyToSend, userMessage] // Send limited history + current user message
          })
        });

        // Check for 429 Too Many Requests specifically
        if (response.status === 429) {
          console.warn(`Rate limit hit (attempt ${retries + 1}/${MAX_RETRIES}). Retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          retries++;
          continue; // Skip the rest of this iteration and try again
        }

        if (!response.ok) {
            // Attempt to parse error message from server if not 429
            const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred.' }));
            throw new Error(errorData.error || `Network response was not ok: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
         const aiMessage = { role: 'assistant', content: '' };
        // Add a temporary AI message placeholder to the UI
        // We ensure userMessage is there before aiMessage for correct order
        setMessages(prev => {
            const newMessages = [...prev.slice(0, -1), userMessage]; // Ensure user message is the second to last
            return [...newMessages, aiMessage]; // Add new AI message as last
        });

        if (reader) {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            aiMessage.content += text;
            // Update the last message (AI's message) in the state
            setMessages(prev => [...prev.slice(0, -1), { ...aiMessage }]);
          }
        }
        break; // Successfully got a response, exit the retry loop

      } catch (error) {
        console.error('Error during API call:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Sorry, an error occurred: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.` 
        }]);
        break; // Exit retry loop on other errors
      } finally {
        // setIsLoading(false); // Do not set to false inside finally block if retrying
      }
    }

    // Only set isLoading to false after all retries are exhausted or a successful response is received
    setIsLoading(false); 

    // If all retries failed
    if (retries === MAX_RETRIES) {
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Failed to get a response after multiple attempts due to API limits. Please wait a moment and try again.'
        }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          
          {/* AI Chatbox Heading */}
          <div className="p-4 bg-white/10 text-center text-xl font-semibold border-b border-white/15 text-white/90">
            AI Chatbox
          </div>

          {/* Chat Display Area (Output Box) */}
          <div className="h-[400px] overflow-y-auto p-5 space-y-4 custom-scrollbar"> 
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-14 h-14 mb-4 rounded-full bg-teal-500/20 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-lg text-center">Hello! How can I help you today?</p>
                <p className="text-sm text-gray-500 mt-1">Try asking me anything!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] rounded-lg p-3 relative ${ 
                    message.role === 'user'  
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg' 
                      : 'bg-white/15 text-gray-100 shadow-md' 
                  } transform transition-transform duration-200 hover:scale-[1.01]`}>
                    <div className="flex items-center mb-1">
                      {message.role === 'user' ? (
                        <svg className="w-4 h-4 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-2 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      <span className="text-xs font-medium opacity-80">
                        {message.role === 'user' ? 'You' : 'Gemini AI'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-white/15 shadow-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-teal-400 animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-300">Gemini is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4 bg-white/5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 border border-white/15 rounded-full px-5 py-2.5 
                           text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                           transition-all duration-200"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-full flex items-center justify-center
                            transition-all duration-200 ease-in-out ${
                  input.trim() && !isLoading 
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:scale-105 hover:shadow-lg'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-70'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}