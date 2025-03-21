import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="relative" ref={menuRef}>
                    <SidebarMenuButton 
                        size="lg" 
                        className={`text-sidebar-accent-foreground ${isOpen ? 'bg-sidebar-accent' : ''} group`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <UserInfo user={auth.user} />
                        <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                    
                    {isOpen && (
                        <div className="absolute z-50 min-w-56 rounded-lg border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                             style={{
                                 [isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom']: 'calc(100% + 8px)',
                                 right: isMobile || state !== 'collapsed' ? 0 : 'auto',
                             }}
                        >
                            <UserMenuContent user={auth.user} />
                        </div>
                    )}
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
