import React from 'react';
import { cn } from '../../utils/cn';

interface StampProps {
    label: string;
    color?: 'red' | 'blue' | 'black';
    className?: string;
    rotation?: number;
}

export const Stamp: React.FC<StampProps> = ({ label, color = 'red', className, rotation = -15 }) => {
    const colorClass = color === 'red' ? 'text-stamp-red border-stamp-red' :
        color === 'blue' ? 'text-blue-800 border-blue-800' : 'text-ink-black border-ink-black';

    return (
        <div
            className={cn(
                "border-4 font-bold uppercase tracking-widest px-4 py-2 inline-block opacity-80 mix-blend-multiply",
                "font-courier text-xl shadow-sm backdrop-blur-[1px]",
                // We simulate ink bleeding with a slight text-shadow in CSS if needed, 
                // or SVG filters for advanced users. For now, simple border/text.
                colorClass,
                className
            )}
            style={{
                transform: `rotate(${rotation}deg)`,
                maskImage: 'url("data:image/svg+xml;utf8,<svg width=\'100%\' height=\'100%\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'><rect x=\'0\' y=\'0\' width=\'100%\' height=\'100%\' fill=\'black\' opacity=\'0.9\'/><path d=\'M0 0 L100 100 M100 0 L0 100\' stroke=\'white\' stroke-width=\'2\' opacity=\'0.1\'/></svg>")',
            }}
        >
            {label}
        </div>
    );
};
