import React, { useEffect, useRef } from 'react';

const MathProblemCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Settings
        ctx.font = 'bold 36px Comic Sans MS';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw colorful numbers and symbols
        const elements = [
            { text: '5', x: centerX - 90, color: '#e74c3c' },
            { text: '+', x: centerX - 40, color: '#2ecc71' },
            { text: '3', x: centerX + 10, color: '#3498db' },
            { text: '=', x: centerX + 60, color: '#f1c40f' },
            { text: '?', x: centerX + 110, color: '#9b59b6' },
        ];

        elements.forEach(({ text, x, color }) => {
            ctx.fillStyle = color;
            ctx.fillText(text, x, centerY);
        });

        // Draw decorations: circles around numbers
        elements.forEach(({ x, color }) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.arc(x, centerY, 25, 0, 2 * Math.PI);
            ctx.stroke();
        });

        // Draw a fun arrow below the equation
        ctx.beginPath();
        ctx.moveTo(centerX - 50, centerY + 40);
        ctx.lineTo(centerX + 50, centerY + 40);
        ctx.lineTo(centerX + 40, centerY + 30);
        ctx.moveTo(centerX + 50, centerY + 40);
        ctx.lineTo(centerX + 40, centerY + 50);
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Optional background highlight
        ctx.fillStyle = 'rgba(255, 255, 0, 0.1)';
        ctx.fillRect(20, centerY - 40, canvas.width - 40, 80);
    }, []);

    return <canvas ref={canvasRef} width={400} height={150} />;
};

export default MathProblemCanvas;
