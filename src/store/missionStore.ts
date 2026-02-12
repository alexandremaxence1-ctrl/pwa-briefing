import { create } from 'zustand';
import { supabase } from '../supabase';

export interface BriefingImage {
    url: string;
    caption?: string;
}

export interface SubSection {
    id: string;
    title: string;
    content: string;
    images?: BriefingImage[];
}

export interface Section {
    id: string;
    title: string;
    subs: SubSection[];
    images?: BriefingImage[];
}

export interface MissionData {
    id: string;
    title: string;
    meta: {
        date: string;
        time: string;
        location: string;
        weather: string;
    };
    tactical: {
        allies: string;
        roe: string;
    };
    sections: Section[];
    coords: Array<{ id: string; name: string; mgrs: string }>;
    freqs: Array<{ id: string; unit: string; mhz: string }>;
    status: 'draft' | 'approved' | 'archived';
}

interface MissionStore {
    missions: MissionData[];
    isLoading: boolean;
    error: string | null;
    fetchMissions: () => Promise<void>;
    addMission: (mission: MissionData) => Promise<void>;
    updateMission: (id: string, updates: Partial<MissionData>) => Promise<void>;
    deleteMission: (id: string) => Promise<void>;
}

export const useMissionStore = create<MissionStore>((set) => ({
    missions: [],
    isLoading: false,
    error: null,

    fetchMissions: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase
            .from('missions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching missions:', error);
            set({ error: error.message, isLoading: false });
        } else {
            set({ missions: data as MissionData[], isLoading: false });
        }
    },

    addMission: async (mission) => {
        // Optimistic update
        set((state) => ({ missions: [mission, ...state.missions] }));

        // Sync with DB
        const { error } = await supabase.from('missions').insert([mission]);
        if (error) {
            console.error('Error adding mission:', error);
        }
    },

    updateMission: async (id, updates) => {
        // Optimistic update
        set((state) => ({
            missions: state.missions.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));

        // Sync with DB
        const { error } = await supabase.from('missions').update(updates).eq('id', id);
        if (error) {
            console.error('Error updating mission:', error);
        }
    },

    deleteMission: async (id) => {
        console.log('[DELETE] Suppression demandée pour ID:', id);

        // Optimistic update
        set((state) => ({
            missions: state.missions.filter((m) => m.id !== id),
        }));

        // Sync with DB
        const { error, status, statusText } = await supabase.from('missions').delete().eq('id', id);
        if (error) {
            console.error('[DELETE] Erreur Supabase:', error.message, '| Code:', error.code, '| Status:', status, statusText);
        } else {
            console.log('[DELETE] Suppression réussie, status:', status);
        }
    },
}));
