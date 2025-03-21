import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, ChangeEvent, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    avatar?: File | null;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        auth.user.media_links?.avatar || auth.user.avatar || null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null as File | null,
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // If we have a file, use FormData to handle the upload
        if (data.avatar instanceof File) {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('avatar', data.avatar);
            formData.append('_method', 'PATCH');

            router.post(route('profile.update'), formData, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            // Otherwise use the regular patch method
            patch(route('profile.update'), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your profile details and avatar" />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="mb-6">
                            <Label htmlFor="avatar" className="mb-2 block">Profile Photo</Label>
                            <div 
                                onClick={triggerFileInput}
                                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-primary-500 dark:border-gray-700 dark:hover:border-primary-500"
                            >
                                {avatarPreview ? (
                                    <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full">
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
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
