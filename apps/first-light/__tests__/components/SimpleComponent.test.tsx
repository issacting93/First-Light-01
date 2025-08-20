import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Simple test component for demonstration
const TestComponent = ({ title, onClick }: { title: string; onClick?: () => void }) => (
  <div>
    <h1>{title}</h1>
    <button onClick={onClick}>Click me</button>
  </div>
);

describe('TestComponent', () => {
  it('renders the title', () => {
    render(<TestComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders a button', () => {
    render(<TestComponent title="Test Title" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
}); 