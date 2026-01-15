import axios from "axios";
import { useEffect, useRef, useState, useCallback } from "react";

const Chatinterface = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [error, setError] = useState("");

  const API_URL = `${import.meta.env.VITE_EC2_URL}/chat`;

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  // Auto-clear error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Format timestamp
  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSend = useCallback(async () => {
    if (!userMessage.trim()) {
      setError("Input cannot be blank");
      return;
    }

    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    const userMsgObj = {
      id: Date.now(),
      role: "user",
      content: userMessage.trim(),
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setUserMessage("");
    setLoading(true);
    setAiTyping(true);

    // Focus input after sending
    setTimeout(() => inputRef.current?.focus(), 100);

    // Log chat API request (only in development)
    const requestId = Date.now();
    const timestamp = new Date().toISOString();
    const isDevelopment = import.meta.env.DEV;

    if (isDevelopment) {
      console.log("\n" + "=".repeat(80));
      console.log(`💬 [${timestamp}] CHAT API REQUEST #${requestId}`);
      // console.log("=".repeat(80));
      // console.log("🌐 API URL:", API_URL);
      // console.log("📝 User Message:", userMessage.trim());
      // console.log(
      //   "📏 Message Length:",
      //   userMessage.trim().length,
      //   "characters"
      // );
    }

    try {
      const apiStartTime = Date.now();
      if (isDevelopment) {
        console.log("📤 Sending request to backend...");
      }

      const res = await axios.post(
        API_URL,
        {
          userMessage: userMessage.trim(),
        },
        {
          signal: abortControllerRef.current.signal,
        }
      );

      const apiEndTime = Date.now();
      const apiDuration = apiEndTime - apiStartTime;

      // Log API response (only in development)
      if (isDevelopment) {
        console.log(
          "\n✅ [REQUEST #" + requestId + "] CHAT API RESPONSE RECEIVED"
        );
        console.log("⏱️  API Duration:", apiDuration + "ms");
        console.log("📊 Response Status:", res.status, res.statusText);
        console.log("📦 Response Data:", JSON.stringify(res.data, null, 2));
        console.log("🤖 AI Response:", res.data.response);
        console.log(
          "📏 Response Length:",
          res.data.response?.length || 0,
          "characters"
        );
        console.log("=".repeat(80) + "\n");
      }

      const aiMsgObj = {
        id: Date.now() + 1,
        role: "ai",
        content: res.data.response,
        time: getTime(),
      };

      // Show response immediately (removed fake delay for better UX)
      setMessages((prev) => [...prev, aiMsgObj]);
      setAiTyping(false);
      setLoading(false);
      abortControllerRef.current = null;
    } catch (err) {
      // Ignore abort errors
      if (axios.isCancel(err) || err.name === "AbortError") {
        return;
      }

      // Log API error (always log errors, but less verbose in production)
      if (isDevelopment) {
        console.error("\n" + "=".repeat(80));
        console.error(
          `❌ [${new Date().toISOString()}] CHAT API ERROR #${requestId}`
        );
        console.error("=".repeat(80));
        console.error("🔴 Error Type:", err.constructor.name);
        console.error("📝 Error Message:", err.message);

        if (err.response) {
          console.error("📡 Response Status:", err.response.status);
          console.error(
            "📡 Response Data:",
            JSON.stringify(err.response.data, null, 2)
          );
          console.error(
            "📡 Response Headers:",
            JSON.stringify(err.response.headers, null, 2)
          );
        } else if (err.request) {
          console.error("📡 Request Error:", err.request);
          console.error("⚠️  No response received from server");
        } else {
          console.error("📡 Error Config:", err.config);
        }
        console.error("=".repeat(80) + "\n");
      } else {
        // Production: minimal error logging
        console.error("Chat API Error:", err.message);
      }

      const errMsgObj = {
        id: Date.now() + 1,
        role: "ai",
        content: "Something went wrong. Please try again.",
        time: getTime(),
      };

      setMessages((prev) => [...prev, errMsgObj]);
      setAiTyping(false);
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [userMessage, API_URL]);

  return (
    <div className="flex flex-col h-full w-full relative bg-[#0f0f0f] overflow-hidden">
      {/* CHAT WINDOW */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-3 md:px-4 py-3 sm:py-4 bg-[#0f0f0f] text-white scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712102.png"
                alt="AI"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto opacity-80"
                loading="lazy"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-300">
              Welcome to Tanishk AI
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-md">
              Ask me anything about Tanishk's portfolio and projects!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 sm:gap-3 my-2 sm:my-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Avatar */}
            {msg.role === "ai" && (
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712102.png"
                alt="AI"
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex-shrink-0"
                loading="lazy"
              />
            )}

            {/* Message bubble */}
            <div
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[75%] md:max-w-[70%] fade-in break-words
              ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none shadow-lg shadow-blue-500/20"
                  : "bg-gray-800 text-white rounded-bl-none shadow-lg"
              }`}
            >
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              <p className="text-[10px] sm:text-xs text-right opacity-60 mt-1.5 sm:mt-2">
                {msg.time}
              </p>
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <img
                src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
                alt="User"
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex-shrink-0"
                loading="lazy"
              />
            )}
          </div>
        ))}

        {/* AI TYPING INDICATOR */}
        {aiTyping && (
          <div className="flex items-end gap-2 sm:gap-3 my-2 sm:my-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712102.png"
              alt="AI"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex-shrink-0"
              loading="lazy"
            />

            <div className="bg-gray-800 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl max-w-[60%] sm:max-w-[50%] typing-bubble shadow-lg">
              <div className="typing-loader"></div>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-1"></div>
      </div>

      {/* INPUT BAR */}
      <div className="relative w-full bg-[#151515] border-t border-gray-800/50 p-2 sm:p-3 md:p-4 flex items-end gap-2 sm:gap-3 shadow-2xl safe-area-inset-bottom flex-shrink-0">
        {/* ERROR MESSAGE */}
        {error && (
          <div className="absolute bottom-full left-0 right-0 px-4 mb-2 z-10">
            <div className="bg-red-500/90 text-white text-xs sm:text-sm text-center py-2 px-4 rounded-lg mx-auto max-w-md shadow-lg animate-fade-in">
              {error}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0 flex items-end gap-2 sm:gap-3 w-full">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-0 bg-[#222] text-white text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500 resize-none w-full"
            placeholder="Ask something..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
            maxLength={500}
          />

          <button
            className="bg-blue-500 text-white font-semibold text-sm sm:text-base px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20 flex-shrink-0 min-w-[60px] sm:min-w-[70px] md:min-w-[80px] touch-manipulation"
            onClick={handleSend}
            disabled={loading || !userMessage.trim()}
            aria-label="Send message"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatinterface;
