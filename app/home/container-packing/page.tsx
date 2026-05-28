'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PackingInputForm from '@/components/PackingInputForm';
import PackingStats from '@/components/PackingStats';
import { pack3D, Box, Container, PackingResult } from '@/lib/binPacking3D';
import { Package, Sparkles, Loader2 } from 'lucide-react';

// Dynamic import for 3D component to avoid SSR issues
const Container3DView = dynamic(() => import('@/components/Container3DView'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-[#203864] flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#203864] mx-auto mb-4" />
                <p className="text-gray-600">Loading 3D Visualization...</p>
            </div>
        </div>
    )
});

export default function ContainerPackingPage() {
    const [packingResult, setPackingResult] = useState<PackingResult | null>(null);
    const [container, setContainer] = useState<Container | null>(null);

    const handlePack = (containerDims: { width: number; height: number; depth: number }, boxes: Box[]) => {
        const containerData: Container = {
            ...containerDims,
            volume: containerDims.width * containerDims.height * containerDims.depth
        };

        const result = pack3D(containerData, boxes);
        setContainer(containerData);
        setPackingResult(result);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Card className="border-0 shadow-xl bg-gradient-to-r from-[#203864] to-[#2d4a7c]">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                            <Package className="w-8 h-8" />
                            3D Container Box Packing
                        </CardTitle>
                        <CardDescription className="text-gray-200 text-lg">
                            Optimize container space with intelligent 3D bin packing algorithm
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 mt-1 flex-shrink-0" />
                                <div className="space-y-2 text-sm">
                                    <p className="font-semibold">How it works:</p>
                                    <ul className="space-y-1 list-disc list-inside text-gray-200">
                                        <li>Define your container dimensions (width, height, depth)</li>
                                        <li>Add boxes you want to pack with their dimensions</li>
                                        <li>Our AI-powered algorithm calculates optimal placement</li>
                                        <li>View real-time 3D visualization with interactive controls</li>
                                        <li>Get detailed statistics on packing efficiency</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Input Form */}
                    <div className="lg:col-span-1">
                        <PackingInputForm onPack={handlePack} />
                    </div>

                    {/* Right Column - Visualization & Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {packingResult && container ? (
                            <>
                                {/* 3D Visualization */}
                                <Card className="border-0 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-[#203864]">
                                            <Package className="w-5 h-5" />
                                            3D Visualization
                                        </CardTitle>
                                        <CardDescription>
                                            Interactive 3D view - Drag to rotate, scroll to zoom, right-click to pan
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Container3DView
                                            container={container}
                                            placedBoxes={packingResult.placedBoxes}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Statistics */}
                                <PackingStats result={packingResult} />
                            </>
                        ) : (
                            /* Placeholder */
                            <Card className="border-0 shadow-xl">
                                <CardContent className="py-20">
                                    <div className="text-center text-gray-400">
                                        <Package className="w-20 h-20 mx-auto mb-4 opacity-20" />
                                        <p className="text-xl font-medium">No packing result yet</p>
                                        <p className="text-sm mt-2">
                                            Add boxes and click "Calculate 3D Packing" to see the visualization
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Algorithm Info */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
                    <CardHeader>
                        <CardTitle className="text-[#FF5722] flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Algorithm: First Fit Decreasing (FFD)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-semibold text-gray-700 mb-2">How FFD Works:</p>
                                <ul className="space-y-1 text-gray-600 list-disc list-inside">
                                    <li>Sort boxes by volume (largest first)</li>
                                    <li>Try all 6 possible rotations for each box</li>
                                    <li>Place box in the first available space</li>
                                    <li>Create new spaces around placed boxes</li>
                                    <li>Repeat until all boxes are placed or no space left</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700 mb-2">Benefits:</p>
                                <ul className="space-y-1 text-gray-600 list-disc list-inside">
                                    <li>Fast computation time (O(n² log n))</li>
                                    <li>Good packing efficiency (60-90% typical)</li>
                                    <li>Handles irregular box sizes</li>
                                    <li>Automatic rotation optimization</li>
                                    <li>Real-time visualization</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
