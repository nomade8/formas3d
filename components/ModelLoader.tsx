
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Group } from 'three';
import * as THREE from 'three'; // Import full THREE namespace for types
import { useFrame } from '@react-three/fiber'; // Removed unused type ThreeElements

interface ModelLoaderProps {
  url: string;
  color?: string; 
  opacity?: number; // Optional opacity for the model
  onLoaded?: (model: Group) => void;
}

export const ModelLoader: React.FC<ModelLoaderProps> = ({ url, color, opacity, onLoaded }) => {
  // console.log('Attempting to load model from URL:', url, 'with color:', color, 'opacity:', opacity);
  useGLTF.preload(url);
  const gltf = useGLTF(url);
  
  const [displayScene, setDisplayScene] = useState<Group | null>(null);

  useEffect(() => {
    const instanceScene = gltf.scene.clone(true); 

    instanceScene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const meshNode = node as THREE.Mesh;
        
        const processMaterial = (material: THREE.Material): THREE.Material => {
          const newMaterial = material.clone();
          
          // Apply color tint if specified
          if (color && color.trim() !== '') {
            if ('color' in newMaterial && (newMaterial as any).color instanceof THREE.Color) {
              ((newMaterial as any) as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial).color.set(color);
            }
          }

          // Apply opacity if specified
          if (opacity !== undefined) {
            if ('opacity' in newMaterial) {
              (newMaterial as any).opacity = opacity;
            }
            if ('transparent' in newMaterial) {
              (newMaterial as any).transparent = opacity < 1;
            }
          } else { // Ensure default opacity is 1 if not specified
             if ('opacity' in newMaterial) {
              (newMaterial as any).opacity = 1;
            }
            if ('transparent' in newMaterial) {
              (newMaterial as any).transparent = false;
            }
          }
          
          return newMaterial;
        };

        if (meshNode.material && !Array.isArray(meshNode.material)) {
          meshNode.material = processMaterial(meshNode.material as THREE.Material);
        } 
        else if (Array.isArray(meshNode.material)) {
          meshNode.material = meshNode.material.map(mat => mat ? processMaterial(mat) : null).filter(Boolean) as THREE.Material[];
        }
      }
    });

    setDisplayScene(instanceScene);
    
    if (onLoaded) {
      onLoaded(instanceScene);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [gltf.scene, color, opacity, onLoaded]); 


  if (!displayScene) {
    return <mesh><boxGeometry args={[0.1,0.1,0.1]} /><meshBasicMaterial color="red" wireframe /></mesh>;
  }

  return <primitive object={displayScene} />;
};