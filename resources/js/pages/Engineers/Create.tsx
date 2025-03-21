import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { UploadCloud } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface Props {
    user: {
        name: string;
        media_links: {
            avatar: string | null;
        };
    };
}

export default function CreateEngineering({ user }: Props) {
    // Only set avatar preview if we have a valid URL that doesn't result in broken image
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    
    // Check if the avatar URL is valid and set it as preview
    useEffect(() => {
        if (user?.media_links?.avatar) {
            const img = new Image();
            img.onload = () => setAvatarPreview(user.media_links.avatar);
            img.onerror = () => setAvatarPreview(null);
            img.src = user.media_links.avatar;
        }
    }, [user?.media_links?.avatar]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<{
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
    }>({
        // Prefill name from user data
        name: user?.name || '',
        role: '',
        company: '',
        bio: '',
        location: '',
        github_username: '',
        twitter_username: '',
        linkedin_url: '',
        personal_website: '',
        public_email: '',
        contact_preferences: [] as string[],
        is_open_to_work: false,
        avatar: null as File | null,
        skills: [] as string[],
        experience: [] as Array<{
            title: string;
            company: string;
            start_date: string;
            end_date?: string;
            current: boolean;
            description: string;
        }>,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/my-engineer-profile');
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
                { title: 'Create Profile', href: '/my-engineer-profile/create' },
            ]}
        >
            <Head title="Create Engineer Profile" />

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Engineer Profile</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Set up your engineer profile to showcase your skills and projects
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
                                            <div key={index} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full flex items-center gap-1 dark:bg-primary-900 dark:text-primary-300">
                                                <span>{skill}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeSkill(skill)}
                                                    className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Input 
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            placeholder="Add a skill (e.g. React, PHP)" 
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        />
                                        <Button type="button" onClick={addSkill}>Add</Button>
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
                                                <div key={index} className="border rounded-md p-3 relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExperience(index)}
                                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                                    >
                                                        &times;
                                                    </button>
                                                    <h3 className="font-semibold">{exp.title}</h3>
                                                    <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                                                    <p className="text-gray-500 text-sm">
                                                        {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                                                    </p>
                                                    <p className="mt-2 text-sm">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 mb-4 text-center">No experience added yet</p>
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
                                                <input
                                                    type="checkbox"
                                                    id="current-job"
                                                    checked={currentExperience.current}
                                                    onChange={(e) => setCurrentExperience({...currentExperience, current: e.target.checked})}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                                <Label htmlFor="current-job">I currently work here</Label>
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
                                            + Add Experience
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
                                        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-primary-500 dark:border-gray-700 dark:hover:border-primary-500"
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
                                                <UploadCloud className="mb-2 h-10 w-10 text-gray-400" />
                                                <p className="text-gray-600 dark:text-gray-400">Click to upload photo</p>
                                                <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
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
                                        <Label htmlFor="is_open_to_work">Available for opportunities</Label>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
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
                                        <input
                                            type="checkbox"
                                            id="contact_email"
                                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-400"
                                            checked={data.contact_preferences.includes('email')}
                                            onChange={() => toggleContactPreference('email')}
                                        />
                                        <Label htmlFor="contact_email">Email contact</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="contact_projects"
                                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-400"
                                            checked={data.contact_preferences.includes('projects')}
                                            onChange={() => toggleContactPreference('projects')}
                                        />
                                        <Label htmlFor="contact_projects">Project inquiries</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="contact_jobs"
                                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-400"
                                            checked={data.contact_preferences.includes('jobs')}
                                            onChange={() => toggleContactPreference('jobs')}
                                        />
                                        <Label htmlFor="contact_jobs">Job opportunities</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit */}
                            <Button type="submit" className="w-full" disabled={processing}>
                                Create Profile
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
