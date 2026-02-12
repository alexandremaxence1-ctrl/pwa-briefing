import React, { useRef, useState } from 'react';
import type { Section, SubSection } from '../../store/missionStore';
import { Plus, Trash2, Upload, Paperclip, X } from 'lucide-react';

interface SectionEditorProps {
    sections: Section[];
    onChange: (sections: Section[]) => void;
    readOnly?: boolean;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

export const SectionEditor: React.FC<SectionEditorProps> = ({ sections, onChange, readOnly = false }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [target, setTarget] = useState<{ si: number; subI?: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const processImage = (file: File, si: number, subI?: number) => {
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const maxWidth = 1200;
                const scale = maxWidth / img.width;
                const width = scale < 1 ? maxWidth : img.width;
                const height = scale < 1 ? img.height * scale : img.height;

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const processedBase64 = canvas.toDataURL('image/jpeg', 0.8);

                const updated = [...sections];
                const newImg = { url: processedBase64, caption: '' };

                if (subI !== undefined) {
                    const newSubs = [...updated[si].subs];
                    const images = [...(newSubs[subI].images || []), newImg];
                    newSubs[subI] = { ...newSubs[subI], images };
                    updated[si] = { ...updated[si], subs: newSubs };
                } else {
                    const images = [...(updated[si].images || []), newImg];
                    updated[si] = { ...updated[si], images };
                }

                onChange(updated);
                setIsProcessing(false);
                setTarget(null);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && target) {
            processImage(e.target.files[0], target.si, target.subI);
        }
    };

    const triggerUpload = (si: number, subI?: number) => {
        setTarget({ si, subI });
        fileInputRef.current?.click();
    };

    const removeImage = (si: number, imgIdx: number, subI?: number) => {
        const updated = [...sections];
        if (subI !== undefined) {
            const newSubs = [...updated[si].subs];
            const images = [...(newSubs[subI].images || [])];
            images.splice(imgIdx, 1);
            newSubs[subI] = { ...newSubs[subI], images };
            updated[si] = { ...updated[si], subs: newSubs };
        } else {
            const images = [...(updated[si].images || [])];
            images.splice(imgIdx, 1);
            updated[si] = { ...updated[si], images };
        }
        onChange(updated);
    };

    const addSection = () => {
        const newSection: Section = {
            id: crypto.randomUUID(),
            title: 'NOUVELLE SECTION',
            subs: [{ id: crypto.randomUUID(), title: 'Sous-section', content: '' }],
        };
        onChange([...sections, newSection]);
    };

    const removeSection = (sectionIndex: number) => {
        const updated = [...sections];
        updated.splice(sectionIndex, 1);
        onChange(updated);
    };



    const addSub = (sectionIndex: number) => {
        const updated = [...sections];
        const newSub: SubSection = { id: crypto.randomUUID(), title: 'Nouvelle sous-section', content: '' };
        updated[sectionIndex] = {
            ...updated[sectionIndex],
            subs: [...updated[sectionIndex].subs, newSub],
        };
        onChange(updated);
    };

    const removeSub = (sectionIndex: number, subIndex: number) => {
        const updated = [...sections];
        const newSubs = [...updated[sectionIndex].subs];
        newSubs.splice(subIndex, 1);
        updated[sectionIndex] = { ...updated[sectionIndex], subs: newSubs };
        onChange(updated);
    };

    const updateSub = (sectionIndex: number, subIndex: number, field: 'title' | 'content', value: string) => {
        const updated = [...sections];
        const newSubs = [...updated[sectionIndex].subs];
        newSubs[subIndex] = { ...newSubs[subIndex], [field]: value };
        updated[sectionIndex] = { ...updated[sectionIndex], subs: newSubs };
        onChange(updated);
    };

    const updateSubImageCaption = (si: number, subI: number, imgIdx: number, caption: string) => {
        const updated = [...sections];
        const newSubs = [...updated[si].subs];
        const images = [...(newSubs[subI].images || [])];
        images[imgIdx] = { ...images[imgIdx], caption };
        newSubs[subI] = { ...newSubs[subI], images };
        updated[si] = { ...updated[si], subs: newSubs };
        onChange(updated);
    };

    const updateSection = (sectionIndex: number, field: 'title', value: string) => {
        const updated = [...sections];
        updated[sectionIndex] = { ...updated[sectionIndex], [field]: value };
        onChange(updated);
    };

    const updateSectionImageCaption = (si: number, imgIdx: number, caption: string) => {
        const updated = [...sections];
        const images = [...(updated[si].images || [])];
        images[imgIdx] = { ...images[imgIdx], caption };
        updated[si] = { ...updated[si], images };
        onChange(updated);
    };

    return (
        <div className="mb-12">
            <h2 className="text-xl font-bold border-b-2 border-ink-black mb-6 pb-2 uppercase tracking-wide">
                Corps du Briefing
            </h2>

            {sections.map((section, si) => (
                <div key={section.id} id={`section-${section.id}`} className="mb-8 pl-2 border-l-2 border-ink-black/20">
                    {/* Section header: "1. SITUATION" */}
                    <div className="flex items-center gap-2 mb-3 print:break-after-avoid">
                        <span className="font-bold text-lg font-typewriter min-w-[2rem]">{si + 1}.</span>
                        {readOnly ? (
                            <span className="font-bold text-lg uppercase tracking-wide">{section.title}</span>
                        ) : (
                            <input
                                value={section.title}
                                onChange={(e) => updateSection(si, 'title', e.target.value)}
                                className="font-bold text-lg uppercase tracking-wide bg-transparent border-b border-ink-black/30 focus:border-ink-black outline-none flex-1 font-typewriter py-1 px-1"
                                placeholder="Titre de section..."
                            />
                        )}
                        {!readOnly && (
                            <button
                                onClick={() => removeSection(si)}
                                className="text-red-800/60 hover:text-red-800 transition-colors p-1"
                                title="Supprimer cette section"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>

                    {/* Section Images */}
                    {section.images?.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative mb-4 group print-avoid-break">
                            <img src={img.url} alt={`Section visual ${imgIdx + 1}`} className="w-full h-auto border-2 border-ink-black/10 shadow-sm" />
                            {!readOnly && (
                                <button
                                    onClick={() => removeImage(si, imgIdx)}
                                    className="absolute top-2 right-2 bg-red-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                                >
                                    <X size={14} />
                                </button>
                            )}
                            <div className="mt-2 text-center">
                                {readOnly ? (
                                    <p className="italic text-xs font-courier opacity-60 px-4">
                                        {img.caption || 'Description image...'}
                                    </p>
                                ) : (
                                    <input
                                        value={img.caption || ''}
                                        onChange={(e) => updateSectionImageCaption(si, imgIdx, e.target.value)}
                                        className="w-full text-center italic text-xs font-courier bg-transparent border-b border-dashed border-ink-black/10 focus:border-ink-black/30 outline-none py-1"
                                        placeholder="Ajouter une légende..."
                                    />
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-4 ml-8 mb-4">
                        {!readOnly && (
                            <button
                                onClick={() => triggerUpload(si)}
                                className="text-[10px] font-courier uppercase tracking-wider opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1 py-1 border border-dashed border-ink-black/20 px-2"
                            >
                                <Upload size={12} /> Ajouter Photo
                            </button>
                        )}
                    </div>

                    {/* Sub-sections: "a. Ennemis" */}
                    {section.subs.map((sub, subI) => (
                        <div key={sub.id} id={`sub-${sub.id}`} className="ml-8 mb-2">
                            <div className="flex items-center gap-2 print:break-after-avoid">
                                <span className="font-bold font-typewriter min-w-[1.5rem] opacity-70">
                                    {ALPHA[subI] || '?'}.
                                </span>
                                {readOnly ? (
                                    <span className="font-bold text-sm uppercase tracking-wide">{sub.title}</span>
                                ) : (
                                    <input
                                        value={sub.title}
                                        onChange={(e) => updateSub(si, subI, 'title', e.target.value)}
                                        className="font-bold text-sm uppercase tracking-wide bg-transparent border-b border-ink-black/20 focus:border-ink-black outline-none flex-1 font-typewriter py-0.5 px-1"
                                        placeholder="Titre de sous-section..."
                                    />
                                )}
                                {!readOnly && (
                                    <button
                                        onClick={() => removeSub(si, subI)}
                                        className="text-red-800/40 hover:text-red-800 transition-colors p-0.5"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                            {/* Content textarea */}
                            {readOnly ? (
                                <p className="ml-8 text-sm font-courier whitespace-pre-wrap opacity-80 leading-relaxed -mt-1">
                                    {sub.content || '—'}
                                </p>
                            ) : (
                                <textarea
                                    value={sub.content}
                                    onChange={(e) => updateSub(si, subI, 'content', e.target.value)}
                                    rows={2}
                                    className="ml-8 w-[calc(100%-2rem)] text-sm font-courier bg-transparent border border-ink-black/10 focus:border-ink-black/40 outline-none resize-y py-1 px-2 leading-relaxed placeholder:opacity-30 -mt-1"
                                    placeholder="Contenu détaillé..."
                                />
                            )}

                            {/* Subsection Images */}
                            {sub.images?.map((img, imgIdx) => (
                                <div key={imgIdx} className="relative mt-2 mb-4 group ml-8 print-avoid-break">
                                    <img src={img.url} alt={`Subsection visual ${imgIdx + 1}`} className="w-full h-auto border border-ink-black/10 shadow-sm" />
                                    {!readOnly && (
                                        <button
                                            onClick={() => removeImage(si, imgIdx, subI)}
                                            className="absolute top-2 right-2 bg-red-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                    <div className="mt-2 text-center">
                                        {readOnly ? (
                                            <p className="italic text-[10px] font-courier opacity-60 px-4">
                                                {img.caption || 'Description image...'}
                                            </p>
                                        ) : (
                                            <input
                                                value={img.caption || ''}
                                                onChange={(e) => updateSubImageCaption(si, subI, imgIdx, e.target.value)}
                                                className="w-full text-center italic text-[10px] font-courier bg-transparent border-b border-dashed border-ink-black/10 focus:border-ink-black/30 outline-none py-0.5"
                                                placeholder="Légende photo..."
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}

                            {!readOnly && (
                                <button
                                    onClick={() => triggerUpload(si, subI)}
                                    className="ml-8 mt-1 text-[10px] font-courier uppercase tracking-wider opacity-30 hover:opacity-100 transition-opacity flex items-center gap-1 py-1 px-2 border border-dashed border-ink-black/10"
                                >
                                    <Paperclip size={10} /> Ajouter Photo
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add sub-section button */}
                    {!readOnly && (
                        <button
                            onClick={() => addSub(si)}
                            className="ml-8 text-xs font-courier uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1 py-1"
                        >
                            <Plus size={12} /> Ajouter sous-section
                        </button>
                    )}
                </div>
            ))}

            {/* Add section button */}
            {!readOnly && (
                <button
                    onClick={addSection}
                    className="mt-4 text-sm font-courier uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 border border-dashed border-ink-black/30 px-4 py-2 hover:border-ink-black/60"
                >
                    <Plus size={16} /> Ajouter section
                </button>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            {isProcessing && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-wood-desk p-6 border-2 border-white/20 shadow-2xl text-paper-base font-courier animate-pulse">
                        TRAITEMENT DE L'IMAGE...
                    </div>
                </div>
            )}
        </div>
    );
};
