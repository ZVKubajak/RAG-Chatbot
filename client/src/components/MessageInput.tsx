import { Send, Paperclip } from "lucide-react";
import { useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onFileAttach: () => void;
  isTyping?: boolean;
}

export default function MessageInput({ onSendMessage, onFileAttach, isTyping = false }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
      <div className="flex items-center space-x-2">
        {/* File Attachment Button */}
        <button 
          onClick={onFileAttach}
          className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex-shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea 
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 pr-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm leading-relaxed max-h-24"
            rows={1}
          />
        </div>

        {/* Send Button */}
        <button 
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>AI is typing</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
