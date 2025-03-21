import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { type PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, useForm } from '@inertiajs/react';
import { UploadCloud, Plus, X } from 'lucide-react';
import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface Engineer {
    id: number;
    name: string;
    role?: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface CreateProjectProps extends InertiaPageProps {
    categories: Category[];
    tags: Tag[];
    engineers: Engineer[];
}

export default function CreateProject({ categories, tags, engineers }: CreateProjectProps) {
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [selectedEngineers, setSelectedEngineers] = useState<number[]>([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newTag, setNewTag] = useState('');
    const [customTags, setCustomTags] = useState<string[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        new_category: '',
        name: '',
        short_description: '',
        description: '',
        website_url: '',
        github_url: '',
        demo_url: '',
        category_id: '',
        tags: [] as number[],
        engineers: [] as number[],
        thumbnail: null as File | null,
    });

    const handleTagToggle = (tagId: number) => {
        setSelectedTags(prev => {
            const newSelection = [...prev];
            
            if (newSelection.includes(tagId)) {
                const index = newSelection.indexOf(tagId);
                newSelection.splice(index, 1);
            } else {
                newSelection.push(tagId);
            }
            
            setData('tags', newSelection);
            return newSelection;
        });
    };
    
    const getTagById = (id: number) => {
        return tags.find(tag => tag.id === id);
    };
    
    const handleAddCustomTag = () => {
        if (newTag.trim() && !customTags.includes(newTag.trim())) {
            setCustomTags(prev => [...prev, newTag.trim()]);
            setNewTag('');
        }
    };
    
    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCustomTag();
        }
    };
    
    const removeCustomTag = (tagToRemove: string) => {
        setCustomTags(prev => prev.filter(tag => tag !== tagToRemove));
    };
    
    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setData('new_category', newCategory.trim());
            setIsAddingCategory(false);
        }
    };
    
    const cancelAddCategory = () => {
        setNewCategory('');
        setData('new_category', '');
        setIsAddingCategory(false);
    };

    const handleEngineerToggle = (engineerId: number, checked: boolean) => {
        setSelectedEngineers(prev => {
            const newSelection = [...prev];
            
            if (checked) {
                if (!newSelection.includes(engineerId)) {
                    newSelection.push(engineerId);
                }
            } else {
                const index = newSelection.indexOf(engineerId);
                if (index !== -1) {
                    newSelection.splice(index, 1);
                }
            }
            
            setData('engineers', newSelection);
            return newSelection;
        });
    };
    
    const getEngineerById = (id: number) => {
        return engineers.find(engineer => engineer.id === id);
    };
    
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('thumbnail', file);
            
            // Create a preview URL
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                setThumbnailPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Process form data with custom tags
        const submitData = {
            ...data,
            custom_tags: customTags,
        };
        
        post('/projects', {
            ...submitData,
            onSuccess: () => {
                reset();
                setThumbnailPreview(null);
                setSelectedTags([]);
                setSelectedEngineers([]);
                setCustomTags([]);
                setNewCategory('');
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Home', href: '/' },
                { title: 'My Projects', href: '/my-projects' },
                { title: 'Create Project', href: '/projects/create' },
            ]}
        >
            <Head title="Create Project" />

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Share your AI project with the community
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Form Content */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Project Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter your project name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="short_description">Short Description <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="short_description"
                                            placeholder="A brief description (1-2 sentences)"
                                            value={data.short_description}
                                            onChange={e => setData('short_description', e.target.value)}
                                            required
                                        />
                                        {errors.short_description && <p className="text-sm text-red-500">{errors.short_description}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Full Description <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Detailed description of your project"
                                            rows={6}
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            required
                                        />
                                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website_url">Website URL</Label>
                                        <Input
                                            id="website_url"
                                            placeholder="https://yourproject.com"
                                            value={data.website_url}
                                            onChange={e => setData('website_url', e.target.value)}
                                        />
                                        {errors.website_url && <p className="text-sm text-red-500">{errors.website_url}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="github_url">GitHub URL</Label>
                                        <Input
                                            id="github_url"
                                            placeholder="https://github.com/username/repo"
                                            value={data.github_url}
                                            onChange={e => setData('github_url', e.target.value)}
                                        />
                                        {errors.github_url && <p className="text-sm text-red-500">{errors.github_url}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="demo_url">Demo URL</Label>
                                        <Input
                                            id="demo_url"
                                            placeholder="https://demo.yourproject.com"
                                            value={data.demo_url}
                                            onChange={e => setData('demo_url', e.target.value)}
                                        />
                                        {errors.demo_url && <p className="text-sm text-red-500">{errors.demo_url}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Category Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Category <span className="text-red-500">*</span></CardTitle>
                                    <CardDescription>Select a category or create a new one</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {!isAddingCategory ? (
                                        <>
                                            <Select
                                                value={data.category_id.toString()}
                                                onValueChange={(value) => {
                                                    setData('category_id', value);
                                                    setData('new_category', '');
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(category => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="w-full flex items-center justify-center gap-1 mt-2"
                                                onClick={() => {
                                                    setIsAddingCategory(true);
                                                    setData('category_id', '');
                                                }}
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add New Category
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    placeholder="Enter new category name"
                                                    value={newCategory}
                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                    className="flex-1"
                                                />
                                                <Button 
                                                    type="button" 
                                                    onClick={handleAddCategory}
                                                    size="sm"
                                                    disabled={!newCategory.trim()}
                                                >
                                                    Add
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={cancelAddCategory}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                            
                                            {data.new_category && (
                                                <div className="flex items-center text-sm mt-2">
                                                    <Badge variant="outline" className="bg-primary/10 text-primary px-2 py-1">
                                                        New: {data.new_category}
                                                    </Badge>
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={cancelAddCategory}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {errors.category_id && <p className="mt-1 text-sm text-destructive">{errors.category_id}</p>}
                                    {errors.new_category && <p className="mt-1 text-sm text-destructive">{errors.new_category}</p>}
                                </CardContent>
                            </Card>

                            {/* Tags */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tags</CardTitle>
                                    <CardDescription>Select existing tags or create new ones</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <Badge 
                                                key={tag.id}
                                                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                                                className={`px-2.5 py-1 cursor-pointer ${selectedTags.includes(tag.id) 
                                                    ? 'bg-primary/90 hover:bg-primary/80' 
                                                    : 'hover:bg-secondary/50'}`}
                                                onClick={() => handleTagToggle(tag.id)}
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    
                                    <div className="pt-2 border-t border-border/40">
                                        <Label htmlFor="new-tag" className="text-sm font-medium">Add New Tag:</Label>
                                        <div className="flex mt-1.5 gap-2">
                                            <Input 
                                                id="new-tag"
                                                placeholder="Enter new tag name"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyDown={handleTagKeyDown}
                                                className="flex-1"
                                            />
                                            <Button 
                                                type="button" 
                                                onClick={handleAddCustomTag}
                                                size="sm"
                                                disabled={!newTag.trim()}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {(selectedTags.length > 0 || customTags.length > 0) && (
                                        <div className="pt-3">
                                            <p className="text-sm font-medium mb-2">Selected Tags:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedTags.map(tagId => {
                                                    const tag = getTagById(tagId);
                                                    return tag && (
                                                        <Badge key={`selected-${tagId}`} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                                            {tag.name}
                                                        </Badge>
                                                    );
                                                })}
                                                
                                                {customTags.map((tag, index) => (
                                                    <div key={`custom-${index}`} className="inline-flex items-center">
                                                        <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground border-secondary/20 pr-1">
                                                            {tag}
                                                            <button 
                                                                onClick={() => removeCustomTag(tag)}
                                                                className="ml-1 p-0.5 rounded-full hover:bg-secondary/30 h-4 w-4 inline-flex items-center justify-center"
                                                            >
                                                                <X className="h-2.5 w-2.5" />
                                                            </button>
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {errors.tags && <p className="mt-2 text-sm text-destructive">{errors.tags}</p>}
                                </CardContent>
                            </Card>

                            {/* Engineers */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Engineers</CardTitle>
                                    <CardDescription>Select the engineers who contributed to this project</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col space-y-2">
                                        {engineers.map(engineer => (
                                            <div 
                                                key={engineer.id}
                                                className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50"
                                            >
                                                <Checkbox 
                                                    id={`engineer-${engineer.id}`}
                                                    checked={selectedEngineers.includes(engineer.id)}
                                                    onCheckedChange={(checked) => 
                                                        handleEngineerToggle(engineer.id, checked as boolean)
                                                    }
                                                />
                                                <div className="flex items-center space-x-3 flex-1" onClick={() => 
                                                    handleEngineerToggle(engineer.id, !selectedEngineers.includes(engineer.id))
                                                }>
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                            {getInitials(engineer.name || engineer.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">
                                                            {engineer.name || engineer.user.name}
                                                        </p>
                                                        {engineer.role && (
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {engineer.role}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {selectedEngineers.length > 0 && (
                                        <div className="mt-4 border-t pt-3">
                                            <p className="text-sm font-medium mb-2">Selected Engineers:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedEngineers.map(engineerId => {
                                                    const engineer = getEngineerById(engineerId);
                                                    return engineer && (
                                                        <Badge key={`selected-${engineerId}`} variant="secondary" className="px-2 py-1 bg-secondary/30">
                                                            {engineer.name || engineer.user.name}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {errors.engineers && <p className="mt-2 text-sm text-destructive">{errors.engineers}</p>}
                                </CardContent>
                            </Card>

                            {/* Thumbnail Upload */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thumbnail</CardTitle>
                                    <CardDescription>Add a cover image for your project</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div 
                                        onClick={triggerFileInput}
                                        className="cursor-pointer rounded-lg border-2 border-dashed border-input/60 p-4 text-center hover:border-primary/50 transition-colors"
                                    >
                                        {thumbnailPreview ? (
                                            <div className="relative aspect-video overflow-hidden rounded-md">
                                                <img 
                                                    src={thumbnailPreview} 
                                                    alt="Thumbnail preview" 
                                                    className="h-full w-full object-cover" 
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                                                    <span className="rounded-md bg-black/50 px-2 py-1 text-sm text-white">
                                                        Change
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-6">
                                                <div className="bg-muted/50 rounded-full p-3 mb-3">
                                                    <UploadCloud className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <p className="text-muted-foreground font-medium">Click to upload thumbnail</p>
                                                <p className="mt-1 text-xs text-muted-foreground/70">PNG, JPG up to 2MB</p>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            id="thumbnail"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                        />
                                    </div>
                                    {errors.thumbnail && <p className="mt-2 text-sm text-destructive">{errors.thumbnail}</p>}
                                </CardContent>
                            </Card>

                            {/* Submit */}
                            <div className="flex gap-4">
                                <Button type="submit" className="flex-grow" disabled={processing}>
                                    Create Project
                                </Button>
                                <Link href="/my-projects">
                                    <Button variant="outline" type="button" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
