import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendTeacherAICopilot } from '../services/api';
import { Bot, Send, Sparkles, User, Brain, AlertCircle, CheckCircle, ShieldCheck, BookOpen, Lightbulb } from 'lucide-react';

export const TeacherAICopilotPage: React.FC = () => {
  const { user } = useAuth();

  const suggestedPrompts = [
    "Summarize class performance across my authorized courses",
    "Identify students who may benefit from academic support",
    "Summarize anonymous student feedback patterns",
    "Suggest teaching improvement strategies for difficult modules",
    "Generate practical assignment ideas for upcoming syllabus",
    "Recommend review session topics before midterm exams"
  ];

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string; verifiedCount?: number }>>([
    {
      sender: 'ai',
      text: `Good day, ${user?.name || 'Faculty Member'}! I am your Teacher AI Copilot, grounded in your authorized coursework, evaluation records, and student feedback data. How may I assist your teaching and curriculum management today?`,
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
      const res = await sendTeacherAICopilot(textToSend);
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
        text: err.message || "Failed to reach Faculty AI Copilot. Please check your backend connection.",
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
            <span>Faculty Academic Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Teacher AI Copilot
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            AI-assisted insights grounded strictly in {user?.name}'s authorized classes, submissions, and feedback data.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#173F3A] bg-white px-3.5 py-2 rounded-xl border border-[#DCE9E1] font-medium shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#79A995]" />
          <span>Privacy-Preserving & RBAC Enforced</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#173F3A] uppercase tracking-wider px-1">Suggested Faculty Inquiries:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#DCE9E1] text-[#173F3A] hover:bg-[#DCE9E1] hover:border-[#79A995] transition text-left cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4 min-h-[380px] max-h-[520px] overflow-y-auto">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-[#173F3A] text-white flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-[#E7B978]" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              m.sender === 'user'
                ? 'bg-[#173F3A] text-white rounded-tr-none'
                : 'bg-[#F5F3ED] text-[#344541] rounded-tl-none border border-[#DCE9E1]'
            }`}>
              <p className="whitespace-pre-line">{m.text}</p>
              <div className={`flex items-center justify-between text-[10px] mt-2 ${
                m.sender === 'user' ? 'text-[#DCE9E1]/80' : 'text-[#344541]/60'
              }`}>
                <span>{m.time}</span>
                {m.verifiedCount !== undefined && (
                  <span className="inline-flex items-center space-x-1 font-semibold text-[#173F3A] bg-white px-2 py-0.5 rounded-md border border-[#DCE9E1]">
                    <CheckCircle className="w-3 h-3 text-[#79A995]" />
                    <span>Authorized Records Validated</span>
                  </span>
                )}
              </div>
            </div>
            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[#79A995] text-[#173F3A] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">
                {user?.name.charAt(0) || 'U'}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex space-x-3 items-center text-xs text-[#344541]/70 italic py-2">
            <div className="w-8 h-8 rounded-full bg-[#173F3A] text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-[#E7B978] animate-spin" />
            </div>
            <div className="bg-[#F5F3ED] border border-[#DCE9E1] rounded-2xl px-4 py-2.5">
              Analyzing course records and synthesizing faculty insights...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-2xl p-2 border border-[#DCE9E1] shadow-xs flex items-center space-x-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Copilot about class performance, student support, or assignment ideas..."
          className="flex-1 px-4 py-2.5 text-sm bg-transparent border-none outline-none text-[#344541] placeholder-[#344541]/50"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || loading}
          className="px-4 py-2.5 bg-[#173F3A] hover:bg-[#102d29] disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center space-x-1.5 transition cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grounding note */}
      <div className="flex items-center space-x-2 text-xs text-[#344541]/70 px-2">
        <AlertCircle className="w-4 h-4 text-[#79A995] flex-shrink-0" />
        <span>Grounded strictly in verified course assignments, grade books, and anonymous feedback. No hypothetical student statistics are fabricated.</span>
      </div>
    </div>
  );
};
