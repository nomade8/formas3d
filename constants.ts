
import type { Vector3Array } from './types';

export const DEFAULT_POSITION: Vector3Array = [0, 0.5, 0]; // Adjusted for typical primitive height
export const DEFAULT_ROTATION: Vector3Array = [0, 0, 0];
export const DEFAULT_SCALE: Vector3Array = [1, 1, 1];

export const PLACEHOLDER_MODEL_URLS = {
  USER_MODEL_CASA: "/models/modulos_casa.glb", 
  HOUSE_2: "https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/c914e926289e9f3900760855215bab2arch_CreativeCommons/2.0/Duck/glTF-Binary/Duck.glb",
  HOUSE_3: "https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/c914e926289e9f3900760855215bab2arch_CreativeCommons/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
  USER_MODEL_1: "/models/modulos_sala.glb",
  USER_MODEL_2: "/models/modulos_redondo.glb",
};

export const RAD2DEG = 180 / Math.PI;
export const DEG2RAD = Math.PI / 180;

// URL para a imagem equirretangular do skydome foi removida.
