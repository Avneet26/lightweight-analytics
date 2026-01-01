"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    baseSize: number;
    speed: number;
    angle: number;
    breatheOffset: number;
    breatheSpeed: number;
}

export function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const [isMounted, setIsMounted] = useState(false);

    const initParticles = useCallback((width: number, height: number) => {
        const particles: Particle[] = [];
        const spacing = 60;
        const cols = Math.ceil(width / spacing);
        const rows = Math.ceil(height / spacing);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * spacing + spacing / 2;
                const y = j * spacing + spacing / 2;
                particles.push({
                    x,
                    y,
                    baseX: x,
                    baseY: y,
                    size: 1.5,
                    baseSize: 1.5,
                    speed: 0.02 + Math.random() * 0.02,
                    angle: Math.random() * Math.PI * 2,
                    breatheOffset: Math.random() * Math.PI * 2,
                    breatheSpeed: 0.02 + Math.random() * 0.01,
                });
            }
        }

        particlesRef.current = particles;
    }, []);

    const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);

        const time = Date.now() * 0.001;
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;
        const mouseRadius = 150;

        particlesRef.current.forEach((particle) => {
            // Breathing effect
            const breathe = Math.sin(time * 2 + particle.breatheOffset) * 0.5 + 0.5;
            particle.size = particle.baseSize + breathe * 0.8;

            // Subtle floating movement
            particle.angle += particle.speed;
            const floatX = Math.sin(particle.angle) * 3;
            const floatY = Math.cos(particle.angle * 0.7) * 3;

            // Mouse repulsion
            const dx = mouseX - particle.baseX;
            const dy = mouseY - particle.baseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let pushX = 0;
            let pushY = 0;

            if (distance < mouseRadius && distance > 0) {
                const force = (1 - distance / mouseRadius) * 30;
                pushX = -(dx / distance) * force;
                pushY = -(dy / distance) * force;
            }

            // Apply movement with easing
            const targetX = particle.baseX + floatX + pushX;
            const targetY = particle.baseY + floatY + pushY;
            particle.x += (targetX - particle.x) * 0.1;
            particle.y += (targetY - particle.y) * 0.1;

            // Draw particle
            const alpha = 0.2 + breathe * 0.15;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 94, 179, ${alpha})`;
            ctx.fill();

            // Draw connections to nearby particles
            particlesRef.current.forEach((other) => {
                if (other === particle) return;
                const ox = other.x - particle.x;
                const oy = other.y - particle.y;
                const dist = Math.sqrt(ox * ox + oy * oy);

                if (dist < 80) {
                    const lineAlpha = (1 - dist / 80) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(124, 94, 179, ${lineAlpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        animationRef.current = requestAnimationFrame(() => animate(ctx, width, height));
    }, []);

    // Mount check to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
            initParticles(window.innerWidth, window.innerHeight);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        animate(ctx, window.innerWidth, window.innerHeight);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isMounted, initParticles, animate]);

    // Don't render on server to avoid hydration mismatch
    if (!isMounted) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.7 }}
        />
    );
}
