import type { Profile, UserRole } from './supabase/types';

/**
 * Check if a profile has admin role
 */
export function isAdmin(profile: Profile | null | undefined): boolean {
    return profile?.role === 'adm';
}

/**
 * Check if a profile has user role
 */
export function isUser(profile: Profile | null | undefined): boolean {
    return profile?.role === 'user';
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserRole): string {
    switch (role) {
        case 'adm':
            return 'Administrador';
        case 'user':
            return 'Usuário';
        default:
            return 'Desconhecido';
    }
}
