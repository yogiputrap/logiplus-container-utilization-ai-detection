import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, TrendingUp, Zap, BarChart3 } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#203864] to-[#FF5722] bg-clip-text text-transparent">
                    Container Utilization Analysis
                </h1>
                <p className="text-lg text-gray-600">
                    Optimize your logistics with AI-powered container space utilization monitoring
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <div className="w-12 h-12 bg-[#203864] rounded-xl flex items-center justify-center mb-2">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-[#203864]">Space Optimization</CardTitle>
                        <CardDescription>Maximize container capacity usage</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <div className="w-12 h-12 bg-[#FF5722] rounded-xl flex items-center justify-center mb-2">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-[#FF5722]">Instant Analysis</CardTitle>
                        <CardDescription>Real-time utilization metrics</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-orange-50 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#203864] to-[#FF5722] rounded-xl flex items-center justify-center mb-2">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-[#203864]">Detailed Insights</CardTitle>
                        <CardDescription>Comprehensive cargo breakdown</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Main CTA */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-[#203864] to-[#2C4A7C] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                <CardHeader className="relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <Package className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl text-white mb-2">
                                Analyze Container Utilization
                            </CardTitle>
                            <CardDescription className="text-white/80 text-base">
                                Upload container images to get instant space utilization analysis and cargo insights
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <Link href="/home/ai-detection">
                        <Button
                            size="lg"
                            className="bg-[#FF5722] text-white hover:bg-[#E64A19] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 group"
                        >
                            Start Analysis
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle>How It Works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-gray-600">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                1
                            </div>
                            <p>Upload container or truck image with cargo inside</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                2
                            </div>
                            <p>AI analyzes cargo placement and calculates space utilization</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                3
                            </div>
                            <p>View utilization percentage, cargo breakdown, and optimization insights</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#FF5722]"></div>
                            <p>Container space utilization percentage</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#FF5722]"></div>
                            <p>Visual cargo placement mapping</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#FF5722]"></div>
                            <p>Detailed cargo type breakdown</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#FF5722]"></div>
                            <p>Area metrics and statistics</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#FF5722]"></div>
                            <p>Confidence scores for accuracy</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
