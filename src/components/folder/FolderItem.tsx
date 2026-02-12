import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface FolderItemProps {
    id: string;
    title: string;
    date: string;
    status: 'draft' | 'approved' | 'archived';
    onClick: () => void;
    onDelete: () => void;
}

export const FolderItem: React.FC<FolderItemProps> = ({ title, date, status, onClick, onDelete }) => {

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Don't open the folder
        if (window.confirm('⚠️ CONFIRMER LA SUPPRESSION ?\n\nCette action est irréversible.\nLe dossier sera définitivement détruit.')) {
            onDelete();
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "cursor-pointer w-64 h-48 bg-folder-manila shadow-folder relative p-4 flex flex-col justify-between select-none group",
                "before:content-[''] before:absolute before:top-[-10px] before:left-0 before:w-24 before:h-4 before:bg-folder-manila before:rounded-t-md",
                "hover:shadow-xl transition-shadow duration-300"
            )}
        >
            {/* Delete button - visible on hover */}
            <button
                onClick={handleDelete}
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-sm bg-red-900/10 hover:bg-red-900/30 text-red-800"
                title="Supprimer ce dossier"
            >
                <Trash2 size={14} />
            </button>

            {/* Matricule (title) instead of UUID */}
            <div className="absolute top-2 right-10 text-xs font-typewriter opacity-60">
                {title}
            </div>

            <div className="mt-8">
                <h3 className="font-typewriter text-lg font-bold uppercase tracking-widest text-ink-black/80 truncate">
                    {title}
                </h3>
                <p className="font-courier text-sm opacity-60">{date}</p>
            </div>

            <div className="self-end">
                {status === 'approved' && (
                    <span className="font-bold border border-red-800 text-red-800 text-xs px-2 py-0.5 rounded-sm uppercase tracking-wider rotate-[-5deg] inline-block">
                        APPROVED
                    </span>
                )}
                {status === 'draft' && (
                    <span className="font-bold border border-gray-600 text-gray-600 text-xs px-2 py-0.5 rounded-sm uppercase tracking-wider inline-block">
                        DRAFT
                    </span>
                )}
            </div>

            {/* Texture overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-10 pointer-events-none" />
        </motion.div>
    );
};
