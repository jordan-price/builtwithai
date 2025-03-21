import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    engineer?: Engineer;
    media_links?: {
        avatar?: string;
    };
    [key: string]: unknown; // This allows for additional properties...
}

export interface Engineer {
    id: number;
    user_id: number;
    // name now comes from the User model via a dynamic accessor
    role?: string;
    company?: string;
    bio?: string;
    location?: string;
    github_username?: string;
    twitter_username?: string;
    linkedin_url?: string;
    personal_website?: string;
    public_email?: string;
    contact_preferences?: string[];
    is_open_to_work?: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
}
