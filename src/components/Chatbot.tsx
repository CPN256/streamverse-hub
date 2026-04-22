import { useState } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg { from: "bot" | "user"; text: string }

const replies = (q: string): string => {
  const t = q.toLowerCase();
  if (t.includes("hello") || t.includes("hi")) return "Greetings, traveler. Ask me to recommend something — try 'sci-fi' or 'crime'.";
  if (t.includes("sci-fi") || t.includes("scifi")) return "Try Westworld, Black Mirror, or Stranger Things — all loaded in the grid.";
  if (t.includes("crime") || t.includes("thriller")) return "Search 'Breaking Bad', 'Mindhunter', or 'True Detective'.";
  if (t.includes("comedy")) return "Search 'Brooklyn Nine-Nine', 'The Office', or 'Ted Lasso'.";
  if (t.includes("favorite") || t.includes("fav")) return "Tap any heart icon to add a title to your favorites — they live in the Favorites tab.";
  if (t.includes("how") || t.includes("stream")) return "Hit Stream Now in any title to open the official source. Real movie hosting requires a paid backend.";
  return `Hmm, I'd suggest searching "${q}" in the search bar above — I'll pull live results from the API.`;
};

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "🤖 Connected to the CPN grid. Ask for genre recs or how to use the app." },
  ]);

  const send = () => {
    const v = input.trim();
    if (!v) return;
    setMsgs((m) => [...m, { from: "user", text: v }, { from: "bot", text: replies(v) }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow animate-glow-pulse"
        aria-label="Open assistant"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-6 z-40 flex w-[min(92vw,360px)] flex-col rounded-3xl border border-primary bg-card/95 shadow-glow backdrop-blur-xl transition-all duration-300",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <div className="flex items-center gap-2 rounded-t-3xl bg-gradient-primary px-4 py-3 font-display font-bold text-primary-foreground">
          <Bot className="h-5 w-5" /> AI Assistant
        </div>
        <div className="h-72 space-y-2 overflow-y-auto p-4 scrollbar-cyber">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                m.from === "bot"
                  ? "bg-primary/10 text-foreground"
                  : "ml-auto bg-secondary/20 text-foreground"
              )}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2 border-t border-border p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything..."
            className="flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={send}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
};