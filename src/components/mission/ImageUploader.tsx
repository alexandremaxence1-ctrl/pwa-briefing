import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ImageUploaderProps {
    images: string[];
    onAdd: (base64: string) => void;
    onRemove: (index: number) => void;
    className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onAdd, onRemove, className }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const processImage = (file: File) => {
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // Resize logic (Max width 800px)
                const maxWidth = 800;
                const scale = maxWidth / img.width;
                const width = scale < 1 ? maxWidth : img.width;
                const height = scale < 1 ? img.height * scale : img.height;

                canvas.width = width;
                canvas.height = height;

                // Draw image
                ctx.drawImage(img, 0, 0, width, height);

                // Apply "Sepia / Archive" Filter
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Standard Sepia Formula
                    const tr = 0.393 * r + 0.769 * g + 0.189 * b;
                    const tg = 0.349 * r + 0.686 * g + 0.168 * b;
                    const tb = 0.272 * r + 0.534 * g + 0.131 * b;

                    data[i] = tr > 255 ? 255 : tr;
                    data[i + 1] = tg > 255 ? 255 : tg;
                    data[i + 2] = tb > 255 ? 255 : tb;
                }
                ctx.putImageData(imageData, 0, 0);

                // Add a subtle brightness/grain overlay
                ctx.fillStyle = 'rgba(255, 240, 200, 0.1)'; // Warm tint
                ctx.fillRect(0, 0, width, height);

                // Compress
                const processedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                onAdd(processedBase64);
                setIsProcessing(false);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processImage(e.target.files[0]);
        }
    };

    return (
        <div className={cn("mb-8", className)}>
            <h3 className="font-typewriter font-bold uppercase tracking-wide text-lg border-b-2 border-ink-black mb-4 pb-1 flex items-center justify-between">
                Documents Annexes
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="text-xs flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity uppercase font-courier cursor-pointer disabled:opacity-30"
                >
                    {isProcessing ? 'Traitement...' : <><Upload size={14} /> Importer Photo</>}
                </button>
            </h3>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((img, index) => (
                    <div key={index} className="relative group border-4 border-white shadow-sm bg-white p-2 rotate-1 even:-rotate-1 transition-transform hover:scale-[1.02] hover:z-10">
                        {/* Tape effect */}
                        <div className="absolute -top-3 left-[40%] w-16 h-8 bg-yellow-100/40 backdrop-blur-sm rotate-2 shadow-sm pointer-events-none transform -skew-x-12 border-l border-r border-white/20" />

                        <img src={img} alt="Mission document" className="w-full h-auto sepia contrast-110 brightness-90 filter" />

                        <button
                            onClick={() => onRemove(index)}
                            className="absolute top-2 right-2 bg-red-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                        >
                            <X size={14} />
                        </button>
                        <div className="absolute bottom-1 right-2 text-[10px] font-courier opacity-50">REF-IMG-{index + 1}</div>
                    </div>
                ))}

                {images.length === 0 && (
                    <div className="col-span-full border-2 border-dashed border-ink-black/20 p-8 flex flex-col items-center justify-center text-ink-black/40 gap-2">
                        <ImageIcon size={32} />
                        <span className="font-courier text-xs uppercase">Aucune image jointe au dossier</span>
                    </div>
                )}
            </div>
        </div>
    );
};
