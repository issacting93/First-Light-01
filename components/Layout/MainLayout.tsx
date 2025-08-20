export const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-full h-full overflow-hidden bg-[#080C10] text-[#f3ede9] font-[TheGoodMonolith]">
    {/* Grid Background */}
    <div
      className="absolute inset-0 z-0 pointer-events-none opacity-5"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255,240,230,0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,240,230,0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    />
    {/* Main Content */}
    <div className="relative z-10 flex w-full h-full">{children}</div>
  </div>
); 