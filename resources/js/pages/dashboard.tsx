import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Eye, BarChart3, Users, TrendingUp, Calendar, Sparkles } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface Project {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    thumbnail_url?: string;
    category: Category;
    tags: Tag[];
    views_count: number;
    created_at: string;
}

interface Engineer {
    id: number;
    name: string;
    role?: string;
    avatar_url?: string;
    user?: {
        name: string;
        email: string;
        media_links?: {
            avatar?: string;
        };
    };
}

interface UserStats {
    projectsCount: number;
    projectViews: number;
}

interface DashboardProps {
    recommendedProjects: Project[];
    trendingProjects: Project[];
    latestEngineers: Engineer[];
    userStats: UserStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ 
    recommendedProjects = [], 
    trendingProjects = [], 
    latestEngineers = [], 
    userStats = { projectsCount: 0, projectViews: 0 } 
}: DashboardProps) {
    // Dashboard component with user-specific data

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Stats Overview */}
                <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-bold">Your Overview</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Your Projects</p>
                                        <h3 className="mt-2 text-3xl font-bold">{userStats.projectsCount}</h3>
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                                        <BarChart3 className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/my-projects" className="text-sm font-medium text-primary hover:underline" preserveScroll preserveState>
                                        View all projects
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Project Views</p>
                                        <h3 className="mt-2 text-3xl font-bold">{userStats.projectViews}</h3>
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                                        <Eye className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Total views across all your projects
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">AI Engineers</p>
                                        <h3 className="mt-2 text-3xl font-bold">{latestEngineers.length}+</h3>
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                                        <Users className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/engineers" className="text-sm font-medium text-primary hover:underline" preserveScroll preserveState>
                                        Browse engineers
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Trending Projects</p>
                                        <h3 className="mt-2 text-3xl font-bold">{trendingProjects.length}+</h3>
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/projects" className="text-sm font-medium text-primary hover:underline" preserveScroll preserveState>
                                        Explore projects
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recommended Projects */}
                    <Card className="col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">Recommended for You</CardTitle>
                                <CardDescription>Projects you might be interested in</CardDescription>
                            </div>
                            <Sparkles className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recommendedProjects.length > 0 ? (
                                    recommendedProjects.map((project) => (
                                        <div key={project.id} className="flex items-start space-x-4">
                                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                                                {project.thumbnail_url ? (
                                                    <img
                                                        src={project.thumbnail_url}
                                                        alt={project.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                        <span className="text-xs text-gray-500">{project.name.charAt(0)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Link 
                                                    href={`/projects/${project.id}`}
                                                    className="font-medium text-foreground hover:underline"
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    {project.name}
                                                </Link>
                                                <p className="line-clamp-1 text-sm text-muted-foreground">
                                                    {project.short_description}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {project.category.name}
                                                    </Badge>
                                                    {project.tags.slice(0, 2).map((tag) => (
                                                        <Badge key={tag.id} variant="outline" className="text-xs">
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-dashed p-6 text-center">
                                        <p className="text-muted-foreground">No recommended projects yet</p>
                                        <Link href="/projects">
                                            <Button variant="link" className="mt-2" type="button">
                                                Browse all projects
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href="/projects" className="flex items-center text-sm font-medium text-primary hover:underline" preserveScroll preserveState>
                                View all projects <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Trending Projects */}
                    <Card className="col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">Trending Projects</CardTitle>
                                <CardDescription>Popular projects on the platform</CardDescription>
                            </div>
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {trendingProjects.length > 0 ? (
                                    trendingProjects.map((project) => (
                                        <div key={project.id} className="flex items-start space-x-4">
                                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                                                {project.thumbnail_url ? (
                                                    <img
                                                        src={project.thumbnail_url}
                                                        alt={project.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                        <span className="text-xs text-gray-500">{project.name.charAt(0)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between">
                                                    <Link 
                                                        href={`/projects/${project.id}`}
                                                        className="font-medium text-foreground hover:underline"
                                                        preserveScroll
                                                        preserveState
                                                    >
                                                        {project.name}
                                                    </Link>
                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                        <Eye className="mr-1 h-3 w-3" /> {project.views_count}
                                                    </div>
                                                </div>
                                                <p className="line-clamp-1 text-sm text-muted-foreground">
                                                    {project.short_description}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {project.category.name}
                                                    </Badge>
                                                    {project.tags.slice(0, 2).map((tag) => (
                                                        <Badge key={tag.id} variant="outline" className="text-xs">
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-dashed p-6 text-center">
                                        <p className="text-muted-foreground">No trending projects available</p>
                                        <Link href="/projects">
                                            <Button variant="link" className="mt-2" type="button">
                                                Browse all projects
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href="/projects" className="flex items-center text-sm font-medium text-primary hover:underline" preserveScroll preserveState>
                                View all projects <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardFooter>
                    </Card>
                </div>

                {/* Latest Engineers */}
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">New Engineers</CardTitle>
                                <CardDescription>Recently joined AI engineers</CardDescription>
                            </div>
                            <div>
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                            {latestEngineers.length > 0 ? (
                                latestEngineers.map((engineer) => (
                                    <Link href={`/engineers/${engineer.id}`} key={engineer.id} preserveScroll preserveState>
                                        <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center transition-all hover:border-primary/50 hover:shadow-sm">
                                            <div className="mb-3 h-16 w-16 overflow-hidden rounded-full">
                                                {engineer.avatar_url || engineer.user?.media_links?.avatar ? (
                                                    <img
                                                        src={engineer.avatar_url || engineer.user?.media_links?.avatar}
                                                        alt={engineer.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                                        <span className="text-lg font-medium">{engineer.name.charAt(0)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-medium text-foreground">{engineer.name}</h3>
                                            {engineer.role && (
                                                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{engineer.role}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full rounded-lg border border-dashed p-6 text-center">
                                    <p className="text-muted-foreground">No engineers available</p>
                                    <Link href="/engineers">
                                        <Button variant="link" className="mt-2">
                                            Browse all engineers
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href="/engineers" className="flex items-center text-sm font-medium text-primary hover:underline">
                            View all engineers <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
