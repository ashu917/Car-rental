import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAskGemini } from '../../hooks/useGemini';

const Message = ({ role, text }) => (
  <div className={`w-full flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm whitespace-pre-wrap ${role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
      {text}
    </div>
  </div>
);

const suggestions = [
  'Recommend a family car for 4 under $100/day in LA',
  'What documents do I need to rent a car?',
  'Best car type for a road trip with 6 people',
  'Is automatic or manual better for city driving?'
];

export default function Assistant() {
  const { loading, ask } = useAskGemini();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;
    setMessages((m) => [...m, { role: 'user', text: prompt }]);
    setInput('');
    const reply = await ask(prompt);
    setMessages((m) => [...m, { role: 'assistant', text: reply || 'No response.' }]);
  };

  const pick = async (p) => {
    setInput(p);
    setTimeout(send, 0);
  };

  return (
    <div className="min-h-[70vh] bg-slate-50 rounded-2xl shadow border border-slate-200 p-4 md:p-6 flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">AI Assistant</h2>
        <p className="text-slate-500">Ask anything about cars, rentals, and recommendations.</p>
      </div>

      {messages.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => pick(s)} className="text-left rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-sm shadow-sm">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence>
          {messages.map((m, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Message role={m.role} text={m.text} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white shadow hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
