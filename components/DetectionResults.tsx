'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Prediction {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
}

interface DetectionResultsProps {
    predictions: Prediction[];
}

export default function DetectionResults({ predictions }: DetectionResultsProps) {
    if (predictions.length === 0) {
        return (
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Detection Results</CardTitle>
                    <CardDescription>No containers detected in this image</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const getConfidenceBadgeVariant = (confidence: number) => {
        if (confidence >= 0.8) return 'default';
        if (confidence >= 0.6) return 'secondary';
        return 'outline';
    };

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle>Detection Results</CardTitle>
                <CardDescription>
                    Found {predictions.length} container{predictions.length !== 1 ? 's' : ''}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold">#</TableHead>
                                <TableHead className="font-semibold">Class</TableHead>
                                <TableHead className="font-semibold">Confidence</TableHead>
                                <TableHead className="font-semibold">X</TableHead>
                                <TableHead className="font-semibold">Y</TableHead>
                                <TableHead className="font-semibold">Width</TableHead>
                                <TableHead className="font-semibold">Height</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {predictions.map((pred, index) => (
                                <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-medium">
                                            {pred.class}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getConfidenceBadgeVariant(pred.confidence)}>
                                            {(pred.confidence * 100).toFixed(1)}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{Math.round(pred.x)}</TableCell>
                                    <TableCell className="text-gray-600">{Math.round(pred.y)}</TableCell>
                                    <TableCell className="text-gray-600">{Math.round(pred.width)}</TableCell>
                                    <TableCell className="text-gray-600">{Math.round(pred.height)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
