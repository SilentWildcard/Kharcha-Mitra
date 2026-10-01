import React from 'react';
import AIChat from '../components/AIChat';

const KharchaAI = () => {
  return (
    <div className="ai-page">
      <div className="page-header">
        <h1>Kharcha AI</h1>
        <p>Your AI spending assistant</p>
      </div>
      <AIChat />
    </div>
  );
};

export default KharchaAI;
