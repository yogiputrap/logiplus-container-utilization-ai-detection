'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Brain, Home, Settings, LogOut, Menu, X, DollarSign, Package } from 'lucide-react';

const navigation = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'AI Utilisation', href: '/home/ai-detection', icon: Brain },
    { name: 'Dynamic Pricing', href: '/home/dynamic-pricing', icon: DollarSign },
    { name: 'Container Packing', href: '/home/container-packing', icon: Package },
    { name: 'Settings', href: '/home/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="bg-white/90 backdrop-blur-sm shadow-lg"
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#203864] to-[#2C4A7C] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0',
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo/Brand */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Brain className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Smartvis AI</h1>
                                <p className="text-xs text-white/70">Logistics Intelligence</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                                        isActive
                                            ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                                            : 'hover:bg-white/10'
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            'w-5 h-5 transition-transform duration-200',
                                            isActive ? 'scale-110' : 'group-hover:scale-110'
                                        )}
                                    />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-white/10">
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
