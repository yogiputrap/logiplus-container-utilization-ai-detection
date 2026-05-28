'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

interface Prediction {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
}

interface UtilizationStatsProps {
    predictions: Prediction[];
    imageSize: { width: number; height: number };
}

export default function UtilizationStats({ predictions, imageSize }: UtilizationStatsProps) {
    // Calculate total area of detected objects
    const totalObjectArea = predictions.reduce((sum, pred) => {
        return sum + (pred.width * pred.height);
    }, 0);

    // Calculate container area (image area)
    const containerArea = imageSize.width * imageSize.height;

    // Calculate utilization percentage
    const utilizationPercentage = ((totalObjectArea / containerArea) * 100).toFixed(1);
    const utilization = parseFloat(utilizationPercentage);

    // Determine status
    const getUtilizationStatus = () => {
        if (utilization < 40) return { label: 'Low', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertTriangle };
        if (utilization < 70) return { label: 'Moderate', color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp };
        return { label: 'High', color: 'text-green-600', bg: 'bg-green-50', icon: Package };
    };

    const status = getUtilizationStatus();
    const StatusIcon = status.icon;

    // Group objects by class
    const objectsByClass = predictions.reduce((acc, pred) => {
        acc[pred.class] = (acc[pred.class] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Utilization Card */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#203864]" />
                        Container Utilization
                    </CardTitle>
                    <CardDescription>Estimated space usage</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Percentage Display */}
                        <div className="text-center">
                            <div className={`text-6xl font-bold ${status.color}`}>
                                {utilizationPercentage}%
                            </div>
                            <div className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg}`}>
                                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                                <span className={`font-medium ${status.color}`}>{status.label} Utilization</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Space Used</span>
                                <span>{utilizationPercentage}%</span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${utilization < 40 ? 'bg-yellow-500' :
                                        utilization < 70 ? 'bg-blue-500' :
                                            'bg-green-500'
                                        }`}
                                    style={{ width: `${Math.min(utilization, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Area Details */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm text-gray-600">Objects Area</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {Math.round(totalObjectArea).toLocaleString()} px²
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Container Area</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {Math.round(containerArea).toLocaleString()} px²
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Object Summary Card */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#FF5722]" />
                        Detected Objects
                    </CardTitle>
                    <CardDescription>Summary of items in container</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Total Count */}
                        <div className="text-center pb-4 border-b">
                            <div className="text-5xl font-bold text-[#FF5722]">
                                {predictions.length}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                Total Items Detected
                            </div>
                        </div>

                        {/* Object Breakdown */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700">Breakdown by Type:</p>
                            {Object.entries(objectsByClass).map(([className, count]) => (
                                <div key={className} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                        <span className="text-sm capitalize text-gray-700">{className}</span>
                                    </div>
                                    <Badge variant="secondary" className="font-semibold">
                                        {count} {count === 1 ? 'item' : 'items'}
                                    </Badge>
                                </div>
                            ))}
                        </div>

                        {/* Average Confidence */}
                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Avg. Confidence</span>
                                <Badge variant="outline" className="font-semibold">
                                    {(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100).toFixed(1)}%
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
