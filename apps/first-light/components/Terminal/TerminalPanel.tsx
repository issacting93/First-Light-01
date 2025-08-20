interface TerminalPanelProps {
  messages: string[];
}

export const TerminalPanel = ({ messages }: TerminalPanelProps) => (
  <div className="mt-6 ml-4 max-w-xs rounded-md">
    <div className="rounded-md border border-[rgba(255,78,66,0.3)] bg-[rgba(30,26,24,0.7)] overflow-hidden backdrop-blur-lg">
      <div className="px-3 py-2 text-sm bg-[rgba(0,0,0,0.3)] text-[#ff4e42] flex justify-between uppercase font-semibold tracking-wider">
        <span>Terminal</span>
        <span>Online</span>
      </div>
      <div className="p-3 h-[150px] overflow-y-auto text-xs text-[#c2b8b2] font-mono leading-relaxed">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
        <div className="text-[#ff4e42] animate-pulse">|</div>
      </div>
    </div>
  </div>
); 