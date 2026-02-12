import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMissionStore } from '../../store/missionStore';
import { PaperSheet } from '../ui/PaperSheet';
import { TypewriterInput } from '../ui/TypewriterInput';
import { Stamp } from '../ui/Stamp';
import { SectionEditor } from './SectionEditor';
import { PrintControls } from '../export/PrintControls';
import { BriefingSidebar } from './BriefingSidebar';
import { Pencil } from 'lucide-react';

export function MissionViewer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // In a real app with Supabase, we would fetch the mission by ID here.
    // For now, we use the store.
    const { missions } = useMissionStore();
    const mission = missions.find(m => m.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!mission) {
        return (
            <div className="min-h-screen bg-wood-desk flex items-center justify-center">
                <div className="text-paper-base text-center font-courier">
                    <p className="mb-4">ARCHIVE INTROUVABLE...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-wood-desk p-8 flex flex-col items-center overflow-auto relative pb-32">

            {/* Interactive Sidebar TOC */}
            <BriefingSidebar sections={mission.sections || []} missionTitle={mission.title} />

            {/* Read Only Header */}
            <div className="fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-md text-paper-base p-2 flex justify-between items-center px-8 z-50 print:hidden border-b border-white/10">
                <div className="text-xs font-courier opacity-60">ARCHIVE NUMÉRIQUE // LECTURE SEULE</div>
                <button
                    onClick={() => navigate(`/mission/${mission.id}`)}
                    className="flex items-center gap-2 text-xs font-courier bg-paper-base/10 hover:bg-paper-base/20 transition-colors px-3 py-1 rounded-sm border border-white/10"
                >
                    <Pencil size={12} /> RETOUR À L'ÉDITION
                </button>
            </div>

            {/* PRINT-ONLY ELEMENTS (Repeated on every page) */}
            <div className="hidden print:block">
                <div className="page-header font-courier text-ink-black/40">
                    DOCUMENT CONFIDENTIEL - 13ème RFV
                </div>
                <div className="page-footer font-courier text-ink-black/40 px-2">
                    <span>MISSION : {mission.title}</span>
                </div>
                <img src="/logo.jpeg" alt="" className="logo-print-corner object-contain" />
            </div>

            <PaperSheet className="mt-12">
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold mb-2 tracking-tighter decoration-4 underline decoration-ink-black/20">ORDRE DE MISSION</h1>
                        <span className="font-courier text-sm tracking-[0.2em] opacity-70">TOP SECRET // EYES ONLY // 13ème RFV</span>
                    </div>
                    <div className="border-2 border-dashed border-ink-black/30 p-2 w-[120px] h-[120px] flex items-center justify-center bg-gray-100/10 grayscale opacity-80 overflow-hidden">
                        <img src="/logo.jpeg" alt="13ème RFV Logo" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-12 print-avoid-break">
                    <TypewriterInput label="NOM DE CODE" value={mission.title} readOnly className="font-bold" />
                    <TypewriterInput label="MATRICULE" value={mission.title} readOnly className="opacity-70 font-mono text-sm" />
                    <TypewriterInput label="DATE" value={mission.meta.date} readOnly />
                    <TypewriterInput label="HEURE" value={mission.meta.time} readOnly />
                    <TypewriterInput label="LIEU" value={mission.meta.location} readOnly />
                    <TypewriterInput label="MÉTÉO" value={mission.meta.weather} readOnly className="text-sm font-mono" />
                </div>

                {/* Numbered Sections (Corps du Briefing) */}
                <SectionEditor
                    sections={mission.sections || []}
                    onChange={() => { }}
                    readOnly
                />

                <div className="mb-12 print-avoid-break">
                    <h2 className="text-xl font-bold border-b-2 border-ink-black mb-6 pb-2 uppercase tracking-wide">Briefing Tactique</h2>
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <TypewriterInput label="FORCES ALLIÉES" value={mission.tactical.allies} readOnly />
                        <TypewriterInput label="ROE" value={mission.tactical.roe} readOnly className="text-red-900/80" />
                    </div>
                </div>



                {/* Tables (Using a simplified read-only view) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 print-avoid-break">
                    <div>
                        <h3 className="font-bold uppercase tracking-wide text-lg border-b-2 border-ink-black mb-2">Coordonnées</h3>
                        {mission.coords.map(c => (
                            <div key={c.id} className="flex justify-between border-b border-ink-black/10 py-1 font-typewriter text-sm">
                                <span>{c.name}</span> <span className="font-mono">{c.mgrs}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 className="font-bold uppercase tracking-wide text-lg border-b-2 border-ink-black mb-2">Fréquences</h3>
                        {mission.freqs.map(f => (
                            <div key={f.id} className="flex justify-between border-b border-ink-black/10 py-1 font-typewriter text-sm">
                                <span>{f.unit}</span> <span className="font-mono">{f.mhz} MHz</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Stamps */}
                <div className="absolute bottom-32 right-20 pointer-events-none opacity-90">
                    <Stamp label={mission.status === 'approved' ? 'APPROVED' : 'DRAFT'} rotation={-12} color={mission.status === 'approved' ? 'red' : 'black'} />
                </div>

                <div className="absolute top-10 right-10 opacity-30 pointer-events-none">
                    <span className="font-typewriter text-6xl font-black text-red-900 rotate-[25deg] border-4 border-red-900 p-4 border-double">CLASSIFIÉ</span>
                </div>
            </PaperSheet>

            <PrintControls onPrint={() => window.print()} />
        </div>
    );
}
