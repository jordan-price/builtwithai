import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Code, Folder, LayoutGrid, Search, Users, UserCircle, UserCog } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Discover Projects',
        href: '/projects',
        icon: Search,
    },
    {
        title: 'Engineers',
        href: '/engineers',
        icon: Users,
    },
    {
        title: 'Members',
        href: '/members',
        icon: UserCircle,
    },
    // {
    //     title: 'Categories',
    //     href: '/categories',
    //     icon: Layers,
    // },
    {
        title: 'My Projects',
        href: '/my-projects',
        icon: Code,
    },
    {
        title: 'My Engineer Profile',
        href: '/my-engineer-profile',
        icon: UserCog,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'GitHub Repo',
        href: 'https://github.com/yourusername/builtwithai',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: '/docs',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
