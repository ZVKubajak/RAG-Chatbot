import { MessageCircle } from "lucide-react";

interface ChatToggleButtonProps {
  onClick: () => void;
  hasNotification?: boolean;
}

export default function ChatToggleButton({ onClick, hasNotification = false }: ChatToggleButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button 
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all duration-200 hover:scale-105 animate-bounce-subtle relative"
      >
        <MessageCircle className="w-6 h-6" />
        {hasNotification && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        )}
      </button>
    </div>
  );
}
