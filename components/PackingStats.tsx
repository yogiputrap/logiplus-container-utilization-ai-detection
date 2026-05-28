'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PackingResult } from '@/lib/binPacking3D';
import { Package, TrendingUp, AlertCircle, CheckCircle2, Box as BoxIcon } from 'lucide-react';

interface PackingStatsProps {
    result: PackingResult;
}

export default function PackingStats({ result }: PackingStatsProps) {
    const formatVolume = (volume: number) => {
        return (volume / 1000).toFixed(1);
    };

    const getEfficiencyColor = (efficiency: number) => {
        if (efficiency >= 80) return 'text-green-600 bg-green-50';
        if (efficiency >= 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getEfficiencyLabel = (efficiency: number) => {
        if (efficiency >= 80) return 'Excellent';
        if (efficiency >= 60) return 'Good';
        if (efficiency >= 40) return 'Fair';
        return 'Poor';
    };

    return (
        <div className="space-y-4">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Efficiency */}
                <Card className={`border-2 ${getEfficiencyColor(result.efficiency)}`}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Packing Efficiency
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {result.efficiency.toFixed(1)}%
                        </div>
                        <Badge className="mt-2" variant="secondary">
                            {getEfficiencyLabel(result.efficiency)}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Placed Boxes */}
                <Card className="border-2 border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
                            <CheckCircle2 className="w-4 h-4" />
                            Boxes Placed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-700">
                            {result.placedBoxes.length}
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                            {formatVolume(result.usedVolume)}L used
                        </p>
                    </CardContent>
                </Card>

                {/* Unplaced Boxes */}
                <Card className={`border-2 ${result.unplacedBoxes.length > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                    <CardHeader className="pb-3">
                        <CardTitle className={`text-sm font-medium flex items-center gap-2 ${result.unplacedBoxes.length > 0 ? 'text-red-700' : 'text-gray-700'}`}>
                            <AlertCircle className="w-4 h-4" />
                            Boxes Not Placed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${result.unplacedBoxes.length > 0 ? 'text-red-700' : 'text-gray-700'}`}>
                            {result.unplacedBoxes.length}
                        </div>
                        {result.unplacedBoxes.length > 0 && (
                            <p className="text-sm text-red-600 mt-1">
                                {formatVolume(result.totalVolume - result.usedVolume)}L remaining
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#203864]" />
                        Packing Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">Container Volume</p>
                            <p className="text-lg font-semibold text-[#203864]">
                                {formatVolume(result.containerVolume)} liters
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">Used Volume</p>
                            <p className="text-lg font-semibold text-green-600">
                                {formatVolume(result.usedVolume)} liters
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">Remaining Space</p>
                            <p className="text-lg font-semibold text-gray-600">
                                {formatVolume(result.containerVolume - result.usedVolume)} liters
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">Space Utilization</p>
                            <p className="text-lg font-semibold text-[#FF5722]">
                                {((result.usedVolume / result.containerVolume) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-3">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Volume Usage</span>
                            <span className="font-medium">{result.efficiency.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${result.efficiency >= 80 ? 'bg-green-500' :
                                        result.efficiency >= 60 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                    }`}
                                style={{ width: `${result.efficiency}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Unplaced Boxes List */}
            {result.unplacedBoxes.length > 0 && (
                <Card className="border-2 border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-700 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Boxes That Didn't Fit
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {result.unplacedBoxes.map((box) => (
                                <div
                                    key={box.id}
                                    className="flex items-center gap-3 p-2 bg-white rounded border border-red-200"
                                >
                                    <div
                                        className="w-5 h-5 rounded"
                                        style={{ backgroundColor: box.color }}
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{box.name}</p>
                                        <p className="text-xs text-gray-600">
                                            {box.width} × {box.height} × {box.depth} cm
                                            ({formatVolume(box.volume)}L)
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-red-600 mt-3 italic">
                            💡 Try increasing container size or removing some boxes
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Success Message */}
            {result.unplacedBoxes.length === 0 && (
                <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 text-green-700">
                            <CheckCircle2 className="w-6 h-6" />
                            <div>
                                <p className="font-semibold">All boxes successfully packed!</p>
                                <p className="text-sm text-green-600">
                                    {result.placedBoxes.length} boxes fit perfectly in the container
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
