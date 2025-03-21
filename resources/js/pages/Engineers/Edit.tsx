import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { UploadCloud, Plus, X, Calendar } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

// Define the Engineer interface
interface Engineer {
  id: number;
  role: string;
  company: string;
  bio: string;
  location: string;
  github_username?: string;
  twitter_username?: string;
  linkedin_url?: string;
  personal_website?: string;
  public_email?: string;
  contact_preferences?: string[];
  is_open_to_work?: boolean;
  skills?: string[];
  experience?: Array<{
    title: string;
    company: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description: string;
  }>;
}

interface Props {
  engineer: Engineer & { user: { name: string; email: string; media_links?: { avatar?: string } } };
}

export default function EditEngineerProfile({ engineer }: Props) {
    // Initialize with null, we'll validate the avatar URL before showing it
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    
    // Check if the avatar URL is valid and set it as preview
    useEffect(() => {
        const avatarUrl = engineer.user?.media_links?.avatar;
        if (avatarUrl) {
            const img = new Image();
            img.onload = () => setAvatarPreview(avatarUrl);
            img.onerror = () => setAvatarPreview(null);
            img.src = avatarUrl;
        }
    }, [engineer.user?.media_links?.avatar]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Define our form data type
    type EngineerFormData = {
        name: string;
        role: string;
        company: string;
        bio: string;
        location: string;
        github_username: string;
        twitter_username: string;
        linkedin_url: string;
        personal_website: string;
        public_email: string;
        contact_preferences: string[];
        is_open_to_work: boolean;
        avatar: File | null;
        skills: string[];
        experience: Array<{
            title: string;
            company: string;
            start_date: string;
            end_date?: string;
            current: boolean;
            description: string;
        }>;
        _method?: string; // Add method field for Laravel method spoofing
    };

    // Initialize the form with the engineer's data
    const { data, setData, processing, errors } = useForm<EngineerFormData>({
        // Name now comes from the user model
        name: engineer.user?.name || '',
        role: engineer.role || '',
        company: engineer.company || '',
        bio: engineer.bio || '',
        location: engineer.location || '',
        github_username: engineer.github_username || '',
        twitter_username: engineer.twitter_username || '',
        linkedin_url: engineer.linkedin_url || '',
        personal_website: engineer.personal_website || '',
        public_email: engineer.public_email || '',
        contact_preferences: Array.isArray(engineer.contact_preferences) ? engineer.contact_preferences : [],
        is_open_to_work: engineer.is_open_to_work || false,
        avatar: null as File | null,
        skills: Array.isArray(engineer.skills) ? engineer.skills : [],
        experience: Array.isArray(engineer.experience) ? engineer.experience : [],
        _method: 'PUT', // For Laravel's method spoofing
    });

    const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('avatar', file);
            
            // Create a preview URL
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target) {
                    setAvatarPreview(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Debug helper for data changes
    useEffect(() => {
        console.log('Current form data:', data);
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submission - Current name value:', data.name);
        
        // Make sure contact_preferences is properly formatted as array
        const contactPrefs = Array.isArray(data.contact_preferences) 
            ? data.contact_preferences 
            : (typeof data.contact_preferences === 'string' && data.contact_preferences
                ? JSON.parse(data.contact_preferences)
                : []);
        
        // Make sure contact_preferences is set correctly in the form data
        setData('contact_preferences', contactPrefs);
        
        // Create a FormData object for file upload
        const formData = new FormData();
        
        // Add all form fields to the FormData - using a type-safe approach
        
        // Add text fields explicitly
        formData.append('name', data.name || '');
        formData.append('role', data.role || '');
        formData.append('company', data.company || '');
        formData.append('bio', data.bio || '');
        formData.append('location', data.location || '');
        formData.append('github_username', data.github_username || '');
        formData.append('twitter_username', data.twitter_username || '');
        formData.append('linkedin_url', data.linkedin_url || '');
        formData.append('personal_website', data.personal_website || '');
        formData.append('public_email', data.public_email || '');
        
        // Add method spoofing for PATCH request
        formData.append('_method', 'PATCH');
        
        // Handle boolean fields
        formData.append('is_open_to_work', data.is_open_to_work ? '1' : '0');
        
        // Handle array fields
        contactPrefs.forEach((pref: string, index: number) => {
            formData.append(`contact_preferences[${index}]`, pref);
        });
        
        // Add avatar if it exists
        if (data.avatar instanceof File) {
            formData.append('avatar', data.avatar);
        }
        
        // Log what we're submitting
        console.log('Submitting with Inertia using FormData:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        // Use Inertia's built-in form handling with the forceFormData option
        // This will automatically include CSRF token and handle method spoofing
        const path = '/my-engineer-profile';
        
        // Since we already imported useForm from @inertiajs/react, 
        // we can access router directly
        // Use Inertia's router to handle the form submission
        router.post(path, formData, {
            forceFormData: true,
            onSuccess: () => {
                console.log('Profile updated successfully');
                window.location.reload();
            },
            onError: (errors: Record<string, string>) => {
                console.error('Error updating profile:', errors);
            },
            onStart: () => {
                console.log('Upload started...');
            },
            onProgress: (progress) => {
                // Handle progress updates safely
                console.log(`Upload progress: ${progress?.percentage ?? 0}%`);
            },
            onFinish: () => {
                console.log('Upload request completed');
            },
        });
    };

    const toggleContactPreference = (preference: string) => {
        const currentPreferences = [...data.contact_preferences];
        const index = currentPreferences.indexOf(preference);
        
        if (index === -1) {
            currentPreferences.push(preference);
        } else {
            currentPreferences.splice(index, 1);
        }
        
        setData('contact_preferences', currentPreferences);
    };

    // Add a new skill
    const [newSkill, setNewSkill] = useState('');
    
    const addSkill = () => {
        if (newSkill.trim()) {
            const skills = Array.isArray(data.skills) ? data.skills : [];
            if (!skills.includes(newSkill.trim())) {
                setData('skills', [...skills, newSkill.trim()]);
                setNewSkill('');
            }
        }
    };
    
    const removeSkill = (skill: string) => {
        const skills = Array.isArray(data.skills) ? data.skills : [];
        setData('skills', skills.filter(s => s !== skill));
    };
    
    // Add a new experience entry
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [currentExperience, setCurrentExperience] = useState({
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        current: false,
        description: '',
    });
    
    const addExperience = () => {
        if (currentExperience.title && currentExperience.company && currentExperience.start_date) {
            const newExperience = {
                ...currentExperience,
                end_date: currentExperience.current ? undefined : currentExperience.end_date,
            };
            
            setData('experience', [...data.experience, newExperience]);
            setCurrentExperience({
                title: '',
                company: '',
                start_date: '',
                end_date: '',
                current: false,
                description: '',
            });
            setShowExperienceForm(false);
        }
    };
    
    const removeExperience = (index: number) => {
        const newExperience = [...data.experience];
        newExperience.splice(index, 1);
        setData('experience', newExperience);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Home', href: '/' },
                { title: 'My Engineer Profile', href: '/my-engineer-profile' },
            ]}
        >
            <Head title="Edit Engineer Profile" />

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Your Engineer Profile</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Update your engineer profile to showcase your skills and projects
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Form Content */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input
                                            id="role"
                                            placeholder="e.g. Full Stack Developer, AI Engineer"
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                        />
                                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company / Organization</Label>
                                        <Input
                                            id="company"
                                            placeholder="Where you work"
                                            value={data.company}
                                            onChange={e => setData('company', e.target.value)}
                                        />
                                        {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us about yourself"
                                            rows={5}
                                            value={data.bio}
                                            onChange={e => setData('bio', e.target.value)}
                                        />
                                        {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            placeholder="e.g. San Francisco, CA"
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                        />
                                        {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Social & Contact</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="github_username">GitHub Username</Label>
                                        <Input
                                            id="github_username"
                                            placeholder="username"
                                            value={data.github_username}
                                            onChange={e => setData('github_username', e.target.value)}
                                        />
                                        {errors.github_username && <p className="text-sm text-red-500">{errors.github_username}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="twitter_username">Twitter Username</Label>
                                        <Input
                                            id="twitter_username"
                                            placeholder="username"
                                            value={data.twitter_username}
                                            onChange={e => setData('twitter_username', e.target.value)}
                                        />
                                        {errors.twitter_username && <p className="text-sm text-red-500">{errors.twitter_username}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                        <Input
                                            id="linkedin_url"
                                            placeholder="https://linkedin.com/in/username"
                                            value={data.linkedin_url}
                                            onChange={e => setData('linkedin_url', e.target.value)}
                                        />
                                        {errors.linkedin_url && <p className="text-sm text-red-500">{errors.linkedin_url}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="personal_website">Personal Website</Label>
                                        <Input
                                            id="personal_website"
                                            placeholder="https://yourwebsite.com"
                                            value={data.personal_website}
                                            onChange={e => setData('personal_website', e.target.value)}
                                        />
                                        {errors.personal_website && <p className="text-sm text-red-500">{errors.personal_website}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="public_email">Public Email (visible to others)</Label>
                                        <Input
                                            id="public_email"
                                            type="email"
                                            placeholder="public@example.com"
                                            value={data.public_email}
                                            onChange={e => setData('public_email', e.target.value)}
                                        />
                                        {errors.public_email && <p className="text-sm text-red-500">{errors.public_email}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Skills Section */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Skills</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {Array.isArray(data.skills) && data.skills.map((skill, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="secondary"
                                                className="px-3 py-1 flex items-center gap-1 h-auto text-sm font-normal"
                                            >
                                                <span>{skill}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-1 rounded-full hover:bg-muted flex items-center justify-center"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Input 
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            placeholder="Add a skill (e.g. React, PHP)" 
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        />
                                        <Button type="button" onClick={addSkill} size="sm">
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Experience Section */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Work Experience</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {data.experience.length > 0 ? (
                                        <div className="space-y-4 mb-4">
                                            {data.experience.map((exp, index) => (
                                                <div key={index} className="border border-border rounded-md p-3 relative hover:border-input transition-colors">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExperience(index)}
                                                        className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <h3 className="font-semibold">{exp.title}</h3>
                                                    <p className="text-muted-foreground">{exp.company}</p>
                                                    <div className="flex items-center text-muted-foreground/80 text-sm mt-1">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        <span>{exp.start_date} - {exp.current ? 'Present' : exp.end_date}</span>
                                                    </div>
                                                    <p className="mt-2 text-sm">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground mb-4 text-center">No experience added yet</p>
                                    )}

                                    {showExperienceForm ? (
                                        <div className="border rounded-md p-4 space-y-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="exp-title">Job Title</Label>
                                                <Input
                                                    id="exp-title"
                                                    value={currentExperience.title}
                                                    onChange={(e) => setCurrentExperience({...currentExperience, title: e.target.value})}
                                                    placeholder="e.g. Software Engineer"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="exp-company">Company</Label>
                                                <Input
                                                    id="exp-company"
                                                    value={currentExperience.company}
                                                    onChange={(e) => setCurrentExperience({...currentExperience, company: e.target.value})}
                                                    placeholder="e.g. Acme Inc."
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="exp-start">Start Date</Label>
                                                    <Input
                                                        id="exp-start"
                                                        type="date"
                                                        value={currentExperience.start_date}
                                                        onChange={(e) => setCurrentExperience({...currentExperience, start_date: e.target.value})}
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <Label htmlFor="exp-end">End Date</Label>
                                                    <Input
                                                        id="exp-end"
                                                        type="date"
                                                        value={currentExperience.end_date}
                                                        onChange={(e) => setCurrentExperience({...currentExperience, end_date: e.target.value})}
                                                        disabled={currentExperience.current}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="current-job"
                                                    checked={currentExperience.current}
                                                    onCheckedChange={(checked) => setCurrentExperience({...currentExperience, current: checked === true})}
                                                />
                                                <Label htmlFor="current-job" className="text-sm font-normal cursor-pointer">I currently work here</Label>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="exp-description">Description</Label>
                                                <Textarea
                                                    id="exp-description"
                                                    value={currentExperience.description}
                                                    onChange={(e) => setCurrentExperience({...currentExperience, description: e.target.value})}
                                                    placeholder="Describe your responsibilities and achievements"
                                                    rows={3}
                                                />
                                            </div>
                                            
                                            <div className="flex gap-2 justify-end mt-3">
                                                <Button type="button" variant="outline" onClick={() => setShowExperienceForm(false)}>Cancel</Button>
                                                <Button type="button" onClick={addExperience}>Save</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => setShowExperienceForm(true)}
                                            className="w-full"
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add Experience
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Avatar Upload */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Photo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div 
                                        onClick={triggerFileInput}
                                        className="cursor-pointer rounded-lg border-2 border-dashed border-neutral-200 p-4 text-center hover:border-primary transition-colors dark:border-neutral-800 dark:hover:border-primary/70"
                                    >
                                        {avatarPreview ? (
                                            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full">
                                                <img 
                                                    src={avatarPreview} 
                                                    alt="Avatar preview" 
                                                    className="h-full w-full object-cover" 
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 transition-opacity hover:opacity-100">
                                                    <span className="rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
                                                        Change
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-4">
                                                <UploadCloud className="mb-2 h-10 w-10 text-muted-foreground" />
                                                <p className="text-muted-foreground font-medium">Click to upload photo</p>
                                                <p className="mt-1 text-xs text-muted-foreground/70">PNG, JPG up to 2MB</p>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            id="avatar"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                        />
                                    </div>
                                    {errors.avatar && <p className="mt-2 text-sm text-red-500">{errors.avatar}</p>}
                                </CardContent>
                            </Card>

                            {/* Work Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Work Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is_open_to_work"
                                            checked={data.is_open_to_work}
                                            onCheckedChange={(checked) => setData('is_open_to_work', checked)}
                                        />
                                        <Label htmlFor="is_open_to_work" className="font-normal cursor-pointer">Available for opportunities</Label>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Toggle this if you're open to new projects or job opportunities.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Contact Preferences */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Preferences</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="contact_email"
                                            checked={data.contact_preferences.includes('email')}
                                            onCheckedChange={() => toggleContactPreference('email')}
                                        />
                                        <Label htmlFor="contact_email" className="text-sm font-normal cursor-pointer">Email contact</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="contact_projects"
                                            checked={data.contact_preferences.includes('projects')}
                                            onCheckedChange={() => toggleContactPreference('projects')}
                                        />
                                        <Label htmlFor="contact_projects" className="text-sm font-normal cursor-pointer">Project inquiries</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="contact_jobs"
                                            checked={data.contact_preferences.includes('jobs')}
                                            onCheckedChange={() => toggleContactPreference('jobs')}
                                        />
                                        <Label htmlFor="contact_jobs" className="text-sm font-normal cursor-pointer">Job opportunities</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit */}
                            <Button type="submit" className="w-full" disabled={processing}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
