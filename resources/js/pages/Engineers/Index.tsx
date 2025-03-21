import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Search, Github, Linkedin, Twitter } from 'lucide-react';
// We'll use a simple div with overflow for now instead of ScrollArea
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Skill {
  id: number;
  name: string;
  slug: string;
}

interface Location {
  id: number;
  name: string;
  slug: string;
}

interface Project {
  id: number;
  name: string;
  slug: string;
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
  skills?: string[];
  projects_count: number;
  featured_projects?: Project[];
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

interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface Pagination<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

interface IndexProps {
  engineers: Pagination<Engineer>;
  skills: Skill[];
  locations: Location[];
  filters: {
    search?: string;
    skills?: string[];
    location?: string;
    openToWork?: boolean;
    sort?: string;
  };
  auth: {
    user: null | {
      id: number;
      name: string;
    };
  };
}

export default function Index({ 
  engineers = { 
    data: [], 
    links: { first: '', last: '', prev: null, next: null }, 
    meta: { 
      current_page: 1, 
      from: 1, 
      last_page: 1, 
      links: [], 
      path: '', 
      per_page: 10, 
      to: 1, 
      total: 0 
    } 
  },
  skills = [],
  locations = [],
  filters = {},
  auth = { user: null }
}: IndexProps) {
  const [search, setSearch] = useState(filters && filters.search ? filters.search : '');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set('search', search);
    window.location.href = url.toString();
  };
  
  const handleSortChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', value);
    window.location.href = url.toString();
  };
  
  const handleLocationChange = (slug: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('location', slug);
    window.location.href = url.toString();
  };
  
  const handleSkillToggle = (slug: string) => {
    const url = new URL(window.location.href);
    const currentSkills = url.searchParams.getAll('skills') || [];
    
    if (currentSkills.includes(slug)) {
      const newSkills = currentSkills.filter(skill => skill !== slug);
      url.searchParams.delete('skills');
      newSkills.forEach(skill => url.searchParams.append('skills', skill));
    } else {
      url.searchParams.append('skills', slug);
    }
    
    window.location.href = url.toString();
  };
  
  const handleOpenToWorkToggle = () => {
    const url = new URL(window.location.href);
    const currentValue = url.searchParams.get('openToWork');
    
    if (currentValue === 'true') {
      url.searchParams.delete('openToWork');
    } else {
      url.searchParams.set('openToWork', 'true');
    }
    
    window.location.href = url.toString();
  };
  
  const clearFilters = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('search');
    url.searchParams.delete('skills');
    url.searchParams.delete('location');
    url.searchParams.delete('openToWork');
    url.searchParams.delete('sort');
    window.location.href = url.toString();
  };

  const Layout = auth.user ? AppSidebarLayout : PublicLayout;
  
  const breadcrumbs = [
    { title: 'Engineers', href: '#' }
  ];
  
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Engineers</h1>
              <p className="text-muted-foreground">
                Connect with talented engineers building amazing AI projects
              </p>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search engineers by name, skills, or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10"
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    Search
                  </Button>
                </div>
              </form>
              
              <div className="flex gap-2">
                {/* Render the select only when we're sure filters is initialized */}
                {filters ? (
                  <Select
                    value={filters && filters.sort ? filters.sort : 'name'}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="projects">Most Projects</SelectItem>
                      <SelectItem value="recent">Recently Joined</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="w-[150px] h-10 bg-muted rounded-md animate-pulse"></div>
                )}
                
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Filter engineers by location, skills, and availability
                      </SheetDescription>
                    </SheetHeader>
                    <Separator className="my-4" />
                    <div className="h-[calc(100vh-200px)] overflow-y-auto">
                      <div className="space-y-6 pr-6">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Locations</h3>
                          <div className="space-y-2">
                            {Array.isArray(locations) && locations.length > 0 ? locations.map(location => (
                              <div key={location.id} className="flex items-center">
                                <Checkbox
                                  id={`location-${location.id}`}
                                  checked={filters && filters.location ? filters.location === location.slug : false}
                                  onCheckedChange={() => handleLocationChange(location.slug)}
                                />
                                <Label
                                  htmlFor={`location-${location.id}`}
                                  className="ml-2 text-sm font-medium cursor-pointer"
                                >
                                  {location.name}
                                </Label>
                              </div>
                            )) : (
                              <div className="text-sm text-muted-foreground">No locations available</div>
                            )}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Skills</h3>
                          <div className="space-y-2">
                            {Array.isArray(skills) && skills.length > 0 ? skills.map(skill => (
                              <div key={skill.id} className="flex items-center">
                                <Checkbox
                                  id={`skill-${skill.id}`}
                                  checked={filters && filters.skills && Array.isArray(filters.skills) ? filters.skills.includes(skill.slug) : false}
                                  onCheckedChange={() => handleSkillToggle(skill.slug)}
                                />
                                <Label
                                  htmlFor={`skill-${skill.id}`}
                                  className="ml-2 text-sm font-medium cursor-pointer"
                                >
                                  {skill.name}
                                </Label>
                              </div>
                            )) : (
                              <div className="text-sm text-muted-foreground">No skills available</div>
                            )}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Availability</h3>
                          <div className="flex items-center">
                            <Checkbox
                              id="open-to-work"
                              checked={filters && filters.openToWork === true}
                              onCheckedChange={handleOpenToWorkToggle}
                            />
                            <Label
                              htmlFor="open-to-work"
                              className="ml-2 text-sm font-medium cursor-pointer"
                            >
                              Open to Work
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => setShowFilters(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {/* Active Filters */}
            {(filters.location || (filters.skills && filters.skills.length > 0) || filters.openToWork) && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium">Active Filters:</span>
                
                {filters.location && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {locations.find(l => l.slug === filters.location)?.name}
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.delete('location');
                        window.location.href = url.toString();
                      }}
                      className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Badge>
                )}
                
                {filters && filters.skills && Array.isArray(filters.skills) && filters.skills.map(skillSlug => {
                  const skill = Array.isArray(skills) ? skills.find(s => s.slug === skillSlug) : null;
                  return skill ? (
                    <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                      {skill.name}
                      <button
                        onClick={() => handleSkillToggle(skill.slug)}
                        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </Badge>
                  ) : null;
                })}
                
                {filters.openToWork && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Open to Work
                    <button
                      onClick={handleOpenToWorkToggle}
                      className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
          
          {/* Engineers Grid */}
          {engineers.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {engineers && engineers.data && Array.isArray(engineers.data) ? engineers.data.map(engineer => (
                <div key={engineer.id}>
                  <Card className="h-full overflow-hidden flex flex-col hover:shadow-md transition-all duration-200">
                    <div className="p-5 flex items-start justify-between border-b">
                      {/* Avatar and Name Section */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={engineer.user?.media_links?.avatar || engineer.avatar_url} alt={engineer.name} />
                          <AvatarFallback className="bg-primary-50 text-primary-700">{engineer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link 
                            href={`/engineers/${engineer.id}`}
                            className="font-medium hover:text-primary transition-colors text-base"
                          >
                            {engineer.name}
                          </Link>
                          {engineer.role && (
                            <p className="text-xs text-muted-foreground">{engineer.role}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Open to Work Badge */}
                      {engineer.is_open_to_work && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                          Open to Work
                        </Badge>
                      )}
                    </div>
                    
                    {/* Card Body - Fixed Height */}
                    <div className="p-5 flex-grow flex flex-col h-[220px]">
                      {/* Location & Social Links */}
                      <div className="flex justify-between items-center mb-4">
                        {engineer.location && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {engineer.location}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {engineer.github_url && (
                            <a 
                              href={engineer.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="h-3.5 w-3.5" />
                            </a>
                          )}
                          
                          {engineer.twitter_url && (
                            <a 
                              href={engineer.twitter_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Twitter className="h-3.5 w-3.5" />
                            </a>
                          )}
                          
                          {engineer.linkedin_url && (
                            <a 
                              href={engineer.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Linkedin className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* Bio with fixed height */}
                      <div className="min-h-[40px] mb-3">
                        {engineer.bio ? (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {engineer.bio}
                          </p>
                        ) : null}
                      </div>
                      
                      {/* Current Position - with fixed height placeholder */}
                      <div className="min-h-[20px] mb-3">
                        {engineer.experience && Array.isArray(engineer.experience) && engineer.experience.length > 0 && (
                          engineer.experience
                            .filter(exp => exp && typeof exp === 'object' && exp.current === true)
                            .slice(0, 1)
                            .map((currentJob, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <span className="mr-2 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span className="font-medium">{currentJob.title}</span>
                                <span className="mx-1 text-muted-foreground">at</span>
                                <span className="text-muted-foreground">{currentJob.company}</span>
                              </div>
                          ))
                        )}
                      </div>
                      
                      {/* Skills */}
                      <div className="min-h-[50px] mb-auto">
                        {engineer.skills && engineer.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {engineer.skills.slice(0, 4).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {engineer.skills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{engineer.skills.length - 4}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Project Thumbnails - Only display if there are featured projects */}
                      {engineer.featured_projects && engineer.featured_projects.length > 0 && (
                        <div className="w-full grid grid-cols-3 gap-2 mt-3">
                          {engineer.featured_projects.slice(0, 3).map(project => (
                            <Link
                              key={project.id}
                              href={`/projects/${project.slug}`}
                              className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img 
                                src={project.thumbnail_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.name)}&background=random`} 
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Card Footer */}
                    <div className="p-5 border-t mt-auto">
                      <Link href={`/engineers/${engineer.id}`} className="w-full">
                        <Button className="w-full" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              )) : null}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-medium mb-2">No engineers found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </CardContent>
            </Card>
          )}
          
          {/* Pagination */}
          {engineers && engineers.meta && engineers.meta.last_page > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!engineers || !engineers.links || !engineers.links.prev}
                  onClick={() => {
                    if (engineers && engineers.links && engineers.links.prev) {
                      window.location.href = engineers.links.prev;
                    }
                  }}
                >
                  Previous
                </Button>
                <div className="flex items-center mx-2">
                  <span className="text-sm text-muted-foreground">
                    Page {engineers && engineers.meta ? engineers.meta.current_page : 1} of {engineers && engineers.meta ? engineers.meta.last_page : 1}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!engineers || !engineers.links || !engineers.links.next}
                  onClick={() => {
                    if (engineers && engineers.links && engineers.links.next) {
                      window.location.href = engineers.links.next;
                    }
                  }}
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
