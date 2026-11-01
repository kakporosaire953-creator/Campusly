"use client";

import { useEffect, useRef, useState } from "react";
import type { AiChatMessage } from "@/types";
import { aiService } from "@/services/aiService";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

const SUGGESTIONS = [
  "Explique-moi la complexité asymptotique",
  "Comment retenir les rotations AVL ?",
  "Comment fonctionnent les crédits ?",
  "Comment se déroule une composition surveillée ?",
];

/**
 * Assistant IA conversationnel.
 * Aucune IA n'est interrogée : les réponses proviennent de `aiService` qui
 * retourne des contenus de démonstration, chaque réponse portant une mention.
 */
export function AssistantChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bonjour ! Je suis l'assistant Campusly. Posez-moi une question sur vos cours, vos révisions ou le fonctionnement de la plateforme.",
      createdAt: new Date().toISOString(),
      footnotes: ["Réponse de démonstration — aucune IA n'est interrogée."],
    },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || sending) return;
    const userMessage: AiChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setSending(true);
    try {
      const reply = await aiService.chat({ message: content });
      setMessages((current) => [...current, reply.message]);
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : "Réponse impossible.", "danger");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <PageHeader
        title="Assistant Campusly AI"
        subtitle="Aide à la révision et à la compréhension des cours — réponses de démonstration."
        demo
        actions={<Badge tone="accent" icon="fa-solid fa-flask">Aucune IA réelle</Badge>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 16 }}>
        <section
          aria-label="Conversation"
          className="card"
          style={{ padding: 0, display: "flex", flexDirection: "column", minHeight: 460 }}
        >
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }} className="row-between">
            <strong style={{ fontSize: "0.9rem", color: "var(--text-1)" }}>
              <i className="fa-solid fa-robot" aria-hidden="true" /> Conversation
            </strong>
            <span style={{ fontSize: "0.74rem", color: "var(--text-2)" }}>{messages.length} messages</span>
          </div>

          <div
            style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                }}
              >
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--r-lg)",
                    background: message.role === "user" ? "rgba(21,101,192,0.08)" : "var(--surface)",
                    border: "1px solid var(--border)",
                    fontSize: "0.87rem",
                    color: "var(--text-1)",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {message.content}
                </div>
                {message.footnotes?.length ? (
                  <ul style={{ listStyle: "none", marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                    {message.footnotes.map((note) => (
                      <li key={note} style={{ fontSize: "0.7rem", color: "var(--text-2)" }}>
                        <i className="fa-solid fa-circle-info" aria-hidden="true" /> {note}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            {sending ? (
              <div style={{ alignSelf: "flex-start", fontSize: "0.82rem", color: "var(--text-2)" }}>
                <span className="loader-spinner" style={{ width: 16, height: 16, display: "inline-block", verticalAlign: "middle", marginRight: 8 }} aria-hidden="true" />
                L&apos;assistant prépare une réponse de démonstration…
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
            style={{ borderTop: "1px solid var(--border)", padding: 14, display: "flex", gap: 10, alignItems: "flex-end" }}
          >
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="chat-input" style={{ position: "absolute", left: -9999 }}>
                Votre question
              </label>
              <textarea
                id="chat-input"
                className="form-textarea"
                style={{ minHeight: 48, height: 48 }}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(draft);
                  }
                }}
                placeholder="Écrivez votre question (Entrée pour envoyer)"
                rows={1}
              />
            </div>
            <Button type="submit" variant="primary" disabled={sending || !draft.trim()} icon="fa-solid fa-paper-plane" aria-label="Envoyer" />
          </form>
        </section>

        <section aria-label="Suggestions de questions" className="card">
          <strong style={{ fontSize: "0.85rem", color: "var(--text-1)", display: "block", marginBottom: 12 }}>
            Questions fréquentes
          </strong>
          <div className="row" style={{ gap: 8 }}>
            {SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} type="button" className="chip" onClick={() => send(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
          <p style={{ fontSize: "0.74rem", color: "var(--text-2)", marginTop: 14 }}>
            En production, le Worker routera la question vers un fournisseur IA autorisé, avec le contexte de
            votre faculté et l&apos;historique de vos révisions. Aucun document n&apos;est conservé sans votre accord.
          </p>
        </section>
      </div>
    </div>
  );
}
