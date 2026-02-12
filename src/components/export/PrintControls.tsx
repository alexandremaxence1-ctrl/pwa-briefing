import React from 'react';
import { Download } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PrintControlsProps {
    onPrint: () => void;
    className?: string;
}

export const PrintControls: React.FC<PrintControlsProps> = ({ onPrint, className }) => {
    return (
        <div className={cn("flex gap-4 fixed bottom-8 right-8 z-50 print:hidden", className)}>
            <button
                onClick={onPrint}
                className="bg-ink-black text-paper-base px-6 py-3 font-courier font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-ink-black/80 transition-colors shadow-lg rounded-sm"
            >
                <Download size={18} /> Exporter PDF
            </button>
        </div>
    );
};
