import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';


const SneakerMesh = () => {
    const meshRef = useRef();
    const { scene } = useGLTF('/sneaker_1.glb');

    // Rotation animation
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={9}
            position={[0, -1, 0]}
            rotation={[0, -0.5, 0]}
        />
    );
};

const Sneaker3D = ({ selectedColor }) => {
    return (
        <div
            className={`shoe - ${selectedColor} `}
            style={{ width: '100%', height: '100%', transition: 'filter 0.3s ease' }}
        >
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 14], fov: 45 }} style={{ filter: 'brightness(1.1)' }}>
                <React.Suspense fallback={null}>
                    <ambientLight intensity={0.7} />
                    <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />

                    <SneakerMesh />

                    <Environment preset="city" />
                    <ContactShadows position={[0, -1.8, 0]} opacity={0.5} scale={10} blur={1.5} far={0.8} />

                    <OrbitControls enableZoom={false} enablePan={false} minDistance={5} maxDistance={20} />
                </React.Suspense>
            </Canvas>
        </div>
    );
};

useGLTF.preload('/sneaker_1.glb');
export default Sneaker3D;
