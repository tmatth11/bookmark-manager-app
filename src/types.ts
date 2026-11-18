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

export type AddBookmarkState = {
    errors?: {
        pageUrl?: string[];
        title?: string[];
        description?: string[];
        tags?: string[];
    };
    errorMessage?: string;
} | null;

export interface Tag {
    id: string;
    name: string;
    count: number;
}

export interface Bookmark {
    id: string;
    createdAt: string;
    pageUrl: string;
    title: string;
    description: string | null;
    iconUrl: string;
    visitedAt: string | null;
    visits: number;
    isPinned: boolean;
    tags: {
        id: string;
        name: string;
    }[];
}
