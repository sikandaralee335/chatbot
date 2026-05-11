import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Layers, 
  Palette, 
  Wind, 
  Maximize2, 
  Cpu, 
  Terminal,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { generateSynthesis } from './services/gemini';
import { Message, SynthesisResponse } from './types';

function SynthesisCard({ synthesis, query }: { synthesis: SynthesisResponse, query?: string }) {
  return (
    <div className="w-full bg-base tech-border p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out mb-16 relative overflow-hidden">
      {/* Background large numbers for structural feel */}
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
        <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest text-right mb-1">Status</div>
        <div className="text-lg font-medium italic text-accent text-right">SYNT_COMPLETE_{Math.random().toString(36).substring(7).toUpperCase()}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Section 01: Visual Blueprint */}
        <section className="col-span-1 lg:col-span-4 lg:border-r tech-divider lg:pr-12 relative">
          <div className="mb-8">
            <span className="bg-number absolute -top-12 -left-4">01</span>
            <h2 className="section-label mb-8 relative z-10">Visual Blueprint</h2>
            
            <div className="space-y-8 relative z-10">
              <div>
                <label className="mono-label block mb-2">Subject</label>
                <p className="text-base leading-relaxed font-medium">{synthesis.blueprint.subject}</p>
              </div>
              <div>
                <label className="mono-label block mb-2">Composition</label>
                <p className="text-sm leading-relaxed text-white/70">{synthesis.blueprint.composition}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="mono-label block mb-1">Style</label>
                  <p className="text-xs font-bold text-accent italic">{synthesis.blueprint.style}</p>
                </div>
                <div>
                  <label className="mono-label block mb-1">Atmosphere</label>
                  <p className="text-xs text-white/50 italic">{synthesis.blueprint.atmosphere}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02 & 03 Container */}
        <section className="col-span-1 lg:col-span-8 flex flex-col space-y-12">
          
          {/* Section 02: The Prompt */}
          <div className="bg-white/5 border tech-divider p-8 rounded-sm group relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="section-label">02 / The Prompt</h2>
              <button 
                onClick={() => navigator.clipboard.writeText(synthesis.prompt)}
                className="text-[10px] font-mono bg-accent text-black px-3 py-1 uppercase font-black hover:bg-white transition-colors"
              >
                Copy optimized
              </button>
            </div>
            <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-white/90 relative z-10">
              "{synthesis.prompt}"
            </p>
          </div>

          {/* Section 03: Textual Synthesis */}
          <div className="flex-grow relative">
            <span className="bg-number absolute -top-8 -left-4">03</span>
            <h2 className="section-label mb-8 relative z-10">Textual Synthesis</h2>
            <div className="relative z-10">
              <p className="text-2xl md:text-3xl leading-snug font-light text-white/90 mb-8 max-w-2xl">
                {synthesis.synthesis.split('.')[0]}.
              </p>
              <p className="text-base text-white/50 leading-relaxed max-w-3xl font-normal">
                {synthesis.synthesis.split('.').slice(1).join('.')}
              </p>
            </div>
          </div>

          {/* Footer of Card */}
          <div className="pt-8 border-t tech-divider flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
            <span>Entropy Level: low</span>
            <span>Seed: #{query?.length}SYX</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSynthesizing]);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSynthesizing) return;

    const query = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSynthesizing(true);

    try {
      const synthesis = await generateSynthesis(query);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '', 
        synthesis,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col selection:bg-accent/30 lowercase-labels">
      
      {/* Navigation / Header */}
      <header className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start border-b tech-divider gap-8">
        <div>
          <h1 className="text-[48px] md:text-[64px] font-black leading-none tracking-tighter uppercase font-display italic">
            Visual Synthesis<span className="text-accent not-italic">.Engine</span>
          </h1>
          <p className="mono-label mt-3 block">System Status: Neural Synthesis Active // Buffer 98%</p>
        </div>
        <div className="md:text-right">
          <div className="mono-label mb-2">Workspace ID</div>
          <div className="text-xl font-bold tracking-tight text-white/80">AI-SYNTH-X001</div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-8 py-12 pb-48 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-16 py-20"
            >
              <div className="space-y-4">
                <span className="mono-label">Cognitive Interface Loaded</span>
                <h2 className="text-8xl md:text-[120px] font-black tracking-tighter leading-[0.9] uppercase italic text-white">
                  Visualize <br />
                  <span className="text-accent font-display not-italic">Everything.</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {[
                  { label: "Bio-engineered Forests", desc: "Photosynthetic architecture" },
                  { label: "Hadal zone outposts", desc: "Abyssal research stations" },
                  { label: "Post-tech rituals", desc: "Digital spirituality" }
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => setInput(item.label)}
                    className="p-8 border tech-divider text-left hover:bg-white/5 hover:border-accent group transition-all"
                  >
                    <div className="section-label mb-2 group-hover:text-white transition-colors">{item.label}</div>
                    <div className="mono-label opacity-40 capitalize">{item.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-24">
              {messages.map((message, idx) => (
                <div key={message.id} className="w-full">
                  {message.role === 'user' && (
                    <div className="flex justify-between items-center mb-8 border-b tech-divider pb-4">
                      <div className="flex items-center gap-4">
                        <span className="mono-label">Query Input #{idx + 1}</span>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">"{message.content}"</h3>
                      </div>
                      <span className="mono-label opacity-20">Received</span>
                    </div>
                  )}

                  {message.role === 'assistant' && message.synthesis && (
                    <SynthesisCard 
                      synthesis={message.synthesis} 
                      query={messages[idx-1]?.content} 
                    />
                  )}
                </div>
              ))}
              
              {isSynthesizing && (
                <div className="w-full py-12 flex flex-col items-center justify-center border tech-divider bg-white/2 animate-pulse">
                   <div className="section-label animate-cursor mb-4">Neural Synthesis in Progress</div>
                   <div className="mono-label">Compiling conceptual fragments...</div>
                </div>
              )}
              <div ref={scrollRef} className="h-20" />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Input Console */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 md:p-12 z-50 bg-gradient-to-t from-base via-base to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <form 
            onSubmit={handleSubmit}
            className="bg-white/5 border-2 tech-divider flex items-center gap-4 p-1 group focus-within:border-accent transition-colors"
          >
            <div className="pl-6 text-accent font-mono text-xl">$</div>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject new vision parameters..."
              className="flex-1 bg-transparent border-none outline-none text-white py-6 placeholder:text-white/20 font-bold text-xl uppercase tracking-tight"
              disabled={isSynthesizing}
            />
            <button 
              type="submit"
              disabled={isSynthesizing || !input.trim()}
              className={`h-full min-h-[72px] px-12 font-black uppercase text-sm tracking-tighter transition-all
                ${!input.trim() || isSynthesizing 
                  ? 'bg-white/5 text-white/20' 
                  : 'bg-white text-black hover:bg-accent cursor-pointer'
                }`}
            >
              Synthesize
            </button>
          </form>
          
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase text-white/20 tracking-[0.3em] gap-4">
            <span className="flex items-center gap-3">
              <span className="w-2 h-2 bg-accent animate-pulse" />
              Vision_Process_v4.0.2
            </span>
            <div className="flex gap-8">
              <span>Encryption: AES-256-GCM</span>
              <span>Layer: Cognitive-01</span>
              <span>Lat: 1.42ms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
