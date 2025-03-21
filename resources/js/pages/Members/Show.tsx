import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Mail, Star, Briefcase, MapPin, Globe, Github, Twitter, Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

interface Project {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    category: {
        id: number;
        name: string;
    };
    tags: Array<{
        id: number;
        name: string;
    }>;
}

interface EngineerProfile {
    id: number;
    name: string;
    role: string;
    company: string;
    bio: string;
    location: string;
    avatar: string;
    github_username: string | null;
    twitter_username: string | null;
    linkedin_url: string | null;
    personal_website: string | null;
    public_email: string | null;
    is_open_to_work: boolean;
    user?: {
        name: string;
        email: string;
        media_links?: {
            avatar?: string;
        };
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    stars_count: number;
    avatar?: string;
    media_links?: {
        avatar?: string;
    };
}

interface MemberShowProps extends InertiaPageProps {
    member: User;
    starredProjects: Project[];
    engineerProfile: EngineerProfile | null;
}

export default function MemberShow({ member, starredProjects, engineerProfile }: MemberShowProps) {
    const getInitials = useInitials();
    const joinDate = new Date(member.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <AppLayout

            breadcrumbs={[
                { title: 'Home', href: '/' },
                { title: 'Members', href: '/members' },
                { title: member.name, href: `/members/${member.id}` },
            ]}
        >
            <Head title={`${member.name} - Community Member`} />

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Member Info Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="flex flex-col items-center text-center">
                                <Avatar className="mb-4 h-24 w-24 overflow-hidden rounded-full">
                                    <AvatarImage src={member.media_links?.avatar || member.avatar} alt={member.name} />
                                    <AvatarFallback className="bg-primary-100 text-primary-600 text-2xl dark:bg-gray-800 dark:text-white">
                                        {getInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-2xl">{member.name}</CardTitle>
                                <CardDescription className="flex items-center">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    Member since {joinDate}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Star className="mr-2 h-5 w-5 text-yellow-500" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {member.stars_count} {member.stars_count === 1 ? 'project' : 'projects'} starred
                                        </span>
                                    </div>

                                    {/* Only show contact button if authenticated */}
                                    {/* @ts-expect-error - window.auth is injected by Inertia */}
                                    {window.auth?.user && (
                                        <Button className="mt-4 w-full">
                                            <Mail className="mr-2 h-4 w-4" />
                                            Contact Member
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Engineer Profile Card - Only show if member has an engineer profile */}
                        {engineerProfile && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Engineer Profile</CardTitle>
                                    <CardDescription>Professional details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {engineerProfile.role && (
                                        <div className="flex items-start">
                                            <Briefcase className="mr-2 mt-0.5 h-5 w-5 text-gray-500" />
                                            <div>
                                                <h4 className="font-medium">Role</h4>
                                                <p className="text-gray-600 dark:text-gray-400">{engineerProfile.role}</p>
                                            </div>
                                        </div>
                                    )}

                                    {engineerProfile.company && (
                                        <div className="flex items-start">
                                            <Briefcase className="mr-2 mt-0.5 h-5 w-5 text-gray-500" />
                                            <div>
                                                <h4 className="font-medium">Company</h4>
                                                <p className="text-gray-600 dark:text-gray-400">{engineerProfile.company}</p>
                                            </div>
                                        </div>
                                    )}

                                    {engineerProfile.location && (
                                        <div className="flex items-start">
                                            <MapPin className="mr-2 mt-0.5 h-5 w-5 text-gray-500" />
                                            <div>
                                                <h4 className="font-medium">Location</h4>
                                                <p className="text-gray-600 dark:text-gray-400">{engineerProfile.location}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {engineerProfile.personal_website && (
                                            <a
                                                href={engineerProfile.personal_website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                            >
                                                <Globe className="mr-1 h-4 w-4" />
                                                Website
                                            </a>
                                        )}
                                        
                                        {engineerProfile.github_username && (
                                            <a
                                                href={`https://github.com/${engineerProfile.github_username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                            >
                                                <Github className="mr-1 h-4 w-4" />
                                                GitHub
                                            </a>
                                        )}
                                        
                                        {engineerProfile.twitter_username && (
                                            <a
                                                href={`https://twitter.com/${engineerProfile.twitter_username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                            >
                                                <Twitter className="mr-1 h-4 w-4" />
                                                Twitter
                                            </a>
                                        )}
                                        
                                        {engineerProfile.linkedin_url && (
                                            <a
                                                href={engineerProfile.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                            >
                                                <Linkedin className="mr-1 h-4 w-4" />
                                                LinkedIn
                                            </a>
                                        )}
                                    </div>
                                    
                                    <Link href={`/engineers/${engineerProfile.id}`}>
                                        <Button variant="outline" className="mt-2 w-full">
                                            View Full Engineer Profile
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {engineerProfile?.bio ? (
                                    <div dangerouslySetInnerHTML={{ __html: engineerProfile.bio }} />
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        This member hasn't added a bio yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Starred Projects */}
                        {starredProjects && starredProjects.length > 0 && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Starred Projects</CardTitle>
                                    <CardDescription>Projects that {member.name} has starred</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {starredProjects.map((project) => (
                                            <Link
                                                key={project.id}
                                                href={`/projects/${project.slug}`}
                                                className="block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                                            >
                                                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                    {project.name}
                                                </h3>
                                                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {project.short_description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-gray-800 dark:text-primary-400">
                                                        {project.category.name}
                                                    </span>
                                                    {project.tags && project.tags.slice(0, 3).map((tag) => (
                                                        <span 
                                                            key={tag.id}
                                                            className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Link>
                                        ))}

                                        {starredProjects && starredProjects.length >= 3 && (
                                            <div className="mt-4 text-center">
                                                <Button variant="outline">View All Starred Projects</Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
