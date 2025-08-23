import { expectType } from 'tsd';
import React from 'react';
import { Card, Terminal, HexGrid } from '../src';

// Card component type tests
expectType<JSX.Element>(React.createElement(Card, {}, 'content'));
expectType<JSX.Element>(React.createElement(Card, { variant: 'terminal', padding: 'lg', border: false }, 'content'));

// Terminal component type tests
expectType<JSX.Element>(React.createElement(Terminal, { messages: ['a'] }));
expectType<JSX.Element>(React.createElement(Terminal, { messages: ['a'], className: 'test', maxHeight: '500px' }));

// HexGrid component type tests
expectType<JSX.Element>(React.createElement(HexGrid, { items: [{ id: 'a', label: 'A' }] }));
expectType<JSX.Element>(React.createElement(HexGrid, { items: [{ id: 'a', label: 'A' }], onItemClick: (id: string) => {} }));

// Test that required props are enforced
// @ts-expect-error messages is required
React.createElement(Terminal, {});

// @ts-expect-error items is required
React.createElement(HexGrid, {}); 