import { CheckCircle, Lock, Zap } from 'lucide-react';

interface StatusDotProps {
  status: 'completed' | 'active' | 'locked';
}

export function StatusDot({ status }: StatusDotProps) {
  const config = {
    completed: { 
      color: 'bg-terminal-success', 
      shadow: '0 0 8px rgba(16, 185, 129, 0.8)',
      icon: CheckCircle
    },
    active: { 
      color: 'bg-terminal-warning', 
      shadow: '0 0 8px rgba(251, 191, 36, 0.8)',
      icon: Zap
    },
    locked: { 
      color: 'bg-terminal-error', 
      shadow: '0 0 8px rgba(175, 30, 43, 0.8)',
      icon: Lock
    }
  };

  const { color, shadow, icon: Icon } = config[status];

  return (
    <>
      <div className={`w-2 h-2 rounded-full ${color}`} style={{ boxShadow: shadow }} />
      <Icon className="w-3 h-3" />
    </>
  );
} 