import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendAIChat } from '../services/api';
import { Bot, Send, Sparkles, User, Brain, RefreshCw } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();

  const suggestedPrompts = [
    "Why am I struggling in Data Structures?",
    "Create a 7-day DSA study plan.",
    "What assignments are due this week?",
    "Which opportunities match my skills?",
    "What topics should I revise before my next test?"
  ];

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${user?.name.split(' ')[0] || 'Atharva'}! I'm your EduPulse AI Copilot. I have indexed your academic record (CGPA 8.2, 87% attendance, weak topics identified in Computer Networks TCP/IP & Trees). How can I assist your studies today?`,
      time: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user' as const, text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await sendAIChat(textToSend, user?.id || 'std-001');
      const aiMsg = { sender: 'ai' as const, text: res.response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const fallbackAiMsg = {
        sender: 'ai' as const,
        text: `Based on your recent marks, your performance in Python is 86%, while Trees (61%) and TCP/IP (62%) require revision. I recommend scheduling 45 minutes of tree traversal practice today.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackAiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-cyan-300">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">EduPulse AI</h2>
            <p className="text-xs text-indigo-300 font-medium">Your Academic Copilot & Personal Study Guide</p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 text-xs font-medium transition shadow-xs flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3 text-cyan-500" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* CHAT MESSAGES WINDOW */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs min-h-[420px] flex flex-col justify-between space-y-6">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${
                m.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-900 text-cyan-400'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none font-medium'
              }`}>
                <p>{m.text}</p>
                <span className={`block text-[10px] mt-1.5 font-mono ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-indigo-600 font-semibold p-3 bg-indigo-50 rounded-xl w-48">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Analyzing academic context...</span>
            </div>
          )}
        </div>

        {/* INPUT BOX */}
        <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
          <input
            type="text"
            placeholder="Ask anything about your courses, weak topics, or study plans..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-3.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
