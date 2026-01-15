import React, { useEffect, useState, useRef } from 'react';

const HeartBackground: React.FC = () => {
  const [elements, setElements] = useState<Array<{ id: number; left: string; delay: string; size: string; content: string; duration: string }>>([]);
  // We'll manage stars via refs for high-performance direct DOM manipulation
  const starsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    // 1. Floating Hearts/Text (CSS Animation)
    const contents = ['❤', 'Marwa', 'مروى', '❤', 'Marwa', '💗'];
    
    const newElements = Array.from({ length: 20 }).map((_, i) => {
      const content = contents[Math.floor(Math.random() * contents.length)];
      const isText = content.length > 1;
      const size = isText 
        ? `${Math.random() * 0.8 + 0.8}rem` 
        : `${Math.random() * 1.2 + 0.8}rem`;
        
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 20}s`,
        duration: `${15 + Math.random() * 10}s`,
        size,
        content
      };
    });
    setElements(newElements);

    // 2. Stars Configuration
    // Initialize stars directly in DOM via the loop below, but we prepare data here if needed.
    // However, for the magnetic effect, we render them and then animate via JS.

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      
      mouseRef.current = { x: clientX, y: clientY };

      if (containerRef.current) {
        // Glow effect
        containerRef.current.style.background = `radial-gradient(600px circle at ${clientX}px ${clientY}px, rgba(167, 139, 250, 0.15), transparent 40%)`;
      }
    };

    // 3. Magnetic Stars Animation Loop
    let animationFrameId: number;
    const animateStars = () => {
      starsRef.current.forEach((star, index) => {
        if (!star) return;

        // Get star's base position (we store it in dataset for reference)
        const baseX = parseFloat(star.dataset.x || '0');
        const baseY = parseFloat(star.dataset.y || '0');

        // Calculate distance to mouse
        const rect = star.getBoundingClientRect();
        // Since rect changes with transform, we approximate using the base percentage relative to window
        // But for performance, let's use the mouse distance to the screen center relative to the star
        // A simpler "magnetic" effect: Move star slightly TOWARDS mouse
        
        const dx = mouseRef.current.x - (window.innerWidth * (baseX / 100));
        const dy = mouseRef.current.y - (window.innerHeight * (baseY / 100));
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = 300; // Radius of influence
        let moveX = 0;
        let moveY = 0;

        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist;
          // Move towards mouse by a factor
          moveX = dx * force * 0.2; 
          moveY = dy * force * 0.2;
        }

        // Apply transform
        star.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${distance < maxDist ? 1.5 : 1})`;
        star.style.opacity = distance < maxDist ? '1' : '0.4';
      });

      animationFrameId = requestAnimationFrame(animateStars);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    animateStars();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      cancelAnimationFrame(animationFrameId);
    };

  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

      {/* Interactive Glow Layer */}
      <div ref={containerRef} className="absolute inset-0 transition-opacity duration-300 ease-out" style={{ background: 'transparent' }} />

      {/* Magnetic Stars Layer */}
      {Array.from({ length: 60 }).map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        return (
          <div
            key={`star-${i}`}
            ref={el => { if (el) starsRef.current[i] = el }}
            data-x={left}
            data-y={top}
            className="absolute bg-white rounded-full transition-transform duration-100 ease-out will-change-transform"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: 0.4
            }}
          />
        );
      })}

      {/* Floating Elements Layer */}
      {elements.map((el) => (
        <div
          key={`float-${el.id}`}
          className="floating-heart text-pink-300/10 font-amiri font-bold select-none whitespace-nowrap blur-[1px]"
          style={{
            left: el.left,
            animationDelay: el.delay,
            animationDuration: el.duration,
            fontSize: el.size,
          }}
        >
          {el.content}
        </div>
      ))}
    </div>
  );
};

export default HeartBackground;