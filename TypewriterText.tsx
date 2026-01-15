import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  startDelay?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 50, 
  onComplete, 
  className = "",
  startDelay = 0
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Initial delay before typing starts
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [startDelay]);

  useEffect(() => {
    if (!hasStarted) return;

    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (index >= text.length) {
          clearInterval(intervalId);
          if (onComplete) onComplete();
          return text;
        }
        const nextChar = text.charAt(index);
        index++;
        return prev + nextChar;
      });
    }, speed);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, text, speed]);

  return (
    <div className={`${className} whitespace-pre-line leading-relaxed`}>
      {displayedText}
    </div>
  );
};

export default TypewriterText;