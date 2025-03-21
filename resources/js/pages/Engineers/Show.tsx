import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, MapPin, Github, Twitter, Linkedin } from 'lucide-react';
// Using native textarea element instead of a custom component
// import { Textarea } from '@/components/ui/textarea';

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

interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: Category;
  tags: Tag[];
  thumbnail_url?: string;
}

interface Engineer {
  id: number;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  location?: string;
  is_open_to_work?: boolean;
  avatar_url?: string;
  github_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  projects?: Project[];
  skills?: string[];
  experience?: Array<{
    title: string;
    company: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description: string;
  }>;
  user?: {
    name: string;
    email: string;
    media_links?: {
      avatar?: string;
    };
  };
}

interface ContactForm extends Record<string, string> {
  subject: string;
  message: string;
}

interface ShowProps {
  engineer: Engineer;
  canContact: boolean;
  auth: {
    user: null | {
      id: number;
      name: string;
    };
  };
}

export default function Show({ engineer, canContact, auth }: ShowProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  
  const { data, setData, post, processing, reset, errors } = useForm<ContactForm>({
    subject: '',
    message: '',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('engineers.contact', engineer.id), {
      onSuccess: () => {
        reset();
        setShowContactForm(false);
      },
    });
  };

  const Layout = auth.user ? AppSidebarLayout : PublicLayout;
  
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Engineers', href: route('engineers.index') },
    { title: engineer.name, href: '#' }
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex items-center">
                  <img 
                    src={engineer.user?.media_links?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(engineer.name)}&background=random`} 
                    alt={engineer.name}
                    className="w-24 h-24 rounded-full object-cover mr-6" 
                  />
                  
                  <div>
                    <h1 className="text-3xl font-bold">
                      {engineer.name}
                    </h1>
                    
                    {engineer.role && (
                      <p className="text-lg text-muted-foreground">
                        {engineer.role}
                      </p>
                    )}
                    
                    {engineer.location && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="inline-flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {engineer.location}
                        </span>
                      </p>
                    )}
                    
                    {engineer.is_open_to_work && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mt-2">
                        Open to Work
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                  {engineer.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={engineer.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  
                  {engineer.twitter_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={engineer.twitter_url} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  
                  {engineer.linkedin_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={engineer.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  
                  {canContact && (
                    <Button 
                      size="sm" 
                      onClick={() => setShowContactForm(!showContactForm)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Bio */}
              {engineer.bio && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Bio</h2>
                  <p className="text-muted-foreground">{engineer.bio}</p>
                </div>
              )}
              
              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-6 bg-muted p-4 rounded-md">
                  <h2 className="text-lg font-semibold mb-4">Send a Message</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        value={data.subject}
                        onChange={e => setData('subject', e.target.value)}
                        required
                      />
                      {errors.subject && <p className="mt-1 text-sm text-destructive">{errors.subject}</p>}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={data.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('message', e.target.value)}
                        rows={4}
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowContactForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={processing}
                      >
                        {processing ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Projects Section */}
          <div className="space-y-6">
            <div className="mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">  
              <h2 className="text-xl font-bold">Projects</h2>
            </div>
            <h3 className="text-lg font-semibold mb-4">Projects by {engineer.name}</h3>
              
              {engineer.projects && engineer.projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {engineer.projects.map(project => (
                    <Card key={project.id}>
                      {project.thumbnail_url && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img 
                            src={project.thumbnail_url} 
                            alt={project.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <Badge variant="outline" className="w-fit mb-2">{project.category.name}</Badge>
                        <CardTitle className="leading-tight">
                          <Link href={route('projects.show', project.slug)}>
                            {project.name}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      </CardContent>
                      <CardFooter>
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map(tag => (
                              <Badge key={tag.id} variant="secondary" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                            {project.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    No projects found for this engineer.
                  </CardContent>
                </Card>
              )}
            
            <div className="mt-10 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold">Skills & Experience</h2>
            </div>
            <Card>
                <CardHeader>
                  <CardTitle>Skills & Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {engineer.skills && engineer.skills.length > 0 ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {engineer.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-6">No skills listed.</p>
                  )}
                  
                  {engineer.experience && engineer.experience.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Experience</h3>
                      <div className="space-y-6">
                        {engineer.experience.map((job, index) => (
                          <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                            <h4 className="text-base font-semibold">{job.title}</h4>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                              <div className="text-sm text-muted-foreground">
                                <span>{job.start_date}</span>
                                <span> — </span>
                                <span>{job.current ? 'Present' : job.end_date}</span>
                              </div>
                            </div>
                            <p className="mt-2 text-sm">{job.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
