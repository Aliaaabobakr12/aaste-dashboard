'use client';

import { Menu } from 'lucide-react';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; 
// I haven't installed Sheet yet. I'll just put a placeholder button for mobile menu.
// Or I can install it via 'npx shadcn@latest add sheet'.

export function Navbar() {
    return (
        <div className="flex items-center p-4 border-b border-muted/20 bg-background/50 backdrop-blur-md">
            {/* Mobile trigger placeholder */}
            <div className="md:hidden mr-4">
                <Menu className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex w-full justify-end">
                {/* Future User Menu */}
            </div>
        </div>
    );
}
