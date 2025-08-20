import { Modal } from '../modals';

interface TransmissionResultProps {
  accuracy: number;
  onClose: () => void;
  onNext: () => void;
}

export function TransmissionResult({ accuracy, onClose, onNext }: TransmissionResultProps) {
  const getResultColor = () => {
    if (accuracy >= 80) return '#ff4e42'; // Success - red
    if (accuracy >= 60) return '#c2362f'; // Warning - darker red
    return '#ffb3ab'; // Error - light red
  };

  const getResultMessage = () => {
    if (accuracy >= 80) return 'TRANSMISSION DECODED SUCCESSFULLY!';
    if (accuracy >= 60) return 'PARTIAL SUCCESS - SOME MEANING UNCLEAR';
    return 'TRANSLATION ACCURACY TOO LOW';
  };

  return (
    <Modal onClose={onClose} maxWidth="400px">
      <div className="p-6 text-center" style={{
        fontFamily: '"TheGoodMonolith", monospace'
      }}>
        <div className="text-2xl font-bold mb-4 tracking-wide uppercase" style={{
          color: '#f3ede9'
        }}>
          TRANSMISSION ANALYSIS
        </div>
        
        <div className="text-xl mb-4 font-bold tracking-wide uppercase" style={{
          color: getResultColor()
        }}>
          ACCURACY: {accuracy}%
        </div>
        
        <div className="text-lg mb-6 tracking-wide uppercase" style={{
          color: '#c2b8b2'
        }}>
          {getResultMessage()}
        </div>
        
        <div className="flex gap-4 justify-center">
          <button 
            className="px-6 py-2 cursor-pointer rounded transition-all duration-300 font-bold tracking-wide uppercase"
            style={{
              background: '#ff4e42',
              color: '#080C10',
              border: '2px solid #ff4e42',
              fontSize: '0.9rem',
              letterSpacing: '2px',
              boxShadow: '0 0 15px rgba(255, 78, 66, 0.3)',
              fontFamily: '"TheGoodMonolith", monospace'
            }}
            onClick={onNext}
          >
            <div className="text-lg">NEXT TRANSMISSION</div>
          </button>
          
          <button 
            className="px-6 py-2 cursor-pointer rounded transition-all duration-300 font-bold tracking-wide uppercase"
            style={{
              background: 'rgba(255, 78, 66, 0.1)',
              color: '#ff4e42',
              border: '2px solid rgba(255, 78, 66, 0.3)',
              fontSize: '0.9rem',
              letterSpacing: '2px',
              fontFamily: '"TheGoodMonolith", monospace'
            }}
            onClick={onClose}
          >
            <div className="text-lg">CONTINUE</div>
          </button>
        </div>
      </div>
    </Modal>
  );
} 