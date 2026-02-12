import React from 'react';
import { cn } from '../../utils/cn';

interface PaperSheetProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const PaperSheet: React.FC<PaperSheetProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "bg-paper-base text-ink-black font-typewriter p-12 shadow-paper relative overflow-hidden transition-all",
                // CSS noise or texture can be added here. For now, we use the base color.
                "w-[21cm] min-h-[29.7cm] mx-auto", // A4 dimensions
                className
            )}
            {...props}
        >
            {/* Optional: Add filigree or repeated background pattern here */}
            <div className="absolute top-4 left-4 opacity-50 pointer-events-none">
                <img src="/logo-placeholder.png" alt="Logo" className="w-16 h-16 grayscale opacity-20" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>

            {children}

            <div className="absolute bottom-4 left-0 right-0 text-center text-xs opacity-50 pointer-events-none">
                <span className="text-red-800 font-bold uppercase tracking-widest border border-red-800 px-2 py-1">Document Classifié - Secret Défense</span>
            </div>
        </div>
    );
};
