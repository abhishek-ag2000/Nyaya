"use client";
import { Bot, ChevronRight, MessageCircle, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Reply = { text: string; action?: { label: string; href: string } };
const suggestions = ["Track a case", "What happens at a hearing?", "Show today’s matters", "How do I use Nyaya Guide?"];
function answer(question: string): Reply {
  const query = question.toLowerCase();
  if (query.includes("track") || query.includes("case") || query.includes("cnr")) return { text: "You can search the bundled unified case from the Find a Case page. Try NYA-WB-DEMO-04821.", action: { label: "Search a demo case", href: "/find-case" } };
  if (query.includes("cause list") || query.includes("cause-list")) return { text: "Daily Cause List is a public court listing demo. Select a state, district and court to view an illustrative listing. It is not a live court record.", action: { label: "Open Daily Cause List", href: "/cause-list" } };
  if (query.includes("hearing") || query.includes("today") || query.includes("docket")) return { text: "Today’s Matters shows the signed-in workspace’s own listed cases, with court, courtroom and time from those records. It is not the public cause list.", action: { label: "Open today’s matters", href: "/today" } };
  if (query.includes("guide") || query.includes("understand") || query.includes("happen")) return { text: "Nyaya Guide explains common court concepts in plain language. It is educational content, not legal advice.", action: { label: "Open Nyaya Guide", href: "/nyaya-guide" } };
  if (query.includes("document") || query.includes("order") || query.includes("copy")) return { text: "The unified demo case includes document labels and contextual actions such as certified-copy requests. No real documents are stored or opened.", action: { label: "Open demo case", href: "/cases/NYA-WB-DEMO-04821" } };
  if (query.includes("sign") || query.includes("login") || query.includes("workspace")) return { text: "You can open a no-data mock session to preview My Nyaya. Institutional roles are simulation-only and do not collect credentials.", action: { label: "Open mock login", href: "/login" } };
  return { text: "I can help you navigate this demo: search a case, view the daily cause list, open Nyaya Guide, or enter a mock workspace. I don’t provide legal advice or use live court data." };
}

export default function NyayaAI() {
  const [open, setOpen] = useState(false); const [question, setQuestion] = useState(""); const [messages, setMessages] = useState<Array<{ from: "user" | "ai"; text: string; action?: Reply["action"] }>>([{ from: "ai", text: "Hello, I’m NyayaAI. I can help you find your way around this site." }]); const router = useRouter();
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 760px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function ask(value: string) { const prompt = value.trim(); if (!prompt) return; const reply = answer(prompt); setMessages((current) => [...current, { from: "user", text: prompt }, { from: "ai", ...reply }]); setQuestion(""); }
  function submit(event: FormEvent) { event.preventDefault(); ask(question); }
  return <div className={open ? "nyaya-ai open" : "nyaya-ai"} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><button className="ai-launcher" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="nyaya-ai-panel" aria-label={open ? "Close NyayaAI" : "Open NyayaAI"}>{open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />} <span>NyayaAI</span></button>{open && <section id="nyaya-ai-panel" className="ai-panel" aria-label="NyayaAI assistant"><header><div><Bot aria-hidden="true" /><span><b>NyayaAI</b><small> navigation assistant</small></span></div><button onClick={() => setOpen(false)} aria-label="Close NyayaAI"><X aria-hidden="true" /></button></header><div className="ai-disclosure">Mock answers only. No live systems, personal data, or legal advice.</div><div className="ai-messages" aria-live="polite">{messages.map((message, index) => <div className={`ai-message ${message.from}`} key={`${message.text}-${index}`}><p>{message.text}</p>{message.action && <button onClick={() => { router.push(message.action!.href); setOpen(false); }}>{message.action.label} <ChevronRight aria-hidden="true" /></button>}</div>)}</div><div className="ai-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div><form onSubmit={submit}><label className="sr-only" htmlFor="nyaya-ai-question">Ask NyayaAI</label><input id="nyaya-ai-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask how to navigate…" /><button type="submit" aria-label="Send question"><Send aria-hidden="true" /></button></form></section>}</div>;
}
