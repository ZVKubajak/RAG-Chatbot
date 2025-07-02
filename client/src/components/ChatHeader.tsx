import { MessageCircle, ChevronDown } from "lucide-react";

interface ChatHeaderProps {
  onMinimize: () => void;
}

export default function ChatHeader({ onMinimize }: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">AI Assistant</h3>
          <p className="text-blue-100 text-xs">Online now</p>
        </div>
      </div>
      <button 
        onClick={onMinimize}
        className="text-white/80 hover:text-white transition-colors p-1"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}
