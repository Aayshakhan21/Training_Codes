import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { aiAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { AppIcon, Badge, Button, Spinner } from "../shared/index";

function makeInitialMessage() {
  return {
    id: `msg-${Date.now()}-assistant`,
    role: "assistant",
    content:
      "Hi, I’m AppVerse AI. Ask me about apps, recommendations, categories, downloads, ratings, or review insights.",
    createdAt: new Date().toISOString(),
  };
}

function makeUserMessage(content) {
  return {
    id: `msg-${Date.now()}-user`,
    role: "user",
    content,
    createdAt: new Date().toISOString(),
  };
}

function makeTypingMessage() {
  return {
    id: "typing",
    role: "assistant",
    content: "",
    createdAt: new Date().toISOString(),
    typing: true,
  };
}

export default function AIChatbotWidget() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([makeInitialMessage()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const storageKey = `appverse-ai-chat-${user?.id || "guest"}`;

  useEffect(() => {
    if (!isAuthenticated) {
      setMessages([makeInitialMessage()]);
      setOpen(false);
      setMinimized(false);
      setInput("");
      setError("");
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      // ignore broken history and start fresh
    }

    setMessages([makeInitialMessage()]);
  }, [isAuthenticated, storageKey, user?.id]);

  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-50)));
    } catch {
      // ignore storage failures
    }
  }, [messages, storageKey, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, minimized]);

  const quickPrompts = [
    "Recommend apps for me",
    "Show trending apps",
    "Explain this app",
  ];

  const sendMessage = async (messageText) => {
    const trimmed = messageText.trim();
    if (!trimmed || loading) return;

    const userMessage = makeUserMessage(trimmed);
    const nextMessages = [...messages, userMessage, makeTypingMessage()];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const context = {
        path: location.pathname,
        userId: user?.id,
        role: user?.role,
      };

      const { data } = await aiAPI.chat({
        message: trimmed,
        context,
      });

      const answer = data?.data?.answer || "I’m sorry, I couldn’t generate a response.";
      const suggestedAppIds = data?.data?.suggestedAppIds || [];
      const assistantMessage = {
        id: `msg-${Date.now()}-assistant-response`,
        role: "assistant",
        content: answer,
        suggestedAppIds,
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current.filter((item) => item.id !== "typing"), assistantMessage]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "AI service unavailable. Please try again.";
      setMessages((current) => [
        ...current.filter((item) => item.id !== "typing"),
        {
          id: `msg-${Date.now()}-assistant-error`,
          role: "assistant",
          content: msg,
          createdAt: new Date().toISOString(),
          error: true,
        },
      ]);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(input);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] pointer-events-none">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto group relative flex items-center gap-3 rounded-full border border-white/10 bg-dark-800/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl hover:border-primary-400/40 hover:bg-dark-700 transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-pink-500 text-white shadow-lg shadow-primary-500/30">
            <AppIcon name="chat" className="h-5 w-5" />
          </div>
          <div className="text-left pr-1">
            <p className="text-sm font-semibold text-white">AppVerse AI</p>
            <p className="text-xs text-gray-400">Ask for recommendations</p>
          </div>
        </button>
      ) : (
        <div className="pointer-events-auto w-[92vw] max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-dark-800/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-pink-500 text-white shadow-lg shadow-primary-500/30">
                <AppIcon name="chat" className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">AppVerse AI</p>
                  <Badge variant="success">Gemini</Badge>
                </div>
                <p className="text-xs text-gray-400">Online assistant for marketplace help</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMinimized((current) => !current)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                aria-label={minimized ? "Expand chat" : "Minimize chat"}
                title={minimized ? "Expand" : "Minimize"}
              >
                <AppIcon name={minimized ? "app" : "chat"} className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Close chat"
                title="Close"
              >
                <AppIcon name="delete" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="max-h-[420px] space-y-4 overflow-y-auto px-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-primary-600 text-white"
                          : message.error
                            ? "bg-red-500/10 text-red-100 border border-red-500/20"
                            : "bg-white/5 text-gray-100 border border-white/5"
                      }`}
                    >
                      {message.typing ? (
                        <div className="flex items-center gap-2">
                          <Spinner size="sm" />
                          <span className="text-xs text-gray-400">Typing...</span>
                        </div>
                      ) : (
                        <>
                          <p>{message.content}</p>
                          {Array.isArray(message.suggestedAppIds) && message.suggestedAppIds.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestedAppIds.slice(0, 4).map((appId) => (
                                <Link
                                  key={appId}
                                  to={`/apps/${appId}`}
                                  className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-white/90 hover:bg-white/10 transition-colors"
                                >
                                  App #{appId}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-white/5 px-4 py-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      disabled={loading}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {error && (
                  <p className="mb-3 text-xs text-red-300">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask me anything about apps, ratings, reviews, or trends..."
                    rows={2}
                    className="min-h-[48px] max-h-28 flex-1 resize-none rounded-2xl border border-white/10 bg-dark-700 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
                  />
                  <Button type="submit" loading={loading} className="rounded-2xl px-4 py-3">
                    Send
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
