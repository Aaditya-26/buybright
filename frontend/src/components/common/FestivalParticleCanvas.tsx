/**
 * BuyBright Festive Dynamic Particle Canvas.
 * Ultra-lightweight 60fps ambient decorative particles for active festival themes
 * (e.g., golden sparkles & diyas for Diwali, color splashes for Holi, snowflakes for Christmas, confetti for New Year).
 */

import React, { useEffect, useRef } from 'react';
import { ParticleEffectType } from '../../types/festival';

interface FestivalParticleCanvasProps {
  effectType: ParticleEffectType;
  primaryColor?: string;
  secondaryColor?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacityDelta: number;
  color: string;
  char?: string;
  rotation?: number;
  rotationSpeed?: number;
}

export const FestivalParticleCanvas: React.FC<FestivalParticleCanvasProps> = ({
  effectType,
  primaryColor = '#d97706',
  secondaryColor = '#ea580c',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (effectType === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 120); // confined to top banner zone for extreme performance

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = 120;
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const maxParticles = window.innerWidth < 768 ? 16 : 30;

    const colors = [
      primaryColor,
      secondaryColor,
      '#fbbf24',
      '#f59e0b',
      '#ffffff',
      '#f43f5e',
      '#a855f7',
    ];

    const chars =
      effectType === 'sparkles_diyas'
        ? ['✨', '✦', '⋆', '🪔']
        : effectType === 'snowflakes'
        ? ['❄', '❅', '✻']
        : effectType === 'colors_splash'
        ? ['●', '✦', '◆']
        : effectType === 'marigold_flowers'
        ? ['🌺', '🌼', '✿']
        : effectType === 'confetti'
        ? ['🎉', '✨', '▮', '▲']
        : ['✦', '✨', '★'];

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.7 + 0.3,
        opacityDelta: (Math.random() - 0.5) * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        char: chars[Math.floor(Math.random() * chars.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacityDelta;
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }

        if (p.opacity <= 0.15 || p.opacity >= 0.9) {
          p.opacityDelta = -p.opacityDelta;
        }

        if (p.y > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -10;
        if (p.x < -20) p.x = width + 10;

        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.rotation) ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));

        if (p.char && (effectType === 'sparkles_diyas' || effectType === 'marigold_flowers' || effectType === 'snowflakes' || effectType === 'confetti')) {
          ctx.font = `${p.size + 4}px sans-serif`;
          ctx.fillText(p.char, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [effectType, primaryColor, secondaryColor]);

  if (effectType === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="festival-particles-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};
