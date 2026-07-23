import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";

function StlMesh({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);

  const centered = useMemo(() => {
    const g = geometry.clone();
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    const center = new THREE.Vector3();
    bb.getCenter(center);
    g.translate(-center.x, -center.y, -center.z);
    g.computeVertexNormals();
    return g;
  }, [geometry]);

  const scale = useMemo(() => {
    centered.computeBoundingBox();
    const bb = centered.boundingBox!;
    const size = new THREE.Vector3();
    bb.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return 40 / maxDim; // fit in ~40 unit box
  }, [centered]);

  useEffect(() => () => centered.dispose(), [centered]);

  return (
    <mesh ref={meshRef} geometry={centered} scale={scale} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#22d3ee" metalness={0.15} roughness={0.55} flatShading />
    </mesh>
  );
}

export default function ModelViewer3D({ url }: { url: string }) {
  return (
    <Canvas
      shadows
      camera={{ position: [55, 45, 55], fov: 40, near: 0.1, far: 1000 }}
      style={{ background: "transparent" }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0a1220"]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[40, 60, 30]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-40, 20, -30]} intensity={0.35} color="#22d3ee" />
      <Grid
        args={[200, 200]}
        cellSize={5}
        cellThickness={0.5}
        cellColor="#1e2a3d"
        sectionSize={25}
        sectionThickness={1}
        sectionColor="#22d3ee"
        fadeDistance={180}
        fadeStrength={1}
        infiniteGrid
        position={[0, -20, 0]}
      />
      <Suspense fallback={null}>
        <StlMesh url={url} />
      </Suspense>
      <OrbitControls enableDamping dampingFactor={0.1} makeDefault />
    </Canvas>
  );
}
