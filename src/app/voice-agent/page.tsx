"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ApiKeyModal from "@/components/ApiKeyModal";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Loader2,
  Clock,
  Send,
  Trash2,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  latency?: number;
}

export default function VoiceAgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasApiKey(!!localStorage.getItem("gemini_api_key"));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }

    if (!text.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10),
          apiKey,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const latency = Date.now() - startTime;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
        latency,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (voiceEnabled && "speechSynthesis" in window) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognition.start();
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <main className="page">
      <Navbar />

      <div className="container" style={{ maxWidth: 900, paddingTop: 48, paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="badge" style={{ marginBottom: 24 }}>
            Real-Time Voice AI
          </div>
          <h1 style={{ fontSize: 48, marginBottom: 16 }}>Voice Agent</h1>
          <p className="text-muted" style={{ fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
            Conversational AI that responds in real-time. Click the mic or type to start.
          </p>
        </div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chat-container"
          style={{ marginBottom: 16 }}
        >
          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <MessageSquare className="text-muted-foreground" style={{ margin: "0 auto 16px", opacity: 0.5 }} size={48} />
                  <p className="text-muted-foreground">
                    Start a conversation by speaking or typing
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", justifyContent: message.role === "user" ? "flex-end" : "flex-start" }}
                >
                  <div className={message.role === "user" ? "message message-user" : "message message-assistant"}>
                    <p style={{ margin: 0 }}>{message.content}</p>
                    {message.latency && (
                      <div className="message-latency">
                        <Clock size={12} />
                        <span>{message.latency}ms</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <div className="message message-assistant">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Loader2 className="animate-spin text-muted" size={16} />
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`icon-btn ${voiceEnabled ? "active" : ""}`}
              title={voiceEnabled ? "Voice output on" : "Voice output off"}
            >
              {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage(inputText)}
              placeholder="Type a message..."
              disabled={isProcessing}
              style={{ flex: 1 }}
            />

            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isProcessing}
              className="icon-btn"
            >
              <Send size={18} />
            </button>

            <button
              onClick={isListening ? undefined : startListening}
              disabled={isProcessing}
              className={`icon-btn icon-btn-lg ${isListening ? "recording" : ""}`}
            >
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
          </div>
        </motion.div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div className="text-muted-foreground" style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14 }}>
            {isListening && (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
                Listening...
              </span>
            )}
            {isSpeaking && (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Volume2 size={16} />
                Speaking...
                <button
                  onClick={stopSpeaking}
                  className="text-muted-foreground"
                  style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Stop
                </button>
              </span>
            )}
          </div>

          <button
            onClick={() => setMessages([])}
            className="btn btn-ghost btn-sm"
          >
            <Trash2 size={16} />
            Clear Chat
          </button>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="info-box"
        >
          <h3 className="info-box-title">How it works</h3>
          <ul className="info-box-list">
            <li className="info-box-item">
              <span className="comparison-dot" />
              Click the mic button and speak naturally
            </li>
            <li className="info-box-item">
              <span className="comparison-dot" />
              Or type your message and press Enter
            </li>
            <li className="info-box-item">
              <span className="comparison-dot" />
              The AI responds using Gemini with context awareness
            </li>
            <li className="info-box-item">
              <span className="comparison-dot" />
              Toggle voice output to hear responses spoken aloud
            </li>
          </ul>
        </motion.div>
      </div>

      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={() => {
          setHasApiKey(true);
          setShowApiModal(false);
        }}
      />
    </main>
  );
}
