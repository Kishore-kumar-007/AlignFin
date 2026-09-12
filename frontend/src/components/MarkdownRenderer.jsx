import React from 'react';

export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  const lines = content.split('\n').filter(line => line.trim() !== '');

  return (
    <div className={`space-y-3 font-medium ${className}`}>
      {lines.map((line, idx) => {
        let isHeading = false;
        let isList = false;
        let text = line;

        if (text.startsWith('### ')) {
          isHeading = true;
          text = text.replace(/^###\s+/, '');
        } else if (text.startsWith('## ')) {
          isHeading = true;
          text = text.replace(/^##\s+/, '');
        } else if (text.startsWith('- ')) {
          isList = true;
          text = text.replace(/^- /, '');
        } else if (text.startsWith('* ')) {
          isList = true;
          text = text.replace(/^\*\s+/, '');
        }

        const renderText = (str) => {
          const parts = str.split(/(\*\*.*?\*\*)/g);
          return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          });
        };

        if (isHeading) {
          return <h4 key={idx} className="font-bold text-gray-900 text-base">{renderText(text)}</h4>;
        }

        if (isList) {
          return (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-gray-400 font-bold mt-0.5">•</span>
              <p className="text-gray-800 leading-relaxed flex-1">{renderText(text)}</p>
            </div>
          );
        }

        return <p key={idx} className="text-gray-800 leading-relaxed">{renderText(text)}</p>;
      })}
    </div>
  );
}
