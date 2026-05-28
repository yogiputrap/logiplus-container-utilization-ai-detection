'use client';

import { useEffect, useRef } from 'react';

interface Prediction {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
}

interface BoundingBoxCanvasProps {
    imageUrl: string;
    predictions: Prediction[];
}

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
];

export default function BoundingBoxCanvas({ imageUrl, predictions }: BoundingBoxCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawPredictions = () => {
            const maxHeight = 600; // Maximum height in pixels
            let displayWidth = image.naturalWidth;
            let displayHeight = image.naturalHeight;

            // Scale down if image is too tall
            if (displayHeight > maxHeight) {
                const scale = maxHeight / displayHeight;
                displayWidth = image.naturalWidth * scale;
                displayHeight = maxHeight;
            }

            // Set canvas size to display size
            canvas.width = displayWidth;
            canvas.height = displayHeight;

            // Draw image scaled to fit
            ctx.drawImage(image, 0, 0, displayWidth, displayHeight);

            // Calculate scale factor for bounding boxes
            const scaleX = displayWidth / image.naturalWidth;
            const scaleY = displayHeight / image.naturalHeight;

            // Draw bounding boxes
            predictions.forEach((pred, index) => {
                const color = COLORS[index % COLORS.length];

                // Calculate box coordinates (Roboflow uses center x, y) and scale them
                const x = (pred.x - pred.width / 2) * scaleX;
                const y = (pred.y - pred.height / 2) * scaleY;
                const width = pred.width * scaleX;
                const height = pred.height * scaleY;

                // Draw box
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, width, height);

                // Draw label background
                const label = `${pred.class} ${(pred.confidence * 100).toFixed(1)}%`;
                ctx.font = 'bold 14px Inter, sans-serif';
                const textMetrics = ctx.measureText(label);
                const textHeight = 18;
                const padding = 6;

                ctx.fillStyle = color;
                ctx.fillRect(
                    x,
                    y - textHeight - padding,
                    textMetrics.width + padding * 2,
                    textHeight + padding
                );

                // Draw label text
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(label, x + padding, y - padding);
            });
        };

        if (image.complete) {
            drawPredictions();
        } else {
            image.onload = drawPredictions;
        }
    }, [imageUrl, predictions]);

    return (
        <div className="relative w-full">
            <img
                ref={imageRef}
                src={imageUrl}
                alt="Detection source"
                className="hidden"
            />
            <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-xl shadow-lg border-2 border-gray-200"
            />
        </div>
    );
}
