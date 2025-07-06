import { useState, useRef, useEffect } from "react";
import { MessageCircle, Paperclip, RefreshCcw, Send, X } from "lucide-react";
import { toast } from "react-toastify";
import chat from "../services/chat";
import FileModal from "./FileModal";

type Message = {
  text: string;
  isBot: boolean;
};

const defaultMessage = [
  {
    text: "Hi! I'm here to help you. How can I assist you today?",
    isBot: true,
  },
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(defaultMessage);
  const [inputValue, setInputValue] = useState("");
  const [showFileModal, setShowFileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const userMessageText = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    const userMessage: Message = {
      text: userMessageText,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chat({
        prompt: userMessageText,
        sessionId: sessionId ?? undefined,
      });

      if (response === "rate-limit") {
        toast(
          "You've reached the message limit for now. Please try again in an hour.",
          { type: "warning" }
        );
        return;
      } else if (response === "error") {
        toast("An error occurred. Please try again.", { type: "error" });
        return;
      }

      const botMessage: Message = {
        text: response.message,
        isBot: true,
      };

      setMessages((prev) => [...prev, botMessage]);
      setSessionId(response.sessionId);
    } catch (error) {
      console.error("[ChatBotWidget.tsx] handleSendMessage Error:", error);

      const errorMessage: Message = {
        text: "Something went wrong. Please try again.",
        isBot: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 transform translate-y-0 scale-100"
            : "opacity-0 transform translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg"
                    className="w-full h-full object-cover rounded-full"
                    alt="stock image of man"
                  />
                </div>
                <div>
                  <div className="flex">
                    <h3 className="font-semibold">AI Assistant</h3>
                    <button
                      className="cursor-pointer ml-2.5"
                      onClick={() => setMessages(defaultMessage)}
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs opacity-90">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? messagesEndRef : null}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl break-words ${
                    message.isBot
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-xs px-3 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFileModal(true)}
                className="text-gray-500 cursor-pointer hover:text-purple-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  inputValue.trim() && !isLoading
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                <Send className="h-[14px] w-[14px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button - Fixed in bottom right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 cursor-pointer right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* File Upload Modal */}
      {showFileModal && <FileModal setShowFileModal={setShowFileModal} />}
    </>
  );
};

export default ChatbotWidget;
