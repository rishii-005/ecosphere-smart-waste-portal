import { FormEvent, useState } from "react";
import { Bot, Send, UploadCloud, User } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../components/Button";
import { api } from "../lib/api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function imageToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return { base64: dataUrl.split(",")[1], mimeType: file.type };
}

export function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi, I am EcoGuide. Describe an item like 'greasy pizza box' or upload a photo, and I will suggest safe recycling steps." }
  ]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<{ base64: string; mimeType: string } | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = String(form.get("message") || "").trim();
    if (!text) return;

    setMessages((items) => [...items, { role: "user", content: text }]);
    setLoading(true);
    event.currentTarget.reset();

    try {
      const result = await api.askAi(text, image?.base64, image?.mimeType);
      setMessages((items) => [...items, { role: "assistant", content: result.answer }]);
      setImage(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="font-display text-4xl font-bold">AI recycling assistant</h1>
        <p className="mt-2 text-black/65 dark:text-white/65">Context-aware recycling suggestions powered by your backend OpenAI route.</p>
        <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-[#151c1a]">
          <div className="h-[58vh] space-y-4 overflow-y-auto p-5">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mint text-ink"><Bot size={18} /></span>}
                <div className={`max-w-[82%] whitespace-pre-wrap rounded-lg p-4 text-sm leading-6 ${message.role === "user" ? "bg-ink text-white dark:bg-mint dark:text-ink" : "bg-black/5 dark:bg-white/8"}`}>
                  {message.content}
                </div>
                {message.role === "user" && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-aqua text-ink"><User size={18} /></span>}
              </div>
            ))}
            {loading && <div className="rounded-lg bg-black/5 p-4 text-sm dark:bg-white/10">EcoGuide is thinking...</div>}
          </div>
          <form onSubmit={submit} className="flex flex-col gap-3 border-t border-black/10 p-4 dark:border-white/10 md:flex-row">
            <label className="grid cursor-pointer place-items-center rounded-lg border border-black/10 px-3 dark:border-white/10">
              <UploadCloud size={19} />
              <input className="hidden" type="file" accept="image/*" onChange={async (event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setImage(await imageToBase64(file));
                  toast.success("Image attached.");
                }
              }} />
            </label>
            <input className="field flex-1" name="message" placeholder="Ask how to recycle batteries, cartons, fabric, food waste..." />
            <Button disabled={loading} className="flex items-center justify-center gap-2"><Send size={18} /> Send</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
