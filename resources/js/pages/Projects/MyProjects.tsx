import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Book, ExternalLink, Pencil, Plus, Trash2, UserCircle } from 'lucide-react';
import { useState } from 'react';

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
    created_at: string;
    thumbnail_url: string | null;
}

interface MyProjectsProps extends InertiaPageProps {
    projects: {
        data: Project[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
    hasEngineerProfile: boolean;
}

export default function MyProjects({ projects, hasEngineerProfile }: MyProjectsProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const confirmDelete = (project: Project) => {
        setProjectToDelete(project);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!projectToDelete) return;
        
        // Submit form to delete project
        const form = document.getElementById('delete-form') as HTMLFormElement;
        if (form) form.submit();
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Home', href: '/' },
                { title: 'Projects', href: '/projects' },
                { title: 'My Projects', href: '/my-projects' },
            ]}
        >
            <Head title="My Projects" />

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Projects</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage your AI projects and showcase them to the community
                        </p>
                    </div>

                    {hasEngineerProfile ? (
                        <Link href="/projects/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Project
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/my-engineer-profile/create">
                            <Button>
                                <UserCircle className="mr-2 h-4 w-4" />
                                Create Engineer Profile
                            </Button>
                        </Link>
                    )}
                </div>
                
                {!hasEngineerProfile && (
                    <Alert className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>Engineer Profile Required</AlertTitle>
                        <AlertDescription>
                            You need to create an engineer profile before you can add projects.
                            Your engineer profile allows you to showcase your skills and expertise.
                        </AlertDescription>
                    </Alert>
                )}

                {projects.data && projects.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.data.map((project) => (
                            <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md border-border/60 hover:border-border">

                                {project.thumbnail_url && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img 
                                            src={project.thumbnail_url} 
                                            alt={project.name} 
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle>{project.name}</CardTitle>
                                    <CardDescription>{project.short_description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="px-2.5 py-1 font-medium text-xs bg-primary/10 hover:bg-primary/15 text-primary border-primary/20">
                                            {project.category.name}
                                        </Badge>
                                        {project.tags && project.tags.slice(0, 3).map((tag) => (
                                            <Badge 
                                                key={tag.id}
                                                variant="outline"
                                                className="px-2.5 py-1 font-normal text-xs border-muted-foreground/30 hover:bg-muted/50"
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div className="flex space-x-2">
                                        <Link href={`/projects/${project.id}/edit`}>
                                            <Button variant="ghost" size="sm" className="hover:bg-muted hover:text-foreground">
                                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => confirmDelete(project)}>
                                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                            Delete
                                        </Button>
                                    </div>
                                    <Link href={`/projects/${project.slug}`}>
                                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                                            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                            View
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-dashed bg-muted/10">
                        <CardHeader className="flex flex-col items-center pb-2 text-center">
                            <div className="mb-2 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <Book className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <CardTitle>No Projects Found</CardTitle>
                            <CardDescription>You haven't created any projects yet.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pb-6">
                            <p className="mb-4 text-center text-muted-foreground max-w-md">
                                Share your AI projects with the community by creating your first project.
                            </p>
                            {hasEngineerProfile ? (
                                <Link href="/projects/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Project
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/my-engineer-profile/create">
                                    <Button>
                                        <UserCircle className="mr-2 h-4 w-4" />
                                        Create Engineer Profile First
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {projects.meta && projects.meta.last_page > 1 && projects.links && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-1">
                            {projects.links.map((link, i: number) => {
                                if (!link || link.url === null) return null;
                                
                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                    <form id="delete-form" method="POST" action={`/projects/${projectToDelete?.id}`} className="hidden">
                        <input type="hidden" name="_method" value="DELETE" />
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
