import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMissionStore, type MissionData } from '../../store/missionStore';
import { PaperSheet } from '../ui/PaperSheet';
import { TypewriterInput } from '../ui/TypewriterInput';
import { Stamp } from '../ui/Stamp';
import { TacticalTable } from './TacticalTable';
import { SectionEditor } from './SectionEditor';
import { PrintControls } from '../export/PrintControls';
import { BriefingSidebar } from './BriefingSidebar';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { cn } from '../../utils/cn';

export function MissionEditor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { missions, updateMission } = useMissionStore();
    const mission = missions.find(m => m.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!mission) {
        return (
            <div className="min-h-screen bg-wood-desk flex items-center justify-center">
                <div className="text-paper-base text-center font-courier">
                    <p className="mb-4">DOSSIER INTROUVABLE...</p>
                    <button onClick={() => navigate('/')} className="underline hover:text-white">RETOUR AU BUREAU</button>
                </div>
            </div>
        );
    }

    const handleMetaChange = (key: keyof MissionData['meta'], value: string) => {
        updateMission(mission.id, { meta: { ...mission.meta, [key]: value } });
    };

    const handleTacticalChange = (key: keyof MissionData['tactical'], value: string) => {
        updateMission(mission.id, { tactical: { ...mission.tactical, [key]: value } });
    };

    // Coordinate handlers
    const addCoord = () => {
        const newCoord = { id: crypto.randomUUID(), name: '', mgrs: '' };
        updateMission(mission.id, { coords: [...mission.coords, newCoord] });
    };
    const removeCoord = (index: number) => {
        const newCoords = [...mission.coords];
        newCoords.splice(index, 1);
        updateMission(mission.id, { coords: newCoords });
    };
    const updateCoord = (index: number, key: keyof typeof mission.coords[0], value: string) => {
        const newCoords = [...mission.coords];
        newCoords[index] = { ...newCoords[index], [key]: value };
        updateMission(mission.id, { coords: newCoords });
    };

    // Frequency handlers
    const addFreq = () => {
        const newFreq = { id: crypto.randomUUID(), unit: '', mhz: '' };
        updateMission(mission.id, { freqs: [...mission.freqs, newFreq] });
    };
    const removeFreq = (index: number) => {
        const newFreqs = [...mission.freqs];
        newFreqs.splice(index, 1);
        updateMission(mission.id, { freqs: newFreqs });
    };
    const updateFreq = (index: number, key: keyof typeof mission.freqs[0], value: string) => {
        const newFreqs = [...mission.freqs];
        newFreqs[index] = { ...newFreqs[index], [key]: value };
        updateMission(mission.id, { freqs: newFreqs });
    };

    return (
        <div className="min-h-screen bg-wood-desk p-8 flex flex-col items-center overflow-auto relative pb-32">

            {/* Interactive Sidebar TOC */}
            <BriefingSidebar sections={mission.sections || []} missionTitle={mission.title} />

            {/* Navbar / Tools */}
            <div className="fixed top-6 left-6 z-50 flex gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="text-paper-base/60 hover:text-paper-base flex items-center gap-2 font-courier uppercase tracking-widest transition-colors backdrop-blur-md px-4 py-2 rounded-sm bg-black/20 border border-white/10 hover:bg-black/40"
                >
                    <ArrowLeft size={16} /> Fermer
                </button>
            </div>

            <div className="fixed top-6 right-6 z-50 flex gap-4">
                <button
                    onClick={() => navigate(`/view/${mission.id}`)}
                    className="text-paper-base/60 hover:text-paper-base flex items-center gap-2 font-courier uppercase tracking-widest transition-colors backdrop-blur-md px-4 py-2 rounded-sm bg-black/20 border border-white/10 hover:bg-black/40"
                >
                    <Eye size={16} /> Aperçu
                </button>
                <button
                    onClick={() => updateMission(mission.id, { status: mission.status === 'approved' ? 'draft' : 'approved' })}
                    className={cn(
                        "flex items-center gap-2 font-courier uppercase tracking-widest transition-colors backdrop-blur-md px-4 py-2 rounded-sm border hover:bg-black/40",
                        mission.status === 'approved'
                            ? "text-red-400 border-red-900/50 bg-red-900/20"
                            : "text-paper-base/60 border-white/10 bg-black/20"
                    )}
                >
                    <Save size={16} /> {mission.status === 'approved' ? 'APPROUVÉ' : 'BROUILLON'}
                </button>
            </div>

            <PaperSheet>
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
                <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-12">
                    <TypewriterInput
                        label="NOM DE CODE"
                        value={mission.title}
                        onChange={(e) => updateMission(mission.id, { title: e.target.value })}
                        className="font-bold"
                    />
                    <TypewriterInput
                        label="MATRICULE"
                        value={mission.title}
                        readOnly
                        className="opacity-70 font-mono text-sm"
                    />
                    <TypewriterInput
                        label="DATE (DD/MM/YYYY)"
                        value={mission.meta.date}
                        onChange={(e) => handleMetaChange('date', e.target.value)}
                    />
                    <TypewriterInput
                        label="HEURE (ZULU)"
                        value={mission.meta.time}
                        onChange={(e) => handleMetaChange('time', e.target.value)}
                    />
                    <TypewriterInput
                        label="LIEU / SECTEUR"
                        value={mission.meta.location}
                        onChange={(e) => handleMetaChange('location', e.target.value)}
                    />
                    <TypewriterInput
                        label="MÉTÉO (METAR)"
                        value={mission.meta.weather}
                        onChange={(e) => handleMetaChange('weather', e.target.value)}
                        className="text-sm font-mono"
                    />
                </div>

                {/* Numbered Sections (Corps du Briefing) */}
                <SectionEditor
                    sections={mission.sections || []}
                    onChange={(sections) => updateMission(mission.id, { sections })}
                />

                {/* Tactics */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold border-b-2 border-ink-black mb-6 pb-2 uppercase tracking-wide">Briefing Tactique</h2>

                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <TypewriterInput
                            label="FORCES ALLIÉES"
                            value={mission.tactical.allies}
                            onChange={(e) => handleTacticalChange('allies', e.target.value)}
                        />
                        <TypewriterInput
                            label="RÈGLES D'ENGAGEMENT (ROE)"
                            value={mission.tactical.roe}
                            onChange={(e) => handleTacticalChange('roe', e.target.value)}
                            className="text-red-900/80"
                        />
                    </div>
                </div>



                {/* Tables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <TacticalTable
                        title="Coordonnées"
                        columns={[
                            { key: 'name', label: 'Point', width: 'w-1/3' },
                            { key: 'mgrs', label: 'MGRS / LatLong', width: 'w-2/3' }
                        ]}
                        data={mission.coords}
                        onAdd={addCoord}
                        onRemove={removeCoord}
                        onChange={updateCoord}
                    />

                    <TacticalTable
                        title="Fréquences"
                        columns={[
                            { key: 'unit', label: 'Indicatif', width: 'w-1/2' },
                            { key: 'mhz', label: 'FREQ (MHz)', width: 'w-1/2' }
                        ]}
                        data={mission.freqs}
                        onAdd={addFreq}
                        onRemove={removeFreq}
                        onChange={updateFreq}
                    />
                </div>

                {/* Stamps */}
                {mission.status === 'approved' && (
                    <div className="absolute bottom-32 right-20 pointer-events-none opacity-90 animate-pulse">
                        <Stamp label="APPROVED" rotation={-12} />
                    </div>
                )}

                <div className="absolute top-10 right-10 opacity-30 pointer-events-none">
                    <span className="font-typewriter text-6xl font-black text-red-900 rotate-[25deg] border-4 border-red-900 p-4 border-double">CLASSIFIÉ</span>
                </div>
            </PaperSheet>

            <PrintControls onPrint={() => window.print()} />
        </div>
    );
}
