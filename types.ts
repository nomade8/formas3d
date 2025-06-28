import type { Object3D, Euler, Vector3 } from 'three';

export enum PrimitiveType {
  BOX = 'box',
  CYLINDER = 'cylinder',
  SPHERE = 'sphere',
  PYRAMID = 'pyramid', // Added PYRAMID
}

export type Vector3Array = [number, number, number];

export interface LightProperties {
  intensity: number;
  color: string;
  position: Vector3Array;
}

export interface TerrainProperties {
  color: string;
  noiseStrength: number;
  noiseScale: number;
}

export type GlobalPropType = 'light' | 'terrain';

export interface ObjectProperties {
  position: Vector3Array;
  rotation: Vector3Array; // Euler angles in radians
  scale: Vector3Array;
  color?: string; // Added for model tinting
  opacity?: number; // Added for object opacity
}

export interface BaseSceneObject extends ObjectProperties {
  id: string;
  name: string;
}

export interface PrimitiveSceneObject extends BaseSceneObject {
  type: 'primitive';
  primitiveType: PrimitiveType;
  color: string; // Primitives always have a color
  opacity: number; // Primitives always have an opacity
}

export interface ModelSceneObject extends BaseSceneObject {
  type: 'model';
  modelUrl: string;
  color?: string; 
  opacity?: number; // Models can have an optional opacity
}

export type SceneObjectType = PrimitiveSceneObject | ModelSceneObject;

// Tipo para o modo do Gizmo
export type GizmoMode = 'translate' | 'rotate' | 'scale';

export interface EditableObjectProperties {
  color?: string; 
  opacity?: string; // Opacity as string for input range, will be parsed
}