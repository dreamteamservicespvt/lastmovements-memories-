
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  alphaSpeed: number;
}

interface ParticlesProps {
  count?: number;
  className?: string;
}

const Particles: React.FC<ParticlesProps> = ({ count = 20, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const createParticles = () => {
      const particles: Particle[] = [];
      const colors = [
        "rgba(95, 61, 196, 0.7)",  // Purple
        "rgba(247, 37, 133, 0.7)", // Pink
        "rgba(255, 215, 0, 0.7)",  // Gold
      ];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 5 + 2,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.1,
          alphaSpeed: Math.random() * 0.005 + 0.002,
        });
      }

      return particles;
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      if (particlesRef.current.length === 0) {
        particlesRef.current = createParticles();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        // Update alpha with oscillation
        particle.alpha += particle.alphaSpeed;
        if (particle.alpha >= 0.6 || particle.alpha <= 0.1) {
          particle.alphaSpeed *= -1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace("0.7", particle.alpha.toString());
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = particle.size * 2;
        ctx.shadowColor = particle.color;
        
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};

export default Particles;
