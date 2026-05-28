import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, User, Key, Info } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#203864] rounded-xl flex items-center justify-center">
                        <SettingsIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-[#203864]">
                            Settings
                        </h1>
                        <p className="text-lg text-gray-600">
                            Manage your application preferences
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-[#203864]" />
                        <CardTitle>Profile Information</CardTitle>
                    </div>
                    <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <p className="mt-1 text-gray-900">Demo User</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-gray-900">demo@example.com</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
