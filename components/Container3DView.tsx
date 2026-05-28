'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Box as ThreeBox, Text } from '@react-three/drei';
import { PlacedBox, Container } from '@/lib/binPacking3D';
import { AlertCircle } from 'lucide-react';

interface Container3DViewProps {
    container: Container;
    placedBoxes: PlacedBox[];
}

// Individual Box Component
function BoxMesh({ box }: { box: PlacedBox }) {
    // Center the box at its position
    const posX = box.x + box.width / 2;
    const posY = box.y + box.height / 2;
    const posZ = box.z + box.depth / 2;

    return (
        <group>
            <ThreeBox
                args={[box.width, box.height, box.depth]}
                position={[posX, posY, posZ]}
            >
                <meshStandardMaterial
                    color={box.color || '#4ECDC4'}
                    transparent
                    opacity={0.8}
                    roughness={0.3}
                    metalness={0.1}
                />
            </ThreeBox>
            {/* Wireframe outline */}
            <ThreeBox
                args={[box.width, box.height, box.depth]}
                position={[posX, posY, posZ]}
            >
                <meshBasicMaterial color="#000000" wireframe />
            </ThreeBox>
        </group>
    );
}

// Container Wireframe
function ContainerMesh({ container }: { container: Container }) {
    const posX = container.width / 2;
    const posY = container.height / 2;
    const posZ = container.depth / 2;

    return (
        <group>
            {/* Container wireframe */}
            <ThreeBox
                args={[container.width, container.height, container.depth]}
                position={[posX, posY, posZ]}
            >
                <meshBasicMaterial
                    color="#203864"
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </ThreeBox>
            {/* Container edges for better visibility */}
            <lineSegments>
                <edgesGeometry
                    attach="geometry"
                    args={[
                        new THREE.BoxGeometry(
                            container.width,
                            container.height,
                            container.depth
                        )
                    ]}
                />
                <lineBasicMaterial attach="material" color="#203864" linewidth={2} />
            </lineSegments>
            {/* Dimension labels */}
            <Text
                position={[posX, -10, posZ]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={8}
                color="#203864"
                anchorX="center"
                anchorY="middle"
            >
                {`${container.width} × ${container.depth} cm`}
            </Text>
        </group>
    );
}

export default function Container3DView({ container, placedBoxes }: Container3DViewProps) {
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const canvasRef = useRef<HTMLDivElement>(null);

    // Calculate camera position based on container size
    const maxDim = Math.max(container.width, container.height, container.depth);
    const cameraDistance = maxDim * 2;

    // Handle WebGL context loss
    useEffect(() => {
        const handleContextLost = (event: Event) => {
            event.preventDefault();
            console.warn('WebGL context lost. Attempting to restore...');
            setErrorMessage('3D rendering context lost. Attempting to restore...');
        };

        const handleContextRestored = () => {
            console.log('WebGL context restored');
            setHasError(false);
            setErrorMessage('');
        };

        const canvas = canvasRef.current?.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('webglcontextlost', handleContextLost);
            canvas.addEventListener('webglcontextrestored', handleContextRestored);

            return () => {
                canvas.removeEventListener('webglcontextlost', handleContextLost);
                canvas.removeEventListener('webglcontextrestored', handleContextRestored);
            };
        }
    }, []);

    // Error boundary fallback
    if (hasError) {
        return (
            <div className="w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-[#203864] flex items-center justify-center">
                <div className="text-center p-8">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3D Rendering Error</h3>
                    <p className="text-gray-600 mb-4">{errorMessage || 'Unable to render 3D visualization'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#203864] text-white rounded-lg hover:bg-[#2d4a7c] transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div ref={canvasRef} className="w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-[#203864] overflow-hidden">
            <Canvas
                key={`canvas-${placedBoxes.length}`}
                camera={{
                    position: [cameraDistance, cameraDistance * 0.8, cameraDistance],
                    fov: 50
                }}
                gl={{
                    antialias: true,
                    alpha: false,
                    preserveDrawingBuffer: false,
                    powerPreference: 'default'
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor('#f3f4f6', 1);
                    console.log('Canvas created successfully');
                }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[100, 100, 100]}
                    intensity={0.5}
                />
                <directionalLight
                    position={[-100, 50, -100]}
                    intensity={0.3}
                />

                {/* Grid floor */}
                <Grid
                    args={[container.width * 2, container.depth * 2]}
                    cellSize={10}
                    cellThickness={0.5}
                    cellColor="#6B7280"
                    sectionSize={50}
                    sectionThickness={1}
                    sectionColor="#203864"
                    fadeDistance={1000}
                    fadeStrength={1}
                    followCamera={false}
                    position={[container.width / 2, -0.1, container.depth / 2]}
                />

                {/* Container */}
                <ContainerMesh container={container} />

                {/* Placed Boxes */}
                {placedBoxes.map((box) => (
                    <BoxMesh key={box.id} box={box} />
                ))}

                {/* Axes helper */}
                <axesHelper args={[50]} />

                {/* Camera controls */}
                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    zoomSpeed={0.8}
                    panSpeed={0.5}
                    minDistance={50}
                    maxDistance={cameraDistance * 3}
                    target={[container.width / 2, container.height / 2, container.depth / 2]}
                />
            </Canvas>

            {/* Controls hint */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-xs text-gray-700">
                <p className="font-semibold mb-1">🖱️ Controls:</p>
                <p>• Left click + drag: Rotate</p>
                <p>• Right click + drag: Pan</p>
                <p>• Scroll: Zoom in/out</p>
            </div>
        </div>
    );
}
