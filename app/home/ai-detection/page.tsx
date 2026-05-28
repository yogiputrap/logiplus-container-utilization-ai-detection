'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import BoundingBoxCanvas from '@/components/BoundingBoxCanvas';
import DetectionResults from '@/components/DetectionResults';
import UtilizationStats from '@/components/UtilizationStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, Loader2, AlertCircle } from 'lucide-react';

interface Prediction {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
}

export default function AIDetectionPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 800, height: 600 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasDetected, setHasDetected] = useState(false);

    const handleImageSelect = (file: File, preview: string) => {
        setSelectedFile(file);
        setImagePreview(preview);
        setPredictions([]);
        setHasDetected(false);
        setError(null);
    };

    const handleClear = () => {
        setSelectedFile(null);
        setImagePreview(null);
        setPredictions([]);
        setHasDetected(false);
        setError(null);
    };

    const handleDetect = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('/api/roboflow/detect', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Detection failed');
            }

            setPredictions(data.predictions || []);
            setImageSize(data.imageSize || { width: 800, height: 600 });
            setHasDetected(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setPredictions([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#203864] rounded-xl flex items-center justify-center">
                        <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-[#203864]">
                            AI Container Utilization
                        </h1>
                        <p className="text-lg text-gray-600">
                            Upload container image to detect cargo and calculate space utilization
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Upload Section */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Upload Image</CardTitle>
                    <CardDescription>
                        Select a container image to analyze
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ImageUpload
                        onImageSelect={handleImageSelect}
                        selectedImage={imagePreview}
                        onClear={handleClear}
                    />

                    {selectedFile && !hasDetected && (
                        <div className="mt-6 flex justify-center">
                            <Button
                                onClick={handleDetect}
                                disabled={loading}
                                size="lg"
                                className="bg-[#FF5722] hover:bg-[#E64A19] shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Detecting...
                                    </>
                                ) : (
                                    <>
                                        <Brain className="mr-2 h-5 w-5" />
                                        Detect Containers
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
                <div className="space-y-6">
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-full h-96 rounded-xl" />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Results Section */}
            {hasDetected && !loading && imagePreview && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Visualization */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Detection Visualization</CardTitle>
                            <CardDescription>
                                Bounding boxes overlaid on the original image
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BoundingBoxCanvas
                                imageUrl={imagePreview}
                                predictions={predictions}
                            />

                            <div className="mt-6 flex justify-center gap-3">
                                <Button
                                    onClick={handleDetect}
                                    disabled={loading}
                                    variant="outline"
                                >
                                    <Brain className="mr-2 h-4 w-4" />
                                    Detect Again
                                </Button>
                                <Button
                                    onClick={handleClear}
                                    variant="outline"
                                >
                                    Upload New Image
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Statistics and Results */}
                    <div className="space-y-6">
                        {/* Utilization Statistics */}
                        {predictions.length > 0 && (
                            <UtilizationStats predictions={predictions} imageSize={imageSize} />
                        )}

                        {/* Results Table */}
                        <DetectionResults predictions={predictions} />
                    </div>
                </div>
            )}

            {/* Info Card */}
            {!selectedFile && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-orange-50">
                    <CardHeader>
                        <CardTitle className="text-indigo-900">How to Use</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-gray-700">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                1
                            </div>
                            <p>Upload a container/truck image with cargo inside</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                2
                            </div>
                            <p>Click "Detect Containers" to analyze cargo and calculate utilization</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                3
                            </div>
                            <p>View utilization percentage, detected objects, and bounding boxes</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
