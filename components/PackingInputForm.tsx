'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Package, Plus, Trash2, Box as BoxIcon } from 'lucide-react';
import { Box, generateColor } from '@/lib/binPacking3D';

interface PackingInputFormProps {
    onPack: (containerDims: { width: number; height: number; depth: number }, boxes: Box[]) => void;
}

export default function PackingInputForm({ onPack }: PackingInputFormProps) {
    const [containerDims, setContainerDims] = useState({
        width: 200,
        height: 150,
        depth: 150
    });

    const [boxes, setBoxes] = useState<Box[]>([
        { id: 'box-1', width: 50, height: 40, depth: 30, volume: 60000, color: generateColor(0), name: 'Box 1' },
        { id: 'box-2', width: 40, height: 30, depth: 30, volume: 36000, color: generateColor(1), name: 'Box 2' },
        { id: 'box-3', width: 60, height: 50, depth: 40, volume: 120000, color: generateColor(2), name: 'Box 3' },
    ]);

    const [newBox, setNewBox] = useState({
        width: 30,
        height: 30,
        depth: 30
    });

    const addBox = () => {
        const box: Box = {
            id: `box-${Date.now()}`,
            width: newBox.width,
            height: newBox.height,
            depth: newBox.depth,
            volume: newBox.width * newBox.height * newBox.depth,
            color: generateColor(boxes.length),
            name: `Box ${boxes.length + 1}`
        };
        setBoxes([...boxes, box]);
    };

    const removeBox = (id: string) => {
        setBoxes(boxes.filter(box => box.id !== id));
    };

    const handlePack = () => {
        onPack(containerDims, boxes);
    };

    const generateRandomBoxes = (count: number) => {
        const newBoxes: Box[] = [];
        const sizes = [
            { w: 30, h: 30, d: 30 },
            { w: 40, h: 30, d: 30 },
            { w: 50, h: 40, d: 30 },
            { w: 60, h: 50, d: 40 },
            { w: 25, h: 25, d: 60 },
        ];

        for (let i = 0; i < count; i++) {
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            newBoxes.push({
                id: `box-${Date.now()}-${i}`,
                width: size.w,
                height: size.h,
                depth: size.d,
                volume: size.w * size.h * size.d,
                color: generateColor(i),
                name: `Box ${i + 1}`
            });
        }
        setBoxes(newBoxes);
    };

    return (
        <div className="space-y-4">
            {/* Container Dimensions */}
            <Card className="border-2 border-[#203864]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#203864]">
                        <Package className="w-5 h-5" />
                        Container Dimensions
                    </CardTitle>
                    <CardDescription>Define the container size (in cm)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="containerWidth">Width (cm)</Label>
                            <Input
                                id="containerWidth"
                                type="number"
                                value={containerDims.width}
                                onChange={(e) => setContainerDims({ ...containerDims, width: Number(e.target.value) })}
                                min="10"
                                className="focus:ring-[#203864]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="containerHeight">Height (cm)</Label>
                            <Input
                                id="containerHeight"
                                type="number"
                                value={containerDims.height}
                                onChange={(e) => setContainerDims({ ...containerDims, height: Number(e.target.value) })}
                                min="10"
                                className="focus:ring-[#203864]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="containerDepth">Depth (cm)</Label>
                            <Input
                                id="containerDepth"
                                type="number"
                                value={containerDims.depth}
                                onChange={(e) => setContainerDims({ ...containerDims, depth: Number(e.target.value) })}
                                min="10"
                                className="focus:ring-[#203864]"
                            />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Volume: {(containerDims.width * containerDims.height * containerDims.depth / 1000).toFixed(1)} liters
                    </p>
                </CardContent>
            </Card>

            {/* Add New Box */}
            <Card className="border-2 border-[#FF5722]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#FF5722]">
                        <BoxIcon className="w-5 h-5" />
                        Add Boxes
                    </CardTitle>
                    <CardDescription>Add boxes to pack into the container</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="boxWidth">Width</Label>
                            <Input
                                id="boxWidth"
                                type="number"
                                value={newBox.width}
                                onChange={(e) => setNewBox({ ...newBox, width: Number(e.target.value) })}
                                min="1"
                                className="focus:ring-[#FF5722]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="boxHeight">Height</Label>
                            <Input
                                id="boxHeight"
                                type="number"
                                value={newBox.height}
                                onChange={(e) => setNewBox({ ...newBox, height: Number(e.target.value) })}
                                min="1"
                                className="focus:ring-[#FF5722]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="boxDepth">Depth</Label>
                            <Input
                                id="boxDepth"
                                type="number"
                                value={newBox.depth}
                                onChange={(e) => setNewBox({ ...newBox, depth: Number(e.target.value) })}
                                min="1"
                                className="focus:ring-[#FF5722]"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                onClick={addBox}
                                className="w-full bg-[#FF5722] hover:bg-[#E64A19]"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-600 mb-3">Or generate random boxes:</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={() => generateRandomBoxes(5)}
                                variant="outline"
                                className="border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white transition-colors"
                            >
                                Generate 5 Boxes
                            </Button>
                            <Button
                                onClick={() => generateRandomBoxes(10)}
                                variant="outline"
                                className="border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white transition-colors"
                            >
                                Generate 10 Boxes
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Boxes List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Boxes to Pack ({boxes.length})</span>
                        {boxes.length > 0 && (
                            <Button
                                onClick={() => setBoxes([])}
                                variant="destructive"
                                size="sm"
                            >
                                Clear All
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {boxes.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No boxes added yet</p>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {boxes.map((box, index) => (
                                <div
                                    key={box.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-6 h-6 rounded"
                                            style={{ backgroundColor: box.color }}
                                        />
                                        <div>
                                            <p className="font-medium">{box.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {box.width} × {box.height} × {box.depth} cm
                                                ({(box.volume / 1000).toFixed(1)}L)
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => removeBox(box.id)}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pack Button */}
            <Button
                onClick={handlePack}
                disabled={boxes.length === 0}
                className="w-full bg-[#203864] hover:bg-[#152647] h-12 text-lg"
            >
                <Package className="w-5 h-5 mr-2" />
                Calculate 3D Packing
            </Button>
        </div>
    );
}
