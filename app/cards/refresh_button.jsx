'use client';

import React from 'react';

export default function RefreshButton(path) {
  const handle_refresh = async () => {
    try {
      await fetch(path, { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
  };

  return (
    <button
      onClick={handle_refresh}
      className="fixed top-4 left-4 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors"
      title="Refresh cards"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
      </svg>
    </button>
  );
} 
