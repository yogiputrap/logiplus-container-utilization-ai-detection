// 3D Bin Packing Algorithm - First Fit Decreasing (FFD)

export interface Box {
    id: string;
    width: number;
    height: number;
    depth: number;
    volume: number;
    color?: string;
    name?: string;
}

export interface PlacedBox extends Box {
    x: number;
    y: number;
    z: number;
    rotated?: boolean;
}

export interface Container {
    width: number;
    height: number;
    depth: number;
    volume: number;
}

export interface PackingResult {
    placedBoxes: PlacedBox[];
    unplacedBoxes: Box[];
    efficiency: number;
    usedVolume: number;
    totalVolume: number;
    containerVolume: number;
}

interface Space {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
}

// Generate random color for box
export const generateColor = (index: number): string => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#AAB7B8',
        '#FF5722', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0'
    ];
    return colors[index % colors.length];
};

// Check if box fits in space
const canFit = (box: Box, space: Space): boolean => {
    return box.width <= space.width &&
        box.height <= space.height &&
        box.depth <= space.depth;
};

// Try different rotations of the box
const getRotations = (box: Box): Box[] => {
    return [
        { ...box, width: box.width, height: box.height, depth: box.depth },
        { ...box, width: box.width, height: box.depth, depth: box.height },
        { ...box, width: box.height, height: box.width, depth: box.depth },
        { ...box, width: box.height, height: box.depth, depth: box.width },
        { ...box, width: box.depth, height: box.width, depth: box.height },
        { ...box, width: box.depth, height: box.height, depth: box.width },
    ];
};

// Main 3D Bin Packing Algorithm
export const pack3D = (container: Container, boxes: Box[]): PackingResult => {
    // Sort boxes by volume (largest first) - First Fit Decreasing
    const sortedBoxes = [...boxes].sort((a, b) => b.volume - a.volume);

    const placedBoxes: PlacedBox[] = [];
    const unplacedBoxes: Box[] = [];
    const spaces: Space[] = [{
        x: 0,
        y: 0,
        z: 0,
        width: container.width,
        height: container.height,
        depth: container.depth
    }];

    for (const box of sortedBoxes) {
        let placed = false;

        // Try to place box in available spaces
        for (let i = 0; i < spaces.length && !placed; i++) {
            const space = spaces[i];

            // Try all rotations
            const rotations = getRotations(box);
            for (const rotatedBox of rotations) {
                if (canFit(rotatedBox, space)) {
                    // Place the box
                    const placedBox: PlacedBox = {
                        ...rotatedBox,
                        x: space.x,
                        y: space.y,
                        z: space.z,
                        rotated: rotatedBox.width !== box.width ||
                            rotatedBox.height !== box.height ||
                            rotatedBox.depth !== box.depth
                    };
                    placedBoxes.push(placedBox);

                    // Remove used space and create new spaces
                    spaces.splice(i, 1);

                    // Create new spaces around the placed box
                    // Space to the right
                    if (space.width > rotatedBox.width) {
                        spaces.push({
                            x: space.x + rotatedBox.width,
                            y: space.y,
                            z: space.z,
                            width: space.width - rotatedBox.width,
                            height: space.height,
                            depth: space.depth
                        });
                    }

                    // Space above
                    if (space.height > rotatedBox.height) {
                        spaces.push({
                            x: space.x,
                            y: space.y + rotatedBox.height,
                            z: space.z,
                            width: rotatedBox.width,
                            height: space.height - rotatedBox.height,
                            depth: space.depth
                        });
                    }

                    // Space behind
                    if (space.depth > rotatedBox.depth) {
                        spaces.push({
                            x: space.x,
                            y: space.y,
                            z: space.z + rotatedBox.depth,
                            width: rotatedBox.width,
                            height: rotatedBox.height,
                            depth: space.depth - rotatedBox.depth
                        });
                    }

                    // Sort spaces by position (bottom-left-front first)
                    spaces.sort((a, b) => {
                        if (a.y !== b.y) return a.y - b.y;
                        if (a.z !== b.z) return a.z - b.z;
                        return a.x - b.x;
                    });

                    placed = true;
                    break;
                }
            }
        }

        if (!placed) {
            unplacedBoxes.push(box);
        }
    }

    // Calculate statistics
    const usedVolume = placedBoxes.reduce((sum, box) => sum + box.volume, 0);
    const totalVolume = boxes.reduce((sum, box) => sum + box.volume, 0);
    const efficiency = (usedVolume / container.volume) * 100;

    return {
        placedBoxes,
        unplacedBoxes,
        efficiency,
        usedVolume,
        totalVolume,
        containerVolume: container.volume
    };
};

// Generate sample boxes for demo
export const generateSampleBoxes = (count: number): Box[] => {
    const boxes: Box[] = [];
    const sizes = [
        { w: 30, h: 30, d: 30, name: 'Small Cube' },
        { w: 40, h: 30, d: 30, name: 'Medium Box' },
        { w: 50, h: 40, d: 30, name: 'Large Box' },
        { w: 60, h: 50, d: 40, name: 'Extra Large' },
        { w: 25, h: 25, d: 60, name: 'Long Box' },
    ];

    for (let i = 0; i < count; i++) {
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        boxes.push({
            id: `box-${i + 1}`,
            width: size.w,
            height: size.h,
            depth: size.d,
            volume: size.w * size.h * size.d,
            color: generateColor(i),
            name: `${size.name} #${i + 1}`
        });
    }

    return boxes;
};
