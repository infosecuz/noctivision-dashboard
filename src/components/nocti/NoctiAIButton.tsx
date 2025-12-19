import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoctiAIButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function NoctiAIButton({ isOpen, onClick }: NoctiAIButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-xl shadow-lg transition-all duration-300",
        "bg-primary text-primary-foreground hover:scale-105 active:scale-95",
        "flex items-center justify-center",
        "hover:shadow-xl hover:shadow-primary/25",
        isOpen && "rotate-90"
      )}
      aria-label="Toggle Nocti AI"
    >
      <Bot className="h-6 w-6" />
    </button>
  );
}
