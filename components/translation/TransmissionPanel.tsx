import { useMemo } from 'react';

interface Transmission {
  id: string;
  originalId: string;
  name: string;
  status: string;
}

interface TransmissionDashboardProps {
  selectedTransmission: string | null;
  onTransmissionSelect: (id: string) => void;
  transmissions: Transmission[];
  fragmentsDecoded: number;
  totalFragments: number;
}

interface Transmission03Props {
  currentTransmission?: {
    id: string;
    translation?: string;
    excerpt?: string;
    [key: string]: any;
  };
}

export function TransmissionDashboard({
  selectedTransmission,
  onTransmissionSelect,
  transmissions,
  fragmentsDecoded,
  totalFragments,
}: TransmissionDashboardProps) {
  const memoizedTransmissions = useMemo(() => transmissions, [transmissions]);

  return (
    <div className="absolute top-6 left-6 w-[401px] z-30 bg-[#050505] border border-[rgba(248,75,64,0.2)] rounded-2xl shadow-lg backdrop-blur-sm p-2 font-[TheGoodMonolith]">
      <div className="flex flex-col gap-6 p-6">
        
        {/* Header: Fragments Decoded */}
        <div className="flex justify-between items-center px-6 py-4 border border-[#f84b40] rounded-xl text-[#f84b40] text-sm tracking-widest uppercase w-full bg-[rgba(248,75,64,0.05)] backdrop-blur-sm font-bold">
          <span>Fragments Decoded</span>
          <span>{fragmentsDecoded} / {totalFragments} Complete</span>
        </div>

        {/* Completion Banner */}
        {fragmentsDecoded >= totalFragments && totalFragments > 0 && (
          <div className="flex justify-center items-center px-4 py-3 border border-[#4ade80] rounded-xl text-[#4ade80] text-sm tracking-widest uppercase w-full bg-[rgba(74,222,128,0.1)] backdrop-blur-sm font-bold animate-pulse">
            🎉 All Transmissions Synchronized!
          </div>
        )}

        {/* Transmission List */}
        <div className="bg-[rgba(22,22,22,0.3)] border border-[rgba(248,75,64,0.4)] rounded-2xl h-[240px] flex px-4 py-3 gap-4 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto max-h-[220px] pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#ff4e42] scrollbar-thumb-rounded-md">
            <div className="flex flex-col gap-3 w-full px-4">
              {memoizedTransmissions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => onTransmissionSelect(tx.id)}
                  className={`flex justify-between items-center p-3 text-xs tracking-widest uppercase text-[#ffd7d5] cursor-pointer transition-all duration-200 rounded-lg
                    ${selectedTransmission === tx.originalId
                      ? 'border border-[#f84b40] bg-[rgba(248,75,64,0.1)] shadow-sm'
                      : 'hover:bg-[rgba(248,75,64,0.1)] border border-transparent hover:border-[rgba(248,75,64,0.3)]'}
                  `}
                >
                  <span className="font-medium">{tx.name}</span>
                  <span className={`font-bold px-2 py-1 rounded text-xs ${
                    tx.status === 'SYNCHRONIZED'
                      ? 'text-[#4ade80] bg-[rgba(74,222,128,0.1)]'
                      : tx.status === 'ACTIVE'
                        ? 'text-[#f84b40] bg-[rgba(248,75,64,0.1)]'
                        : 'text-[#6b7280] bg-[rgba(107,114,128,0.1)]'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Glow Border */}
      <div
        aria-hidden="true"
        className="absolute inset-0 border border-[rgba(248,75,64,0.2)] rounded-2xl pointer-events-none shadow-[0_0_20px_rgba(248,75,64,0.1)]"
      />
    </div>
  );
}

export function Transmission03({ currentTransmission }: Transmission03Props) {
  if (!currentTransmission) return null;

  const hasTranslation = !!currentTransmission.translation;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[#050505] border border-[rgba(248,75,64,0.3)] rounded-2xl shadow-lg backdrop-blur-sm font-[TheGoodMonolith]">
      
      {/* Header */}
      <h1 className="text-[#ff4e42] font-bold text-2xl tracking-widest mb-4 px-6 pt-6">
        TRANSMISSION {currentTransmission.id}
      </h1>

      {/* Message Box */}
      <div className="mt-4 bg-[rgba(22,22,22,0.8)] border border-[rgba(248,75,64,0.2)] rounded-2xl px-6 py-4 text-[#f3ede9] overflow-y-scroll">
        {hasTranslation ? (
          <p className="text-[#c2b8b2] text-sm leading-relaxed">{currentTransmission.excerpt}</p>
        ) : (
          <>
            <p className="text-[#ff4e42]">Translation data not available</p>
            <p className="text-[#c2b8b2] text-sm mt-2">Available data: {JSON.stringify(Object.keys(currentTransmission))}</p>
          </>
        )}
      </div>
    </div>
  );
}
