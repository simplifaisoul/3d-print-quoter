import { Suspense, useMemo, useRef, useEffect } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

function STLModel({ file }) {
    const { camera } = useThree()
    const groupRef = useRef()

    const geometry = useMemo(() => {
        if (!file) return null
        const loader = new STLLoader()
        const url = URL.createObjectURL(file)
        return { url, loader }
    }, [file])

    const geom = useLoader(STLLoader, geometry?.url || '')

    useEffect(() => {
        if (geom && groupRef.current) {
            // Center geometry and compute normals for good lighting
            geom.computeBoundingBox()
            geom.center()
            geom.computeVertexNormals()

            // Auto-frame camera based on model size
            const box = new THREE.Box3().setFromObject(groupRef.current)
            const size = box.getSize(new THREE.Vector3())
            const center = box.getCenter(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const fov = camera.fov * (Math.PI / 180)
            const distance = maxDim / (2 * Math.tan(fov / 2)) * 2.2

            // Position camera at a nice angle to show depth
            camera.position.set(distance * 0.8, distance * 0.6, distance * 0.8)
            camera.lookAt(center)
            camera.near = 0.01
            camera.far = distance * 10
            camera.updateProjectionMatrix()
        }
    }, [geom, camera])

    if (!geom) return null

    return (
        <group ref={groupRef}>
            {/* Main solid mesh with enhanced material */}
            <mesh geometry={geom} castShadow receiveShadow>
                <meshPhysicalMaterial
                    color="#00c8ff"
                    metalness={0.15}
                    roughness={0.35}
                    clearcoat={0.4}
                    clearcoatRoughness={0.2}
                    envMapIntensity={1.2}
                />
            </mesh>
            {/* Wireframe overlay for edge visibility on flat/thin parts */}
            <mesh geometry={geom}>
                <meshBasicMaterial
                    color="#00e5ff"
                    wireframe
                    transparent
                    opacity={0.06}
                />
            </mesh>
        </group>
    )
}

function LoadingSpinner() {
    return (
        <mesh>
            <torusGeometry args={[0.5, 0.08, 16, 48]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
        </mesh>
    )
}

export default function ModelViewer({ file }) {
    if (!file) return null

    const ext = file.name.split('.').pop().toLowerCase()
    if (ext !== 'stl') {
        return (
            <div className="model-viewer-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🧊</div>
                    <div style={{ fontSize: '0.85rem' }}>3D preview available for STL files</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Your .{ext} file will be processed for quoting</div>
                </div>
            </div>
        )
    }

    return (
        <div className="model-viewer-container">
            <Canvas
                shadows
                camera={{ position: [3, 2, 3], fov: 45 }}
                gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
                style={{ background: 'linear-gradient(180deg, #0a0a18 0%, #0d1020 50%, #0a0f1a 100%)' }}
            >
                {/* Enhanced lighting for better model visibility */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow />
                <directionalLight position={[-4, 3, -4]} intensity={0.4} color="#4488ff" />
                <pointLight position={[0, 10, 0]} intensity={0.6} color="#00d4ff" />
                <pointLight position={[-5, -2, 5]} intensity={0.3} color="#0066ff" />
                {/* Rim light for edge definition */}
                <spotLight
                    position={[-8, 4, -6]}
                    intensity={0.5}
                    color="#00aaff"
                    angle={0.5}
                    penumbra={0.8}
                />

                <Suspense fallback={<LoadingSpinner />}>
                    <Center>
                        <STLModel file={file} />
                    </Center>
                    <ContactShadows
                        position={[0, -0.5, 0]}
                        opacity={0.3}
                        scale={20}
                        blur={2.5}
                        far={6}
                        color="#0044aa"
                    />
                </Suspense>

                <OrbitControls
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={0.5}
                    maxDistance={200}
                    enablePan={true}
                    autoRotate
                    autoRotateSpeed={1.5}
                />

                <gridHelper args={[30, 30, '#1a1a3e', '#111128']} position={[0, -0.5, 0]} />
            </Canvas>

            <div className="viewer-controls-hint">
                <span>🖱️ Rotate</span>
                <span>⚙️ Scroll to zoom</span>
                <span>⇧ Shift+drag to pan</span>
            </div>
        </div>
    )
}
