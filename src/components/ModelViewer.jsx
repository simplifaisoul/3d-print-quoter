import { Suspense, useMemo, useRef, useEffect } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

function STLModel({ file }) {
    const { camera } = useThree()
    const meshRef = useRef()

    const geometry = useMemo(() => {
        if (!file) return null
        const loader = new STLLoader()
        const url = URL.createObjectURL(file)
        return { url, loader }
    }, [file])

    const geom = useLoader(STLLoader, geometry?.url || '')

    useEffect(() => {
        if (geom && meshRef.current) {
            // Center geometry
            geom.computeBoundingBox()
            geom.center()

            // Auto-frame camera
            const box = new THREE.Box3().setFromObject(meshRef.current)
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const fov = camera.fov * (Math.PI / 180)
            const distance = maxDim / (2 * Math.tan(fov / 2)) * 1.8

            camera.position.set(distance * 0.7, distance * 0.5, distance * 0.7)
            camera.lookAt(0, 0, 0)
            camera.updateProjectionMatrix()
        }
    }, [geom, camera])

    if (!geom) return null

    return (
        <mesh ref={meshRef} geometry={geom} castShadow receiveShadow>
            <meshStandardMaterial
                color="#00d4ff"
                metalness={0.3}
                roughness={0.4}
                envMapIntensity={0.8}
            />
        </mesh>
    )
}

function Fallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#333" wireframe />
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
                camera={{ position: [3, 2, 3], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: '#0d0d14' }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
                <directionalLight position={[-5, 3, -5]} intensity={0.3} />
                <pointLight position={[0, 10, 0]} intensity={0.5} color="#00d4ff" />

                <Suspense fallback={<Fallback />}>
                    <Center>
                        <STLModel file={file} />
                    </Center>
                    <ContactShadows
                        position={[0, -0.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2}
                        far={4}
                        color="#00d4ff"
                    />
                </Suspense>

                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={1}
                    maxDistance={100}
                    enablePan={true}
                />

                <gridHelper args={[20, 20, '#1a1a2e', '#111122']} position={[0, -0.5, 0]} />
            </Canvas>

            <div className="viewer-controls-hint">
                <span>🖱️ Rotate</span>
                <span>⚙️ Scroll to zoom</span>
                <span>⇧ Shift+drag to pan</span>
            </div>
        </div>
    )
}
