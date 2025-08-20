import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
  maxHeight?: string;
}

export function Modal({ children, onClose, maxWidth = "500px", maxHeight = "80vh" }: ModalProps) {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        className="w-full flex flex-col"
        style={{
          maxWidth: maxWidth,
          maxHeight: maxHeight,
          background: '#080C10',
          border: '1px solid rgba(255, 78, 66, 0.3)',
          borderRadius: '5px',
          fontFamily: '"TheGoodMonolith", monospace',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto" style={{ maxHeight: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
} 