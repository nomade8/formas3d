
import React, { useRef, useMemo, Suspense } from 'react';
import type * as THREE_TYPES from 'three'; // Import THREE namespace for types like Object3D
import { BoxGeometry, CylinderGeometry, SphereGeometry, ConeGeometry, MeshStandardMaterial } from 'three'; // Added ConeGeometry
import { useFrame, type ThreeEvent } from '@react-three/fiber'; // Removed unused type ThreeElements
import type { SceneObjectType, PrimitiveSceneObject, ModelSceneObject, ObjectProperties } from '../types';
import { ModelLoader } from './ModelLoader';

interface RenderableObjectProps {
  objectData: SceneObjectType;
  onSelect: (id: string, ref: THREE_TYPES.Object3D) => void;
}

const usePrimitiveGeometry = (objectData: PrimitiveSceneObject) => {
  return useMemo(() => {
    switch (objectData.primitiveType) {
      case 'box':
        return new BoxGeometry(1, 1, 1);
      case 'cylinder':
        return new CylinderGeometry(0.5, 0.5, 1, 32);
      case 'sphere':
        return new SphereGeometry(0.5, 32, 32);
      case 'pyramid':
        // Creates a pyramid with a square base (side length 1, aligned with axes) and height 1.
        // Radius for ConeGeometry to achieve base side length of 1 after 45deg rotation: sqrt(0.5^2 + 0.5^2) = sqrt(0.5)
        const pyramidRadius = Math.sqrt(0.5); 
        const pyramidHeight = 1;
        const pyramidRadialSegments = 4;
        const geometry = new ConeGeometry(pyramidRadius, pyramidHeight, pyramidRadialSegments);
        geometry.rotateY(Math.PI / 4); // Rotate to align base sides with X and Z axes
        return geometry;
      default:
        return new BoxGeometry(1, 1, 1); // Fallback
    }
  }, [objectData.primitiveType]);
};

const PrimitiveMesh: React.FC<{ objectData: PrimitiveSceneObject; onClick: (event: ThreeEvent<MouseEvent>) => void }> = ({ objectData, onClick }) => {
  const geometry = usePrimitiveGeometry(objectData);
  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({ 
      color: objectData.color,
      opacity: objectData.opacity,
      transparent: objectData.opacity < 1,
    });
    return mat;
  }, [objectData.color, objectData.opacity]);
  
  return (
    <mesh
      geometry={geometry}
      material={material}
      onClick={onClick}
      castShadow
      receiveShadow
    >
    </mesh>
  );
};

const ModelMesh: React.FC<{ objectData: ModelSceneObject; onClick: (event: ThreeEvent<MouseEvent>) => void }> = ({ objectData, onClick }) => {
  return (
    <Suspense fallback={<mesh><boxGeometry args={[0.5,0.5,0.5]} /><meshStandardMaterial color="orange" wireframe /></mesh>}>
      <group onClick={onClick}> 
        <ModelLoader 
          url={objectData.modelUrl} 
          color={objectData.color} 
          opacity={objectData.opacity}
        />
      </group>
    </Suspense>
  );
};


export const RenderableObject: React.FC<RenderableObjectProps> = ({ objectData, onSelect }) => {
  const groupRef = useRef<THREE_TYPES.Group>(null!);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation(); 
    if (groupRef.current) {
      onSelect(objectData.id, groupRef.current);
    }
  };

  return (
    <group
      ref={groupRef}
      position={objectData.position as THREE_TYPES.Vector3Tuple}
      rotation={objectData.rotation as THREE_TYPES.EulerTuple}
      scale={objectData.scale as THREE_TYPES.Vector3Tuple}
      name={objectData.id} 
    >
      {objectData.type === 'primitive' ? (
        <PrimitiveMesh objectData={objectData as PrimitiveSceneObject} onClick={handleClick} />
      ) : (
        <ModelMesh objectData={objectData as ModelSceneObject} onClick={handleClick} />
      )}
    </group>
  );
};