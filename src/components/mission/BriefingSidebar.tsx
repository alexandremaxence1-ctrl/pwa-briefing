import React, { useEffect, useState } from 'react';
import type { Section } from '../../store/missionStore';
import { List } from 'lucide-react';

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

interface BriefingSidebarProps {
    sections: Section[];
    missionTitle: string;
}

export const BriefingSidebar: React.FC<BriefingSidebarProps> = ({ sections, missionTitle }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [collapsed, setCollapsed] = useState(false);

    // Track which section is in view
    useEffect(() => {
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Find the first visible section
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id')?.replace('section-', '') || null;
                        setActiveId(id);
                        break;
                    }
                }
            },
            { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
        );

        // Observe all section elements
        for (const section of sections) {
            const el = document.getElementById(`section-${section.id}`);
            if (el) observer.observe(el);
        }

        return () => observer.disconnect();
    }, [sections]);

    const scrollTo = (elementId: string) => {
        const el = document.getElementById(elementId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (sections.length === 0) return null;

    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 print:hidden">
            <div
                className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-sm transition-all duration-300 overflow-hidden ${collapsed ? 'w-10' : 'w-52'
                    }`}
            >
                {/* Toggle button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-paper-base/70 hover:text-paper-base transition-colors border-b border-white/10"
                    title={collapsed ? 'Ouvrir le sommaire' : 'Réduire'}
                >
                    <List size={14} className="shrink-0" />
                    {!collapsed && (
                        <span className="text-[10px] font-courier uppercase tracking-widest truncate">
                            Sommaire
                        </span>
                    )}
                </button>

                {/* Content */}
                {!collapsed && (
                    <div className="px-2 py-2">
                        {/* Mission title */}
                        <div className="text-[9px] font-courier text-paper-base/40 uppercase tracking-wider mb-2 px-1 truncate">
                            {missionTitle}
                        </div>

                        {/* Section links */}
                        <nav className="flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto pr-1">
                            {sections.map((section, si) => {
                                const isActive = activeId === section.id;
                                const sectionNum = si + 1;
                                return (
                                    <React.Fragment key={section.id}>
                                        <button
                                            onClick={() => scrollTo(`section-${section.id}`)}
                                            className={`text-left px-2 py-1.5 rounded-sm text-[11px] font-courier uppercase tracking-wider transition-all duration-200 flex items-center gap-2 group ${isActive
                                                ? 'bg-paper-base/15 text-paper-base'
                                                : 'text-paper-base/50 hover:text-paper-base/80 hover:bg-white/5'
                                                }`}
                                        >
                                            <span
                                                className={`transition-all duration-200 ${isActive ? 'text-red-400' : 'text-paper-base/30'
                                                    }`}
                                            >
                                                {isActive ? '▶' : '·'}
                                            </span>
                                            <span className="truncate">
                                                {sectionNum}. {section.title}
                                            </span>
                                        </button>

                                        {/* Subsections */}
                                        {section.subs.map((sub, subI) => (
                                            <button
                                                key={sub.id}
                                                onClick={() => scrollTo(`sub-${sub.id}`)}
                                                className="text-left ml-5 px-2 py-0.5 rounded-sm text-[9px] font-courier uppercase tracking-tight text-paper-base/40 hover:text-paper-base/70 hover:bg-white/5 transition-all duration-200 truncate"
                                            >
                                                {sectionNum}.{ALPHA[subI] || '?'}. {sub.title || 'Sans titre'}
                                            </button>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </nav>

                        {/* Extra fixed anchors */}
                        <div className="border-t border-white/10 mt-2 pt-2">
                            <button
                                onClick={() => {
                                    const el = document.querySelector('[class*="Briefing Tactique"]') ||
                                        document.querySelector('h2');
                                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className="text-left w-full px-2 py-1 text-[10px] font-courier text-paper-base/30 hover:text-paper-base/60 uppercase tracking-wider transition-colors"
                            >
                                · Tactique
                            </button>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-left w-full px-2 py-1 text-[10px] font-courier text-paper-base/30 hover:text-paper-base/60 uppercase tracking-wider transition-colors"
                            >
                                ↑ Haut
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
