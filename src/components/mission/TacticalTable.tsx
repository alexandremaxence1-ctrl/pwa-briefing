import { TypewriterInput } from '../ui/TypewriterInput';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Column {
    key: string;
    label: string;
    placeholder?: string;
    width?: string;
}

interface TacticalTableProps<T> {
    title: string;
    columns: Column[];
    data: T[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, key: keyof T, value: string) => void;
    className?: string;
}

export function TacticalTable<T extends { id: string }>({
    title,
    columns,
    data,
    onAdd,
    onRemove,
    onChange,
    className
}: TacticalTableProps<T>) {
    return (
        <div className={cn("mb-8 font-typewriter", className)}>
            <div className="flex justify-between items-end border-b-2 border-ink-black mb-4 pb-1">
                <h3 className="font-bold uppercase tracking-wide text-lg">{title}</h3>
                <button
                    onClick={onAdd}
                    className="text-xs flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity uppercase font-courier"
                >
                    <Plus size={14} /> Ajouter Ligne
                </button>
            </div>

            <div className="w-full text-left border-collapse">
                <div className="flex border-b border-ink-black/20 pb-2 mb-2">
                    {columns.map((col) => (
                        <div key={col.key} className={cn("font-courier font-bold text-xs uppercase opacity-50 px-2", col.width || 'flex-1')}>
                            {col.label}
                        </div>
                    ))}
                    <div className="w-8"></div>
                </div>

                <div className="flex flex-col gap-2">
                    {data.map((row, index) => (
                        <div key={row.id} className="flex items-center gap-2 group">
                            {columns.map((col) => (
                                <div key={col.key} className={cn(col.width || 'flex-1')}>
                                    <TypewriterInput
                                        className="text-sm py-1 border-b border-ink-black/10 focus:border-ink-black/40"
                                        value={(row as any)[col.key]}
                                        onChange={(e) => onChange(index, col.key as keyof T, e.target.value)}
                                        placeholder={col.placeholder || "..."}
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => onRemove(index)}
                                className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-50 hover:!opacity-100 text-red-800 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    {data.length === 0 && (
                        <div className="text-center py-4 opacity-30 italic text-sm font-courier border border-dashed border-ink-black/10">
                            Aucune donnée enregistrée.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
