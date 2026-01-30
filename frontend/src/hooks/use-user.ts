import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UserPreferences {
    user_id: string;
    ui_mode: 'BEGINNER' | 'PRO';
    layouts: {
        active_workspace: string;
        [key: string]: any;
    };
    theme: string;
}

export function useUser() {
    return useQuery({
        queryKey: ['user', 'preferences'],
        queryFn: async (): Promise<UserPreferences> => {
            const res = await fetch('/api/v1/user/preferences');
            if (!res.ok) throw new Error('Failed to fetch preferences');
            return res.json();
        },
        staleTime: 60000
    });
}
