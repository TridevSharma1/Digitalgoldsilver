import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { AdminShell } from "@/components/site/AdminShell";
import { Badge } from "@/components/site/ui";
import type { Message } from "@/mock";

export const Route = createFileRoute("/admin/messages")({
  head: () => seo("Messages | Admin", "Reply to customer contact messages."),
  component: Page,
});

function Msg({ m, setMsgs }: { m: Message; setMsgs: (fn: (ms: Message[]) => Message[]) => void }) {
  const [reply, setReply] = useState(m.reply ?? "");
  return (
    <div className="card-lux p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{m.subject}</p>
          <p className="text-xs text-muted-foreground">{m.name} • {m.email} • {m.date}</p>
        </div>
        <Badge tone={m.reply ? "success" : "gold"}>{m.reply ? "Replied" : "Unread"}</Badge>
      </div>
      <p className="mt-3 text-sm">{m.message}</p>
      <div className="mt-3 space-y-2">
        <textarea aria-label={`Reply to ${m.subject}`} className="input-lux min-h-20" placeholder="Write a reply…" value={reply} onChange={(e) => setReply(e.target.value)} />
        <button className="btn-gold" onClick={() => { setMsgs((ms) => ms.map((x) => (x.id === m.id ? { ...x, reply } : x))); toast.success("Reply saved"); }}>Save Reply</button>
      </div>
    </div>
  );
}

function Page() {
  const [msgs, setMsgs] = useStore("messages");
  return (
    <div className="space-y-4">
      <h1 className="font-semibold">Contact Messages</h1>
      {msgs.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
      {msgs.map((m) => <Msg key={m.id} m={m} setMsgs={setMsgs} />)}
    </div>
  );
}
