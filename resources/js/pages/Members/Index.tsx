import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { Search, CircleSlash, Code } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Badge } from '@/components/ui/badge';

interface Member {
    id: number;
    name: string;
    email: string;
    created_at: string;
    stars_count: number;
    sent_messages_count: number;
    received_messages_count: number;
    avatar?: string;
    media_links?: {
        avatar?: string;
    };
    bio?: string;
    is_engineer?: boolean;
    location?: string;
    specialties?: string[];
}

interface MembersPageProps extends InertiaPageProps {
    members: {
        data: Member[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
    filters: {
        search?: string;
        sort?: string;
        direction?: string;
    };
}

export default function MembersIndex({ members, filters }: MembersPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const getInitials = useInitials();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        
        if (searchQuery) {
            url.searchParams.set('search', searchQuery);
        } else {
            url.searchParams.delete('search');
        }
        
        window.location.href = url.toString();
    };

    return (
        <AppLayout

            breadcrumbs={[
                { title: 'Home', href: '/' },
                { title: 'Members', href: '/members' },
            ]}
        >
            <Head title="Community Members" />

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community Members</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Connect with members of the BuiltWithAI community
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon">
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Search</span>
                        </Button>
                    </form>
                </div>

                {members.data && members.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {members.data.map((member) => (
                            <div key={member.id} className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex items-center">
                                        <Avatar className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                                            <AvatarImage src={member.media_links?.avatar || member.avatar} alt={member.name} />
                                            <AvatarFallback className="bg-primary-100 text-primary-600 dark:bg-gray-800 dark:text-white">
                                                {getInitials(member.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <Link href={`/members/${member.id}`} className="hover:underline">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                                            </Link>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {member.location || `Member since ${new Date(member.created_at).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    </div>
                                    {member.is_engineer && (
                                        <Badge variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                                            <Code className="h-3 w-3" />
                                            <span>Engineer</span>
                                        </Badge>
                                    )}
                                </div>
                                
                                {member.bio && (
                                    <p className="mb-4 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                                        {member.bio}
                                    </p>
                                )}
                                
                                {member.specialties && member.specialties.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-1">
                                        {member.specialties.slice(0, 3).map((specialty, index) => (
                                            <span 
                                                key={index} 
                                                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                {specialty}
                                            </span>
                                        ))}
                                        {member.specialties.length > 3 && (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                +{member.specialties.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="mt-auto flex items-center gap-2">
                                    <Button asChild variant="outline" className="flex-1" size="sm">
                                        <Link href={`/members/${member.id}`}>View Profile</Link>
                                    </Button>
                                    <Button asChild size="sm" className="flex-1">
                                        <Link href={`/messages/new?recipient=${member.id}`}>Message</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                        <CircleSlash className="mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No members found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {filters.search
                                ? `No members matching "${filters.search}"`
                                : 'There are no members to display'}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {members.meta && members.meta.last_page > 1 && members.links && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {members.links.map((link, i: number) => {
                                if (!link || link.url === null) return null;
                                
                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`inline-flex h-10 w-10 items-center justify-center rounded-md border ${
                                            link.active
                                                ? 'border-primary-600 bg-primary-50 text-primary-600 dark:border-primary-400 dark:bg-gray-800 dark:text-primary-400'
                                                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
