
import { RAD2DEG, DEG2RAD } from '../constants';
import type { Vector3Array } from '../types';

export const toDegrees = (radians: number): number => radians * RAD2DEG;
export const toRadians = (degrees: number): number => degrees * DEG2RAD;

export const vector3ToDegrees = (radiansVector: Vector3Array): Vector3Array => {
  return [toDegrees(radiansVector[0]), toDegrees(radiansVector[1]), toDegrees(radiansVector[2])];
};

export const vector3ToRadians = (degreesVector: Vector3Array): Vector3Array => {
  return [toRadians(degreesVector[0]), toRadians(degreesVector[1]), toRadians(degreesVector[2])];
};

export const parseFloatSafe = (value: string, defaultValue: number = 0): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
