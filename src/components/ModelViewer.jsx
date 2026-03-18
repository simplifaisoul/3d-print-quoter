import { Suspense, useMemo, useRef, useEffect } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

function STLModel({ file }) {
    const { camera } = useThree()
    const meshRef = useRef()

    const objectUrl = useMemo(() => {
        if (!file) return null
        return URL.createObjectURL(file)
    }, [file])

    const geom = useLoader(STLLoader, objectUrl || '')

    useEffect(() => {
        if (geom && meshRef.current) {
            // Center and prepare geometry
            geom.computeBoundingBox()
            geom.center()
            geom.computeVertexNormals()

            // Auto-frame camera to fit model
            const box = new THREE.Box3().setFromObject(meshRef.current)
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const fov = camera.fov * (Math.PI / 180)
            const distance = maxDim / (2 * Math.tan(fov / 2)) * 2.5

            camera.position.set(distance * 0.7, distance * 0.5, distance * 0.7)
            camera.lookAt(0, 0, 0)
            camera.near = 0.01
            camera.far = distance * 20
            camera.updateProjectionMatrix()
        }
    }, [geom, camera])

    useEffect(() => {
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [objectUrl])

    if (!geom) return null

    return (
        <mesh ref={meshRef} geometry={geom} castShadow receiveShadow>
            <meshStandardMaterial
                color="#00e5ff"
                emissive="#004466"
                metalness={0.2}
                roughness={0.3}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}

function LoadingFallback() {
    return (
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#1a3a4a" />
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
                gl={{ antialias: true }}
                style={{ background: '#0c0e1a' }}
            >
                {/* Bright, even lighting so the model is clearly visible */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow color="#ffffff" />
                <directionalLight position={[-3, 5, -3]} intensity={0.6} color="#aaddff" />
                <directionalLight position={[0, -3, 5]} intensity={0.3} color="#88bbff" />

                <Suspense fallback={<LoadingFallback />}>
                    <Center>
                        <STLModel file={file} />
                    </Center>
                    <ContactShadows
                        position={[0, -0.5, 0]}
                        opacity={0.25}
                        scale={20}
                        blur={2}
                        far={6}
                        color="#003366"
                    />
                </Suspense>

                <OrbitControls
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={0.5}
                    maxDistance={200}
                    enablePan
                    autoRotate
                    autoRotateSpeed={1.5}
                />
            </Canvas>

            <div className="viewer-controls-hint">
                <span>🖱️ Rotate</span>
                <span>⚙️ Scroll to zoom</span>
                <span>⇧ Shift+drag to pan</span>
            </div>
        </div>
    )
}
