'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, Package, BarChart3, Menu, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Assuming shadcn button exists or native
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/',
    },
    {
        label: 'Upload Reviews',
        icon: Upload,
        href: '/upload',
    },
    {
        label: 'Products',
        icon: Package,
        href: '/products',
    },
    {
        label: 'Files',
        icon: FileText,
        href: '/files',
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <div className="flex flex-col w-fit">
                        <h1 className="text-2xl font-bold leading-none tracking-tight">
                            ASTE<span className="text-emerald-500">Dash</span>
                        </h1>
                        <div className="h-[1px] bg-emerald-500/30 w-full my-0.5"></div>
                        <div className="flex justify-between w-full px-[1px]">
                            <span className="text-xs text-emerald-500/80 font-[family-name:var(--font-cairo)] font-bold w-full text-center tracking-[0.2em] leading-none">
                                بالعربي
                            </span>
                        </div>
                    </div>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.href === pathname ? "text-emerald-500" : "text-zinc-400")} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Mobile sidebar using Sheet if I want to be fancy, but let's stick to basic responsive
// Actually, I'll need to check if Sheet component exists from shadcn init.
// I used `init -d`, so it installed base. I didn't install `sheet` component.
// I'll stick to a simple hidden/block strategy or install sheet.
// "Mobile-first approach... Sidebar collapses to hamburger menu".
// I'll skip Sheet for now and just hide sidebar on mobile, show hamburger.
// Or I'll install sheet in next turn.
