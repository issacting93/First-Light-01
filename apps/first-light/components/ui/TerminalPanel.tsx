import { useEffect, useRef } from 'react';

interface TerminalPanelProps {
  messages: string[];
}

export function TerminalPanel({ messages }: TerminalPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-auto h-[250px] bg-[rgba(30,26,24,0.7)] border border-[rgba(255,78,66,0.3)] rounded-md overflow-hidden backdrop-blur-lg flex flex-col">
      {/* Terminal Header */}
      <div className="flex justify-between items-center p-2 bg-[rgba(0,0,0,0.3)] text-sm text-[#ff4e42] border-b border-[rgba(255,78,66,0.3)]">
        <span className="uppercase tracking-wider">TERMINAL</span>
        <span className="text-xs">ONLINE</span>
      </div>
      
      {/* Terminal Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto p-2.5 text-xs leading-relaxed"
      >
        {messages.map((message, index) => (
          <div key={index} className="mb-1 text-[#c2b8b2] font-mono uppercase p-2">
            {message}
          </div>
        ))}
        
        {/* Typing indicator */}
        <div className="flex items-center text-[#c2b8b2] font-mono">
          <span className="animate-pulse">|</span>
        </div>
      </div>
    </div>
  );
}
