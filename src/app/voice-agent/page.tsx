"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import NeuButton from "@/components/NeuButton";
import ApiKeyModal from "@/components/ApiKeyModal";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Loader2,
  Sparkles,
  Clock,
  Send,
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

      // Speak the response if voice is enabled
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
    <main className="min-h-screen pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="text-purple-400" size={16} />
            <span className="text-sm text-zinc-400">Real-Time Voice AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Voice Agent
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Conversational AI that responds in real-time. Click the mic or type to start.
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong p-6 mb-6 h-[500px] flex flex-col"
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="text-zinc-600 mx-auto mb-4" size={48} />
                  <p className="text-zinc-400">
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
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-cyan-500/20 text-cyan-50"
                        : "glass text-zinc-200"
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.latency && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500">
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
                className="flex justify-start"
              >
                <div className="glass p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin text-cyan-400" size={16} />
                    <span className="text-zinc-400">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-4">
            {/* Voice Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-3 rounded-xl transition-colors ${
                voiceEnabled
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-zinc-800 text-zinc-500"
              }`}
              title={voiceEnabled ? "Voice output on" : "Voice output off"}
            >
              {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage(inputText)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isProcessing}
            />

            {/* Send Button */}
            <NeuButton
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isProcessing}
              variant="secondary"
            >
              <Send size={20} />
            </NeuButton>

            {/* Mic Button */}
            <motion.button
              onClick={isListening ? undefined : startListening}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-2xl transition-all ${
                isListening
                  ? "bg-red-500/20 text-red-400 animate-pulse"
                  : "neu-button text-cyan-400"
              }`}
              disabled={isProcessing}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </motion.button>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            {isListening && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                Listening...
              </span>
            )}
            {isSpeaking && (
              <span className="flex items-center gap-2">
                <Volume2 size={16} className="text-purple-400" />
                Speaking...
                <button
                  onClick={stopSpeaking}
                  className="text-zinc-500 hover:text-white"
                >
                  Stop
                </button>
              </span>
            )}
          </div>

          <NeuButton
            onClick={() => setMessages([])}
            variant="ghost"
            size="sm"
          >
            Clear Chat
          </NeuButton>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass p-6"
        >
          <h3 className="text-lg font-medium text-white mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">•</span>
              Click the mic button and speak naturally
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">•</span>
              Or type your message and press Enter
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">•</span>
              The AI responds using Gemini with context awareness
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">•</span>
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
