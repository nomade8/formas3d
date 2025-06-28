import React, { useRef, useCallback, Suspense, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, GizmoHelper, GizmoViewcube, Sky } from '@react-three/drei';
import * as THREE from 'three';
import type { SceneObjectType, ObjectProperties, Vector3Array, GizmoMode, LightProperties, TerrainProperties, SkyProperties } from '../types';
import { RenderableObject } from './RenderableObject';
import { perlinNoise } from '../utils/noise';

interface SceneCanvasProps {
  sceneObjects: SceneObjectType[];
  selectedObjectId: string | null;
  selectedObjectRef: THREE.Object3D | null; 
  lightProps: LightProperties;
  terrainProps: TerrainProperties;
  skyProps: SkyProperties;
  onSelectObject: (id: string, ref: THREE.Object3D) => void;
  onDeselect: () => void;
  onUpdateObjectProperties: (id: string, newProps: Partial<ObjectProperties>) => void;
  gizmoMode: GizmoMode;
}

const NoisyTerrain: React.FC<{ terrainProps: TerrainProperties; onClick: (event: any) => void }> = ({ terrainProps, onClick }) => {
    const geometry = useMemo(() => new THREE.PlaneGeometry(50, 50, 128, 128), []);

    useEffect(() => {
        const pos = geometry.attributes.position;
        const { noiseStrength, noiseScale } = terrainProps;

        if (noiseStrength === 0) {
            // Check if it's already flat to avoid unnecessary updates
            if (pos.getZ(0) === 0 && pos.getZ(pos.count - 1) === 0) return;
            for (let i = 0; i < pos.count; i++) {
                pos.setZ(i, 0);
            }
        } else {
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const effectiveScale = noiseScale || 1;
                const noise = perlinNoise(x / effectiveScale, y / effectiveScale, 0);
                pos.setZ(i, noise * noiseStrength);
            }
        }
        
        pos.needsUpdate = true;
        geometry.computeVertexNormals();

    }, [geometry, terrainProps.noiseStrength, terrainProps.noiseScale]);

    // This effect only handles color changes, to avoid re-calculating noise.
    const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
    useEffect(() => {
        if(materialRef.current) {
            materialRef.current.color.set(terrainProps.color);
        }
    }, [terrainProps.color]);

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
            castShadow
            onClick={onClick}
            geometry={geometry}
        >
            <meshStandardMaterial ref={materialRef} color={terrainProps.color} />
        </mesh>
    );
};


const SceneContent: React.FC<Omit<SceneCanvasProps, 'selectedObjectRef'> & { activeGizmoTarget: THREE.Object3D | null }> = ({
  sceneObjects,
  selectedObjectId,
  activeGizmoTarget,
  lightProps,
  terrainProps,
  skyProps,
  onSelectObject,
  onDeselect,
  onUpdateObjectProperties,
  gizmoMode,
}) => {
  const { camera, gl } = useThree(); 

  const handleTransformEnd = useCallback(() => {
    if (activeGizmoTarget && selectedObjectId) {
      const obj = activeGizmoTarget;
      const newProps: Partial<ObjectProperties> = {
        position: obj.position.toArray() as Vector3Array,
        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z] as Vector3Array,
        scale: obj.scale.toArray() as Vector3Array,
      };
      onUpdateObjectProperties(selectedObjectId, newProps);
    }
  }, [activeGizmoTarget, selectedObjectId, onUpdateObjectProperties]);

  const handleBackgroundClick = (event: any) => {
    // Stop propagation to avoid this click being caught by the main div's deselect
    event.stopPropagation();
    onDeselect();
  };
  
  const sharedSunPosition = lightProps.position as THREE.Vector3Tuple;

  return (
    <>
      <ambientLight intensity={Math.PI / 4} /> 
      <directionalLight 
        position={sharedSunPosition} 
        intensity={lightProps.intensity}
        color={lightProps.color}
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <OrbitControls makeDefault />
      
      <NoisyTerrain terrainProps={terrainProps} onClick={handleBackgroundClick} />

      {/* The Grid component has been removed to resolve visual artifacts and simplify the scene, 
          ensuring only a single ground plane is rendered. */}

      {/* Enhanced Sky parameters for a more beautiful and realistic look */}
      <Sky 
        distance={450000}
        inclination={skyProps.inclination}
        azimuth={skyProps.azimuth}
        mieCoefficient={0.004}
        mieDirectionalG={0.75}
        rayleigh={skyProps.rayleigh}
        turbidity={skyProps.turbidity}
      />
      
      {sceneObjects.map((obj) => (
        <RenderableObject
          key={obj.id}
          objectData={obj}
          onSelect={onSelectObject}
        />
      ))}

      {activeGizmoTarget && (
        <TransformControls
          object={activeGizmoTarget}
          mode={gizmoMode}
          onMouseUp={handleTransformEnd}
          size={0.75}
        />
      )}
      
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewcube />
      </GizmoHelper>
    </>
  );
};


export const SceneCanvas: React.FC<SceneCanvasProps> = (props) => {
  return (
    <div className="flex-1 w-full h-full relative bg-gray-700" onClick={(e) => {
        if (e.target === e.currentTarget) {
            props.onDeselect();
        }
    }}>
      <Canvas
        shadows 
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ logarithmicDepthBuffer: true }}
        onClick={(e) => e.stopPropagation()} 
      >
        <Suspense fallback={null}> 
          <SceneContent {...props} activeGizmoTarget={props.selectedObjectRef} />
        </Suspense>
      </Canvas>
    </div>
  );
};