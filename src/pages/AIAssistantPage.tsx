import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendAIChat } from '../services/api';
import { Bot, Send, Sparkles, User, Brain, AlertCircle, CheckCircle } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();

  const suggestedPrompts = [
    "What are my weakest topics based on my database records?",
    "Summarize my academic standing and CGPA",
    "Explain Polymorphism and Abstract Classes in C++",
    "Recommend priority practice exercises for my courses"
  ];

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string; verifiedCount?: number }>>([
    {
      sender: 'ai',
      text: `Hello ${user?.name.split(' ')[0] || 'Student'}! I'm your StudentConnector AI Copilot. I have indexed your verified academic database records. How can I assist your study session today?`,
      time: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await sendAIChat(textToSend);
      const aiMsg = {
        sender: 'ai' as const,
        text: res.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verifiedCount: res.verified_records_used
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg = {
        sender: 'ai' as const,
        text: err.message || "Failed to reach AI Copilot server. Please check your backend connection.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E7B978]" />
            <span>Record-Backed Academic Assistant</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            StudentConnector AI Copilot
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            AI recommendations grounded strictly in {user?.name}'s actual coursework and assessment marks.
          </p>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#DCE9E1] text-[#173F3A] hover:bg-[#DCE9E1] hover:border-[#79A995] transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4 min-h-[350px] max-h-[500px] overflow-y-auto">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-[#173F3A] text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-[#E7B978]" />
              </div>
            )}
            <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-[#173F3A] text-white'
                : 'bg-[#FAF9F5] border border-[#E5E2D9] text-[#344541]'
            }`}>
              <p>{m.text}</p>
              <div className="flex items-center justify-between text-[10px] mt-2 opacity-70">
                <span>{m.time}</span>
                {m.verifiedCount !== undefined && m.verifiedCount > 0 && (
                  <span className="font-semibold text-[#79A995]">
                    ✓ Verified via {m.verifiedCount} DB records
                  </span>
                )}
              </div>
            </div>
            {m.sender === 'user' && (
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
                alt="Student"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#79A995] flex-shrink-0"
              />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex space-x-3 items-center text-xs text-[#344541]/60 p-2">
            <Bot className="w-4 h-4 text-[#79A995] animate-spin" />
            <span>Analyzing student database records...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center space-x-2 bg-white rounded-2xl p-2 border border-[#DCE9E1] shadow-xs">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about your ${user?.name?.split(' ')[0]}'s performance, weak topics, or C++ concepts...`}
          className="flex-1 px-4 py-2 text-xs text-[#344541] bg-transparent outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputQuery.trim()}
          className="px-5 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] disabled:opacity-40 text-white text-xs font-bold transition flex items-center space-x-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5 text-[#E7B978]" />
        </button>
      </div>
    </div>
  );
};
