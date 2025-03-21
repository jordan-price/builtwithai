import { Button } from '@/components/ui/button';
import { initializeTheme, useAppearance } from '@/hooks/use-appearance';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

// Initialize theme on server-side
if (typeof window !== 'undefined') {
    initializeTheme();
}

function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        const nextTheme = appearance === 'light' ? 'dark' : 'light';
        updateAppearance(nextTheme);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggleTheme}
            title={`Current theme: ${appearance}. Click to switch to ${appearance === 'light' ? 'dark' : 'light'} mode`}
        >
            <SunIcon className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <MoonIcon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

export default function PublicLayout({ children, title, breadcrumbs }: PublicLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Public Header */}
                <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                                    BuiltWithAI
                                </Link>
                                <nav className="hidden md:ml-10 md:flex md:space-x-8">
                                    <Link
                                        href="/projects"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Discover Projects
                                    </Link>
                                    <Link
                                        href="/engineers"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        AI Engineers
                                    </Link>
                                    {/* Community Members link moved to authenticated area */}
                                    {/* <Link href="/categories" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                        Categories
                                    </Link> */}
                                </nav>
                            </div>
                            <div className="flex items-center space-x-4">
                                <ThemeToggle />
                                <div className="hidden md:block">
                                    <div className="flex items-center space-x-2">
                                        <Link href="/login">
                                            <Button variant="outline">Sign In</Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button>Join Community</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Breadcrumbs if provided */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div className="bg-white shadow dark:bg-gray-950">
                        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
                            <nav className="py-4">
                                <ol className="flex items-center space-x-1 text-sm">
                                    {breadcrumbs.map((breadcrumb, index) => (
                                        <li key={index} className="flex items-center">
                                            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                                            {breadcrumb.href ? (
                                                <Link
                                                    href={breadcrumb.href}
                                                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                                                >
                                                    {breadcrumb.title}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">{breadcrumb.title}</span>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">{children}</main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">BuiltWithAI</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Discover the best AI-powered projects and connect with talented engineers building the future.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">Resources</h3>
                                <ul className="mt-4 space-y-2">
                                    <li>
                                        <Link href="/projects" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            Browse Projects
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/engineers"
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        >
                                            Find Engineers
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/categories"
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        >
                                            Categories
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">Company</h3>
                                <ul className="mt-4 space-y-2">
                                    <li>
                                        <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            About
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            Terms of Service
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col border-t border-gray-200 pt-8 md:flex-row md:items-center md:justify-between dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                &copy; {new Date().getFullYear()} BuiltWithAI. All rights reserved.
                            </p>
                            <div className="mt-4 flex space-x-6 md:mt-0">
                                <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
