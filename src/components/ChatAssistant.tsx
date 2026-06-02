import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { talentChat } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Suggest a 4-week CSE learning plan",
  "What skills do EEE jobs in Dhaka need?",
  "Improve my CV summary for fresher",
  "Best remote jobs for civil engineers",
];

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your TalentBD career coach. Ask me about learning tracks, jobs, or your CV." },
  ]);
  const [input, setInput] = useState("");
  const chatFn = useServerFn(talentChat);
  const endRef = useRef<HTMLDivElement>(null);

  const send = useMutation({
    mutationFn: (next: Msg[]) => chatFn({ data: { messages: next } }),
    onSuccess: (res) => {
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    },
    onError: (e: any) => {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
    },
  });

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function submit(text?: string) {
    const content = (text ?? input).trim();
    if (!content || send.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    send.mutate(next.filter((m) => m.role !== "assistant" || messages.indexOf(m) !== 0).slice(-20));
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          boxShadow: "0 12px 32px -8px color-mix(in oklab, var(--color-primary) 60%, transparent)",
        }}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-white" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border shadow-2xl"
          style={{ height: "min(560px, 75vh)", background: "white" }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3 text-white"
            style={{ background: "linear-gradient(135deg, var(--color-primary), oklch(0.45 0.18 250))" }}
          >
            <Sparkles className="size-5" />
            <div className="flex-1">
              <div className="text-sm font-bold">TalentBD AI Coach</div>
              <div className="text-[11px] opacity-80">Powered by Lovable AI · Always-on</div>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3" style={{ background: "color-mix(in oklab, var(--color-primary) 4%, white)" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user" ? "rounded-br-sm text-white" : "rounded-bl-sm border bg-white"
                  }`}
                  style={m.role === "user" ? { background: "var(--color-primary)" } : {}}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {send.isPending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border bg-white px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> thinking…
                </div>
              </div>
            )}
            {messages.length <= 1 && (
              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">Try asking</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="block w-full rounded-md border bg-white px-3 py-1.5 text-left text-xs hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-center gap-2 border-t bg-white p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about careers…"
              className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ "--tw-ring-color": "var(--color-accent)" } as any}
            />
            <button
              type="submit"
              disabled={send.isPending || !input.trim()}
              className="rounded-md p-2 text-white disabled:opacity-50"
              style={{ background: "var(--color-primary)" }}
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
