import React, { useEffect, useRef } from 'react';

const EcgCanvasBg = () => {
    const canvasRef = useRef(null);
    let animationFrameId = null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        const setSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', setSize);
        setSize();

        const particles = [];
        const numParticles = 80;

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        const drawGridContext = () => {
            ctx.strokeStyle = 'rgba(0, 200, 150, 0.03)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            
            for(let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for(let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        };

        let timeOffset = 0;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            drawGridContext();

            // Draw ECG Wave
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 200, 150, 0.15)';
            ctx.lineWidth = 2;
            
            const pointCount = width;
            let currentX = 0;
            const centerY = height * 0.7;

            ctx.moveTo(0, centerY);

            for (let x = 0; x < pointCount; x += 5) {
                let y = centerY;
                
                // Add heartbeat spikes
                const beatPhase = (x + timeOffset) % 1000;
                
                if (beatPhase > 400 && beatPhase < 600) {
                    const localX = beatPhase - 400;
                    if (localX < 20) y -= localX * 1;
                    else if (localX < 40) y += (localX - 20) * 1;
                    else if (localX < 60) y -= (localX - 40) * 5;
                    else if (localX < 80) y += (localX - 60) * 7;
                    else if (localX < 100) y -= (localX - 80) * 2;
                    else if (localX < 120) y += (localX - 100) * 1;
                }

                y += Math.sin(x * 0.01 + timeOffset * 0.05) * 5;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();

            // Particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 200, 150, ${p.opacity})`;
                ctx.fill();
            });

            timeOffset += 2;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setSize);
            if(animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas id="bg-canvas" ref={canvasRef}></canvas>;
};

export default EcgCanvasBg;
