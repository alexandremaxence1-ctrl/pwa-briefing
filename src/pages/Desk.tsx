import { useEffect } from 'react';
import { useMissionStore } from '../store/missionStore';
import { FolderItem } from '../components/folder/FolderItem';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function Desk() {
    const { missions, addMission, fetchMissions, deleteMission } = useMissionStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMissions();
    }, [fetchMissions]);

    const handleCreateNew = () => {
        const newId = crypto.randomUUID();

        // Auto-increment: find the highest number for this year
        const year = new Date().getFullYear();
        const prefix = `RFV-${year}-`;
        let maxNum = 0;
        for (const m of missions) {
            if (m.title.startsWith(prefix)) {
                const num = parseInt(m.title.replace(prefix, ''), 10);
                if (!isNaN(num) && num > maxNum) maxNum = num;
            }
        }
        const visualId = `${prefix}${String(maxNum + 1).padStart(2, '0')}`;

        addMission({
            id: newId,
            title: visualId,
            meta: { date: new Date().toLocaleDateString(), time: '0000Z', location: '---', weather: '---' },
            tactical: { allies: '', roe: '' },
            sections: [
                {
                    id: crypto.randomUUID(),
                    title: 'SITUATION',
                    subs: [
                        { id: crypto.randomUUID(), title: 'Forces ennemies', content: '' },
                        { id: crypto.randomUUID(), title: 'Forces amies', content: '' },
                        { id: crypto.randomUUID(), title: 'Météo / Terrain', content: '' },
                    ],
                },
                {
                    id: crypto.randomUUID(),
                    title: 'MISSION',
                    subs: [
                        { id: crypto.randomUUID(), title: 'Objectif principal', content: '' },
                        { id: crypto.randomUUID(), title: 'Effets à obtenir', content: '' },
                    ],
                },
                {
                    id: crypto.randomUUID(),
                    title: 'EXÉCUTION',
                    subs: [
                        { id: crypto.randomUUID(), title: 'Concept de manœuvre', content: '' },
                        { id: crypto.randomUUID(), title: 'Missions subordonnées', content: '' },
                        { id: crypto.randomUUID(), title: 'Instructions de coordination', content: '' },
                    ],
                },
            ],
            coords: [],
            freqs: [],
            images: [],
            status: 'draft'
        });
    };

    return (
        <div className="min-h-screen bg-wood-desk p-12 relative overflow-hidden text-ink-black select-none">
            {/* Desk texture overlay if needed */}
            <div className="absolute inset-0 bg-[#000000] opacity-20 pointer-events-none mix-blend-multiply" />

            {/* Lamp light effect */}
            <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[150%] bg-[radial-gradient(circle,rgba(255,250,220,0.1)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

            <header className="relative z-10 flex justify-between items-center mb-16 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-typewriter text-paper-base tracking-widest text-shadow-sm">BUREAU DE COMMANDEMENT</h1>
                    <p className="text-paper-base/60 font-courier text-sm">13ème RFV // ACCÈS RESTREINT</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Profile placeholder */}
                    <div className="w-12 h-12 rounded-full bg-paper-base/10 border border-paper-base/30 flex items-center justify-center font-bold text-paper-base">
                        Cdt
                    </div>
                </div>
            </header>

            <main className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                {/* New Folder Action */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateNew}
                    className="cursor-pointer w-64 h-48 border-2 border-dashed border-paper-base/30 rounded-lg flex flex-col items-center justify-center text-paper-base/50 hover:text-paper-base/80 hover:border-paper-base/60 transition-colors bg-black/10 backdrop-blur-sm"
                >
                    <Plus size={48} strokeWidth={1} />
                    <span className="mt-4 font-courier uppercase tracking-widest text-sm">Nouveau Dossier</span>
                </motion.div>

                {missions.map((mission) => (
                    <FolderItem
                        key={mission.id}
                        id={mission.id}
                        title={mission.title}
                        date={mission.meta.date}
                        status={mission.status}
                        onClick={() => navigate(`/mission/${mission.id}`)}
                        onDelete={() => deleteMission(mission.id)}
                    />
                ))}

            </main>

            <footer className="fixed bottom-4 right-6 text-paper-base/20 font-courier text-xs z-0 pointer-events-none">
                SECURE CONNECTION // TERMINAL 04
            </footer>
        </div>
    );
}
