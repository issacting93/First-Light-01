import { useMemo } from 'react';
import { TransmissionDashboard, Transmission03 } from './translation/TransmissionPanel';
import dataService from "@/services/dataService";

interface MessageButtonProps {
  transmissions: any[];
  currentTransmission: any;
  onSelect: (transmissionId: string | number) => void;
  gameState: any; // Add gameState prop to access synchronization status
  viewTransmission?: (transmissionId: number) => void; // Add viewTransmission prop
}

export function MessageButton({
  transmissions,
  currentTransmission,
  onSelect,
  gameState,
  viewTransmission
}: MessageButtonProps) {
  // Convert transmissions to the format expected by TransmissionDashboard
  const transmissionItems = useMemo(() => transmissions.map((transmission, index) => {
    // Ensure unique string ID for React keys
    const uniqueId = `transmission-${transmission.id || index}`;
    const transmissionId = transmission.id || index;
    const numericId = typeof transmissionId === 'string' ? parseInt(transmissionId) : transmissionId;
    
    // Determine status based on game state
    let status = 'INACTIVE';
    if (gameState?.synchronizedTransmissions?.has(numericId)) {
      status = 'SYNCHRONIZED';
    } else if (gameState?.viewedTransmissions?.has(numericId)) {
      status = 'ACTIVE';
    }
    
    return {
      id: uniqueId,
      originalId: transmissionId.toString(), // Keep original ID for selection
      name: transmission.name || `TRANSMISSION ${transmissionId}`,
      status
    };
  }), [transmissions, gameState?.synchronizedTransmissions, gameState?.viewedTransmissions]);

  const selectedTransmission = currentTransmission?.id?.toString() || null;

  // Calculate fragments decoded and total fragments
  const fragmentsDecoded = gameState?.synchronizedTransmissions?.size || 0;
  const totalFragments = transmissions.length;

  // Check if current transmission is 100% translated (synchronized)
  const isCurrentTransmissionComplete = currentTransmission && 
    gameState?.synchronizedTransmissions?.has(parseInt(currentTransmission.id));

  // Find the full transmission data for Transmission03
  const fullTransmissionData = useMemo(() => {
    if (!currentTransmission || !isCurrentTransmissionComplete) {
      return null;
    }
    
    // Get the full narrative transmission data from dataService
    const numericId = parseInt(currentTransmission.id);
    const narrativeTransmission = dataService.getNarrativeTransmission(numericId);
    
    if (narrativeTransmission) {
      return narrativeTransmission;
    }
    
    return currentTransmission;
  }, [currentTransmission, isCurrentTransmissionComplete]);

  // Handle transmission selection and viewing
  const handleTransmissionSelect = (id: string) => {
    // Find the original ID from the unique ID
    const item = transmissionItems.find(item => item.id === id);
    if (item) {
      const numericId = parseInt(item.originalId);
      
      // Always view the transmission to unlock glyphs (not just first time)
      if (viewTransmission) {
        viewTransmission(numericId);
      }
      
      // Select the transmission
      onSelect(item.originalId);
    }
  };

  return (
    <div className="flex flex-col gap-6 top-[16px] absolute left-[16px] mt-6">
      <TransmissionDashboard
        selectedTransmission={selectedTransmission}
        onTransmissionSelect={handleTransmissionSelect}
        transmissions={transmissionItems}
        fragmentsDecoded={fragmentsDecoded}
        totalFragments={totalFragments}
      />
      
      {/* Show Transmission03 when current transmission is 100% translated */}
      {isCurrentTransmissionComplete && fullTransmissionData && (
        <div className="mt-6  absolute top-[400px] max-w-[400px] w-[400px]">
          <Transmission03 currentTransmission={fullTransmissionData} />
        </div>
      )}
    </div>
  );
}
