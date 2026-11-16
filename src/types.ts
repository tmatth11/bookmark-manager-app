export type Profile = {
        avatar_path: string | null;
        avatar_url?: string | null;
        created_at: string;
        id: string;
        updated_at: string;
        username: string;
};

export interface UpdateUsernameState {
    error?: string;
    success?: boolean;
}

export interface AddBookmarkState {
    errors?: {
        pageUrl?: string[];
        title?: string[];
        description?: string[];
        iconUrl?: string[];
        tags?: string[];
    },
    errorMessage?: string;
}