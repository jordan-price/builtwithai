import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import PublicLayout from '@/layouts/public-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
// Pagination is implemented directly in the component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Star } from 'lucide-react';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface Engineer {
    id: number;
    name: string;
    slug: string;
    avatar_url?: string;
}

interface Project {
    id: number;
    name: string;
    slug: string;
    description: string;
    thumbnail_url?: string;
    stars_count: number;
    is_starred?: boolean;
    created_at: string;
    category: Category;
    tags: Tag[];
    engineers: Engineer[];
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
    projects: Pagination<Project>;
    categories: Category[];
    tags: Tag[];
    filters: {
        search?: string;
        category?: string;
        tags?: string[];
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
    projects = {
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
            total: 0,
        },
    },
    categories = [],
    tags = [],
    filters = {},
    auth = { user: null },
}: IndexProps) {
    // Initialize state with safe defaults, ensuring proper type handling
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>('latest');

    const { setData, get, processing } = useForm<{
        search: string;
        category: string | string[];
        tags: string | string[];
        sort: string;
    }>({
        search: filters && filters.search ? filters.search : '',
        category: filters && filters.category ? filters.category : '',
        tags: filters && filters.tags ? (Array.isArray(filters.tags) ? filters.tags : [filters.tags]) : [],
        sort: filters && filters.sort ? filters.sort : 'latest'
    });

    // Update form data when filters change
    // Initialize filters from props after component mounts - run only once at mount
    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            // Handle search
            if (typeof filters.search === 'string') {
                setSearch(filters.search);
            }
            
            // Handle category
            if (filters.category) {
                if (Array.isArray(filters.category)) {
                    setSelectedCategories(filters.category);
                } else if (typeof filters.category === 'string') {
                    setSelectedCategories([filters.category]);
                }
            }
            
            // Handle tags
            if (filters.tags) {
                if (Array.isArray(filters.tags)) {
                    setSelectedTags(filters.tags);
                } else if (typeof filters.tags === 'string') {
                    setSelectedTags([filters.tags]);
                }
            }
            
            // Handle sort
            if (typeof filters.sort === 'string') {
                setSortBy(filters.sort);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // Update form data when filters change
    useEffect(() => {
        const formData = {
            search: search || '',
            category: selectedCategories.length === 1 ? selectedCategories[0] : (selectedCategories.length > 1 ? selectedCategories : ''),
            tags: selectedTags,
            sort: sortBy || 'latest'
        };
        
        setData(formData);
    }, [search, selectedCategories, selectedTags, sortBy, setData]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        get(route('projects.index'));
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setData('sort', value);
        get(route('projects.index'));
    };

    const handleCategoryChange = (slug: string, checked: boolean) => {
        let newCategories: string[];
        
        if (checked) {
            newCategories = [...selectedCategories, slug];
        } else {
            newCategories = selectedCategories.filter(cat => cat !== slug);
        }
        
        setSelectedCategories(newCategories);
        // Don't call setData and get directly - we'll do that in the Apply button
    };

    const handleTagToggle = (slug: string, checked: boolean) => {
        let newTags: string[];
        
        if (checked) {
            newTags = [...selectedTags, slug];
        } else {
            newTags = selectedTags.filter(tag => tag !== slug);
        }
        
        setSelectedTags(newTags);
        // Don't call setData and get directly - we'll do that in the Apply button
    };

    const clearFilters = () => {
        // Reset all state variables
        setSearch('');
        setSelectedCategories([]);
        setSelectedTags([]);
        setSortBy('latest');
        
        // Reset form data and submit
        const resetFormData = {
            search: '',
            category: '',
            tags: [],
            sort: 'latest'
        };
        
        setData(resetFormData);
        get(route('projects.index'));
        setShowFilters(false); // Close the filter panel
    };

    const Layout = auth.user ? AppSidebarLayout : PublicLayout;

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Projects', href: '#' }];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 md:flex md:items-center md:justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold">Discover AI Projects</h1>
                            <p className="text-muted-foreground">Browse a curated collection of AI-powered projects from talented engineers</p>
                        </div>

                        {auth.user && (
                            <Button asChild className="mt-4 md:mt-0">
                                <Link href={route('projects.create')}>Submit Your Project</Link>
                            </Button>
                        )}
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full"
                                    />
                                    <Button type="submit" variant="ghost" size="sm" className="absolute top-1/2 right-2 -translate-y-1/2">
                                        Search
                                    </Button>
                                </div>
                            </form>

                            <div className="flex gap-2">
                                {/* Render the select only when we're sure filters is initialized */}
                                <Select value={sortBy || 'latest'} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue>
                                            {sortBy === 'latest' && 'Latest'}
                                            {sortBy === 'popular' && 'Most Popular'}
                                            {sortBy === 'name' && 'Name A-Z'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Latest</SelectItem>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="name">Name A-Z</SelectItem>
                                    </SelectContent>
                                </Select>


                                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="w-[400px] sm:max-w-md">
                                        <SheetHeader className="pb-4">
                                            <SheetTitle className="text-xl font-semibold">Filters</SheetTitle>
                                            <SheetDescription className="text-sm text-muted-foreground">
                                                Filter projects by category and tags
                                            </SheetDescription>
                                        </SheetHeader>
                                        <Separator />
                                        <div className="max-h-[calc(100vh-250px)] overflow-y-auto py-6">
                                            <div className="space-y-8">
                                                <div>
                                                    <h3 className="mb-3 text-base font-medium">Categories</h3>
                                                    <div className="space-y-3">
                                                        {Array.isArray(categories) && categories.length > 0 ? (
                                                            categories.map((category) => (
                                                                <div key={category.id} className="flex items-center space-x-3">
                                                                    <Checkbox
                                                                        id={`category-${category.id}`}
                                                                        checked={selectedCategories.includes(category.slug)}
                                                                        onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
                                                                        className="h-5 w-5 rounded-sm border-gray-300"
                                                                    />
                                                                    <Label
                                                                        htmlFor={`category-${category.id}`}
                                                                        className="cursor-pointer text-sm font-medium"
                                                                    >
                                                                        {category.name}
                                                                    </Label>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="rounded-md bg-gray-50 p-3 text-sm text-muted-foreground dark:bg-gray-800">No categories available</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <Separator className="my-1" />

                                                <div>
                                                    <h3 className="mb-3 text-base font-medium">Tags</h3>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {Array.isArray(tags) && tags.length > 0 ? (
                                                            tags.map((tag) => (
                                                                <div key={tag.id} className="flex items-center space-x-3">
                                                                    <Checkbox
                                                                        id={`tag-${tag.id}`}
                                                                        checked={selectedTags.includes(tag.slug)}
                                                                        onCheckedChange={(checked) => handleTagToggle(tag.slug, checked as boolean)}
                                                                        className="h-5 w-5 rounded-sm border-gray-300"
                                                                    />
                                                                    <Label
                                                                        htmlFor={`tag-${tag.id}`}
                                                                        className="cursor-pointer text-sm font-medium"
                                                                    >
                                                                        {tag.name}
                                                                    </Label>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="rounded-md bg-gray-50 p-3 text-sm text-muted-foreground dark:bg-gray-800">No tags available</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 space-y-3 pt-4 border-t">
                                            <Button variant="outline" className="w-full justify-center font-medium" onClick={clearFilters}>
                                                Clear Filters
                                            </Button>
                                            <Button 
                                                className="w-full justify-center font-medium" 
                                                onClick={() => {
                                                    // Explicitly update the form data before submitting
                                                    const formData = {
                                                        search: search || '',
                                                        category: selectedCategories.length === 1 ? selectedCategories[0] : (selectedCategories.length > 1 ? selectedCategories : ''),
                                                        tags: selectedTags,
                                                        sort: sortBy || 'latest'
                                                    };
                                                    
                                                    setData(formData);
                                                    get(route('projects.index'));
                                                    setShowFilters(false);
                                                }}
                                                disabled={processing}
                                            >
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Filters:</span>

                                {selectedCategories.map(categorySlug => {
                                    const category = categories.find(c => c.slug === categorySlug);
                                    return category ? (
                                    <Badge key={category.id} variant="secondary" className="flex items-center gap-1">
                                        {category.name}
                                        <button
                                            onClick={() => handleCategoryChange(category.slug, false)}
                                            className="ml-1 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            <svg
                                                className="h-3 w-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </Badge>
                                    ) : null;
                                })}

                                {selectedTags.map((tagSlug) => {
                                        const tag = tags ? tags.find((t) => t.slug === tagSlug) : null;
                                        return tag ? (
                                            <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                                                {tag.name}
                                                <button
                                                    onClick={() => handleTagToggle(tag.slug, false)}
                                                    className="ml-1 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <svg
                                                        className="h-3 w-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </Badge>
                                        ) : null;
                                    })}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-muted-foreground hover:text-foreground text-sm"
                                >
                                    Clear All
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Projects Grid */}
                    {projects && projects.data && projects.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.data.map((project) => (
                                <Link href={route('projects.show', project.slug)} key={project.id} className="block h-full">
                                    <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:shadow-md">
                                        {project.thumbnail_url && (
                                            <div className="aspect-video w-full overflow-hidden">
                                                <img
                                                    src={project.thumbnail_url}
                                                    alt={project.name}
                                                    className="h-full w-full object-cover transition-transform hover:scale-105"
                                                />
                                            </div>
                                        )}

                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <Badge variant="outline" className="mb-2">
                                                    {project.category ? project.category.name : 'Uncategorized'}
                                                </Badge>
                                                <div className="flex items-center text-yellow-500">
                                                    <Star className="mr-1 h-4 w-4 fill-current" />
                                                    <span className="text-sm">{project.stars_count}</span>
                                                </div>
                                            </div>
                                            <CardTitle className="leading-tight hover:underline">
                                                {project.name}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="flex-grow">
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {project.description || 'No description available'}
                                            </p>

                                            {project.engineers && project.engineers.length > 0 && (
                                                <div className="mt-4 flex items-center">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {project.engineers.slice(0, 3).map((engineer) => (
                                                            <img
                                                                key={engineer.id}
                                                                src={
                                                                    engineer.avatar_url ||
                                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(engineer.name)}&background=random`
                                                                }
                                                                alt={engineer.name}
                                                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800"
                                                            />
                                                        ))}
                                                        {project.engineers.length > 3 && (
                                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-800 ring-2 ring-white dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-800">
                                                                +{project.engineers.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        {project.engineers.length === 1 ? '1 engineer' : `${project.engineers.length} engineers`}
                                                    </span>
                                                </div>
                                            )}
                                        </CardContent>

                                        <CardFooter className="pt-0">
                                            {project.tags && project.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {project.tags.slice(0, 3).map((tag) => (
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
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <h3 className="mb-2 text-lg font-medium">No projects found</h3>
                                <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria.</p>
                                <Button onClick={clearFilters}>Clear Filters</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {projects && projects.meta && projects.meta.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!projects?.links?.prev}
                                onClick={() => {
                                    if (projects?.links?.prev) {
                                        window.location.href = projects.links.prev;
                                    }
                                }}
                            >
                                Previous
                            </Button>
                            <div className="mx-2 flex items-center">
                                <span className="text-muted-foreground text-sm">
                                    Page {projects?.meta?.current_page || 1} of {projects?.meta?.last_page || 1}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!projects?.links?.next}
                                onClick={() => {
                                    if (projects?.links?.next) {
                                        window.location.href = projects.links.next;
                                    }
                                }}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
