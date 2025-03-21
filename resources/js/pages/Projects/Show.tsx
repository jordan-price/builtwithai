import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, Eye, Share2, Github } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Engineer {
  id: number;
  name: string;
  slug: string;
  role?: string;
  avatar_url?: string;
}

interface Media {
  id: number;
  url: string;
  type: 'image' | 'video';
  thumbnail_url?: string;
}

interface Link {
  id: number;
  title: string;
  url: string;
  type: 'website' | 'github' | 'docs' | 'demo' | 'other';
}

interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  content: string;
  thumbnail_url?: string;
  logo_url?: string;
  stars_count: number;
  views_count: number;
  is_starred?: boolean;
  created_at: string;
  updated_at: string;
  category: Category;
  tags: Tag[];
  engineers: Engineer[];
  media: Media[];
  links: Link[];
  website_url?: string;
  github_url?: string;
  demo_url?: string;
  is_featured: boolean;
}

interface ShowProps {
  project: Project;
  related_projects: Project[];
  auth: {
    user: null | {
      id: number;
      name: string;
    };
  };
}

export default function Show({ project, related_projects, auth }: ShowProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const toggleStar = () => {
    if (!auth.user) {
      window.location.href = route('login');
      return;
    }
    
    // Using Inertia router to toggle star status
    router.post(route('projects.toggle-star', { project: project.id }), {}, {
      // Important: Preserving scroll but not preserving state to allow the component to re-render
      preserveState: false,
      preserveScroll: true,
      onSuccess: () => {
        // Temporary visual feedback until the page re-renders
        console.log('Star toggled successfully'); 
      },
      onError: (errors) => {
        console.error('Error toggling star:', errors);
      }
    });
  };
  
  // Get the share URL without domain duplication
  const shareUrl = typeof window !== 'undefined' 
    ? route('projects.show', project.slug, true) // The third parameter 'true' makes it absolute
    : '';
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const Layout = auth.user ? AppSidebarLayout : PublicLayout;
  
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Projects', href: route('projects.index') },
    { title: project.name, href: '#' }
  ];
  
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                {project.logo_url && (
                  <div className="mr-4">
                    <img 
                      src={project.logo_url} 
                      alt={`${project.name} logo`} 
                      className="w-16 h-16 object-contain rounded-md" 
                    />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="mr-2">
                      {project.category.name}
                    </Badge>
                    
                    {project.is_featured && (
                      <Badge variant="default" className="bg-amber-500 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold">
                    {project.name}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-sm mr-3">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{project.views_count}</span>
                  </div>
                  
                  <span className="text-muted-foreground mx-2">•</span>
                  
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{project.stars_count}</span>
                  </div>
                </div>
                
                {auth.user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleStar}
                    className="relative hover:border-yellow-200 transition-all duration-200"
                  >
                    <Star 
                      className={`w-4 h-4 mr-2 ${project.is_starred ? "text-yellow-500 fill-yellow-500" : ""} transition-all duration-200`} 
                      strokeWidth={2}
                    />
                    Star
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = route('login')}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Sign in to star
                  </Button>
                )}
                
                <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share this project</DialogTitle>
                      <DialogDescription>
                        Share this amazing AI project with others
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-muted p-2 rounded-md flex-1">
                          <code className="text-sm break-all">{shareUrl}</code>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => copyToClipboard(shareUrl)}
                          className="shrink-0"
                        >
                          Copy
                        </Button>
                      </div>
                      
                      <div className="flex justify-center space-x-4 mt-2">
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                          <a 
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing AI project: ${project.name}`)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                          <a 
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                          <a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <p className="mt-4 text-muted-foreground">{project.short_description || project.description.substring(0, 160) + '...'}</p>
            
            {project.tags && project.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex flex-wrap gap-2">
              {/* Direct links from the project model */}
              {project.website_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
              
              {project.github_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
              
              {project.demo_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              
              {/* Additional links from the links array */}
              {project.links && project.links.length > 0 && (
                project.links.map(link => {
                  // Skip links that are already covered by direct properties
                  if ((link.type === 'website' && project.website_url) ||
                      (link.type === 'github' && project.github_url) ||
                      (link.type === 'demo' && project.demo_url)) {
                    return null;
                  }
                  
                  const getLinkIcon = (type: string) => {
                    switch (type) {
                      case 'github':
                        return <Github className="w-4 h-4 mr-2" />;
                      case 'demo':
                        return <Eye className="w-4 h-4 mr-2" />;
                      default:
                        return <ExternalLink className="w-4 h-4 mr-2" />;
                    }
                  };
                  
                  return (
                    <Button key={link.id} variant="outline" size="sm" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {getLinkIcon(link.type)}
                        {link.title}
                      </a>
                    </Button>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column - Takes up 2/3 on large screens */}
            <div className="lg:col-span-2 space-y-8">
              {/* Media Gallery */}
              {project.thumbnail_url ? (
                <div className="w-full">
                  <div className="aspect-video w-full overflow-hidden rounded-xl border shadow-sm">
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : project.media && project.media.length > 0 ? (
                <div className="w-full">
                  <div className="aspect-video w-full overflow-hidden rounded-xl border shadow-sm">
                    {project.media[0].type === 'image' || !project.media[0].type ? (
                      <img 
                        src={project.media[0].url} 
                        alt={project.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <iframe
                        src={project.media[0].url}
                        title={project.name}
                        className="h-full w-full"
                        allowFullScreen
                      />
                    )}
                  </div>
                  
                  {project.media && project.media.length > 1 && (
                    <div className="mt-2 grid grid-cols-5 gap-2">
                      {project.media.slice(1, 6).map((media, index) => (
                        <div key={media.id} className="aspect-video overflow-hidden rounded-md border shadow-sm">
                          <img 
                            src={media.thumbnail_url || media.url} 
                            alt={`${project.name} media ${index + 2}`} 
                            className="h-full w-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
              
              {/* About Project Card */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">About this project</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    {/* Format the description with proper paragraph breaks */}
                    {project.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-sm leading-relaxed text-muted-foreground mb-4">{paragraph}</p>
                    ))}
                  </div>
                  {project.content && (
                    <div className="mt-6 prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: project.content }} />
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar - Takes up 1/4 on large screens */}
            <div className="space-y-6">
              {/* Engineers Card */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Engineers</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="space-y-4">
                    {project.engineers && Array.isArray(project.engineers) ? project.engineers.map(engineer => (
                      <Link
                        key={engineer.id}
                        href={engineer && engineer.slug ? route('engineers.show', engineer.slug) : '#'}
                        className="flex items-center space-x-3 hover:bg-muted p-2 rounded-md transition-colors"
                      >
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={engineer.avatar_url} alt={engineer.name} />
                          <AvatarFallback>{engineer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{engineer.name}</p>
                          {engineer.role && (
                            <p className="text-xs text-muted-foreground">{engineer.role}</p>
                          )}
                        </div>
                      </Link>
                    )) : <p className="text-sm text-muted-foreground">No engineers listed for this project.</p>}
                  </div>
                </CardContent>
              </Card>
              
              {/* Related Projects */}
              {related_projects && related_projects.length > 0 && (
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Related Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <div className="space-y-4">
                      {related_projects && Array.isArray(related_projects) ? related_projects.map(related => (
                        <Link
                          key={related.id}
                          href={related && related.slug ? route('projects.show', related.slug) : '#'}
                          className="flex items-start space-x-3 hover:bg-muted p-2 rounded-md transition-colors"
                        >
                          {related.thumbnail_url && (
                            <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border">
                              <img 
                                src={related.thumbnail_url} 
                                alt={related.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{related.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {related.short_description || related.description.substring(0, 80) + '...'}
                            </p>
                          </div>
                        </Link>
                      )) : <p className="text-sm text-muted-foreground">No related projects found.</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 border-t px-3 py-3">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                      <Link href={route('projects.index')}>
                        Discover More Projects
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
