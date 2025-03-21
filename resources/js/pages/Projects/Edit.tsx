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

interface Project {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    description: string;
    website_url?: string;
    github_url?: string;
    demo_url?: string;
    category: {
        id: number;
        name: string;
    };
    tags: Tag[];
    engineers: Engineer[];
    thumbnail_url?: string;
}

interface EditProjectProps extends InertiaPageProps {
    project: Project;
    categories: Category[];
    tags: Tag[];
    engineers: Engineer[];
}

export default function EditProject({ project, categories, tags, engineers }: EditProjectProps) {
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(project.thumbnail_url || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedTags, setSelectedTags] = useState<number[]>(project.tags.map(tag => tag.id));
    const [selectedEngineers, setSelectedEngineers] = useState<number[]>(project.engineers.map(eng => eng.id));
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newTag, setNewTag] = useState('');
    const [customTags, setCustomTags] = useState<string[]>([]);

    const { data, setData, put, processing, errors } = useForm({
        new_category: '',
        name: project.name,
        short_description: project.short_description,
        description: project.description,
        website_url: project.website_url || '',
        github_url: project.github_url || '',
        demo_url: project.demo_url || '',
        category_id: project.category.id.toString(),
        tags: project.tags.map(tag => tag.id),
        engineers: project.engineers.map(eng => eng.id),
        thumbnail: null as File | null,
        _method: 'PUT',
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
        
        // Use the patch method instead of put to match the Laravel route
        put(`/projects/${project.id}`, {
            ...submitData,
            onSuccess: () => {
                // Reset only specific fields, not the entire form
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
                { title: 'Edit Project', href: `/projects/${project.id}/edit` },
            ]}
        >
            <Head title={`Edit: ${project.name}`} />

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Update your project details and showcase it to other AI enthusiasts.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                            <CardDescription>
                                Basic information about your AI project
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="mb-1 block">
                                    Project Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="E.g., AI-Powered Chatbot"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <div className="mt-1 text-sm text-red-600">{errors.name}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="short_description" className="mb-1 block">
                                    Short Description
                                </Label>
                                <Input
                                    id="short_description"
                                    type="text"
                                    placeholder="A brief, catchy description of your project"
                                    value={data.short_description}
                                    onChange={e => setData('short_description', e.target.value)}
                                />
                                {errors.short_description && (
                                    <div className="mt-1 text-sm text-red-600">{errors.short_description}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description" className="mb-1 block">
                                    Full Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Detailed information about your project, including technologies used, challenges, and solutions"
                                    className="min-h-[150px]"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                                {errors.description && (
                                    <div className="mt-1 text-sm text-red-600">{errors.description}</div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <Label htmlFor="website_url" className="mb-1 block">
                                        Website URL (Optional)
                                    </Label>
                                    <Input
                                        id="website_url"
                                        type="url"
                                        placeholder="https://yourproject.com"
                                        value={data.website_url}
                                        onChange={e => setData('website_url', e.target.value)}
                                    />
                                    {errors.website_url && (
                                        <div className="mt-1 text-sm text-red-600">{errors.website_url}</div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="github_url" className="mb-1 block">
                                        GitHub URL (Optional)
                                    </Label>
                                    <Input
                                        id="github_url"
                                        type="url"
                                        placeholder="https://github.com/yourusername/project"
                                        value={data.github_url}
                                        onChange={e => setData('github_url', e.target.value)}
                                    />
                                    {errors.github_url && (
                                        <div className="mt-1 text-sm text-red-600">{errors.github_url}</div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="demo_url" className="mb-1 block">
                                        Demo URL (Optional)
                                    </Label>
                                    <Input
                                        id="demo_url"
                                        type="url"
                                        placeholder="https://demo.yourproject.com"
                                        value={data.demo_url}
                                        onChange={e => setData('demo_url', e.target.value)}
                                    />
                                    {errors.demo_url && (
                                        <div className="mt-1 text-sm text-red-600">{errors.demo_url}</div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Category</CardTitle>
                                <CardDescription>
                                    Select the category that best describes your project
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isAddingCategory ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="new_category" className="mb-1 block">
                                            New Category Name
                                        </Label>
                                        <Input
                                            id="new_category"
                                            type="text"
                                            placeholder="E.g., Natural Language Processing"
                                            value={newCategory}
                                            onChange={e => setNewCategory(e.target.value)}
                                        />
                                        <div className="flex space-x-2">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={cancelAddCategory}
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="button" 
                                                size="sm" 
                                                onClick={handleAddCategory}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Select 
                                            value={data.new_category ? "custom" : data.category_id} 
                                            onValueChange={(value) => {
                                                if (value === "add_new") {
                                                    setIsAddingCategory(true);
                                                } else if (value === "custom") {
                                                    // Do nothing, keep the custom category
                                                } else {
                                                    setData('category_id', value);
                                                    setData('new_category', '');
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(category => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                                {data.new_category && (
                                                    <SelectItem value="custom">
                                                        {data.new_category} (New)
                                                    </SelectItem>
                                                )}
                                                <SelectItem value="add_new">
                                                    + Add New Category
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        
                                        {data.new_category && (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400">
                                                {data.new_category} (New)
                                                <button 
                                                    type="button"
                                                    className="ml-1 rounded-full bg-green-800/10 p-1 hover:bg-green-800/20"
                                                    onClick={() => {
                                                        setData('new_category', '');
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        )}

                                        {errors.category_id && !data.new_category && (
                                            <div className="mt-1 text-sm text-red-600">{errors.category_id}</div>
                                        )}
                                        {errors.new_category && (
                                            <div className="mt-1 text-sm text-red-600">{errors.new_category}</div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                                <CardDescription>
                                    Add tags to make your project more discoverable
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <Badge
                                                key={tag.id}
                                                variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                                                className="cursor-pointer"
                                                onClick={() => handleTagToggle(tag.id)}
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="custom_tag" className="mb-1 block">
                                            Add Custom Tags
                                        </Label>
                                        <div className="flex space-x-2">
                                            <Input
                                                id="custom_tag"
                                                type="text"
                                                placeholder="E.g., Transformers"
                                                value={newTag}
                                                onChange={e => setNewTag(e.target.value)}
                                                onKeyDown={handleTagKeyDown}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={handleAddCustomTag}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {customTags.length > 0 && (
                                        <div>
                                            <Label className="mb-1 block">
                                                Custom Tags
                                            </Label>
                                            <div className="flex flex-wrap gap-2">
                                                {customTags.map((tag, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/20 dark:text-blue-400"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            className="ml-1 rounded-full bg-blue-800/10 p-1 hover:bg-blue-800/20"
                                                            onClick={() => removeCustomTag(tag)}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {errors.tags && (
                                        <div className="mt-1 text-sm text-red-600">{errors.tags}</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Engineers</CardTitle>
                            <CardDescription>
                                Select the engineers who contributed to this project
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {engineers.map((engineer) => (
                                        <div
                                            key={engineer.id}
                                            className={`flex items-center space-x-3 rounded-lg border p-3 ${
                                                selectedEngineers.includes(engineer.id)
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border'
                                            }`}
                                        >
                                            <Checkbox
                                                id={`engineer-${engineer.id}`}
                                                checked={selectedEngineers.includes(engineer.id)}
                                                onCheckedChange={(checked) =>
                                                    handleEngineerToggle(engineer.id, checked === true)
                                                }
                                            />
                                            <div className="flex flex-1 items-center space-x-3">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {getInitials(engineer.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <Label
                                                    htmlFor={`engineer-${engineer.id}`}
                                                    className="flex-1 cursor-pointer text-sm font-medium"
                                                >
                                                    {engineer.name}
                                                    {engineer.role && (
                                                        <span className="block text-xs text-muted-foreground">
                                                            {engineer.role}
                                                        </span>
                                                    )}
                                                </Label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {errors.engineers && (
                                    <div className="mt-1 text-sm text-red-600">{errors.engineers}</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Project Thumbnail</CardTitle>
                            <CardDescription>
                                Upload a thumbnail image for your project
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleThumbnailUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            
                            {thumbnailPreview ? (
                                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setThumbnailPreview(null);
                                            setData('thumbnail', null);
                                        }}
                                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={triggerFileInput}
                                    className="mb-4 flex h-48 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                                >
                                    <UploadCloud className="mb-2 h-8 w-8 text-gray-400" />
                                    <div className="text-center">
                                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Click to upload a thumbnail
                                        </span>
                                        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG, GIF up to 10MB
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            {errors.thumbnail && (
                                <div className="mt-1 text-sm text-red-600">{errors.thumbnail}</div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-4">
                        <Link href="/my-projects">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
