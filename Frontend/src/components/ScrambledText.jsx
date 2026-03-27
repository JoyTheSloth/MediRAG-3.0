import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ScrambledText = ({
  radius = 120,
  duration = 0.8,
  scrambleChars = '.:!@#$%^&*()_+-=[]{}|;:,.<>?/',
  className = '',
  style = {},
  children
}) => {
  const rootRef = useRef(null);
  const textRef = useRef(null);
  const originalText = children.toString();
  const [displayText, setDisplayText] = useState(originalText);
  const animationStates = useRef(originalText.split('').map(() => ({ isAnimating: false })));

  const scrambleChar = (index) => {
    if (animationStates.current[index].isAnimating) return;
    
    animationStates.current[index].isAnimating = true;
    
    let iterations = 0;
    const maxIterations = 6;
    const interval = setInterval(() => {
      setDisplayText((prev) => {
        const chars = prev.split('');
        chars[index] = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        return chars.join('');
      });
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        // Final restore
        setDisplayText((prev) => {
          const chars = prev.split('');
          chars[index] = originalText[index];
          return chars.join('');
        });
        animationStates.current[index].isAnimating = false;
      }
    }, 60);
  };

  useEffect(() => {
    if (!rootRef.current) return;

    const handleMove = (e) => {
      // Find each character position
      // For simplicity, we can do a distance check on the entire span or per char
      // Real per-char distance check:
      if (!textRef.current) return;
      
      const chars = textRef.current.children;
      for (let i = 0; i < chars.length; i++) {
        const rect = chars[i].getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        
        if (dist < radius) {
          scrambleChar(i);
        }
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [radius]);

  return (
    <span
      ref={rootRef}
      className={`scrambled-text-wrapper inline-block ${className}`}
      style={{ ...style, cursor: 'default' }}
    >
      <span ref={textRef} style={{ display: 'inline-flex' }}>
        {displayText.split('').map((char, i) => (
          <span 
            key={i} 
            className="scramble-char"
            style={{ 
              display: 'inline-block',
              minWidth: char === ' ' ? '0.25em' : 'auto'
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
};

export default ScrambledText;
