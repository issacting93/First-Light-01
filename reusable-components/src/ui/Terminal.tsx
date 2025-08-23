import React, { useRef, useEffect } from 'react';

export interface TerminalProps {
  messages: string[];
  className?: string;
  maxHeight?: string;
  autoScroll?: boolean;
  showCursor?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  messages,
  className = '',
  maxHeight = '300px',
  autoScroll = true,
  showCursor = true,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);
  
  return (
    <div className={`bg-terminal-bg-panel border border-terminal-border rounded-lg overflow-hidden ${className}`}>
      {/* Terminal Header */}
      <div className="px-3 py-2 text-sm bg-terminal-bg-secondary text-terminal-accent-primary flex justify-between uppercase font-semibold tracking-wider border-b border-terminal-border">
        <span>Terminal</span>
        <span>Online</span>
      </div>
      
      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="p-3 overflow-y-auto text-xs text-terminal-text-secondary font-mono leading-relaxed"
        style={{ maxHeight }}
      >
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            {msg}
          </div>
        ))}
        {showCursor && (
          <div className="text-terminal-accent-primary animate-pulse">|</div>
        )}
      </div>
    </div>
  );
}; 