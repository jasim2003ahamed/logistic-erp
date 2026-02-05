'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, FileText, LayoutDashboard, ClipboardList, PackageCheck, Truck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Quotations', href: '/quotations/list', icon: ClipboardList },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Stock', href: '/stock', icon: Package },
    { name: 'Release Orders', href: '/release-order', icon: PackageCheck },
    { name: 'Delivery Orders', href: '/delivery-order', icon: Truck },
    { name: 'Collections', href: '/collection', icon: CreditCard },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-40 w-full">
            <div className="container mx-auto flex h-16 items-center px-4">
                <div className="mr-8 flex items-center gap-3 font-black text-xl tracking-tighter text-slate-900 group cursor-pointer">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform">
                        <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <span className="uppercase italic">ERP PRO</span>
                </div>

                <div className="flex items-center space-x-4 lg:space-x-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                                    isActive ? "text-slate-900" : "text-slate-500"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-slate-900" : "text-slate-500")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
