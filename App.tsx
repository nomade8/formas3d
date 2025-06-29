import React, { useState, useCallback, useEffect } from 'react';
import type * as THREE from 'three'; // Import THREE namespace for Object3D
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { SceneCanvas } from './components/SceneCanvas';
import { PrimitiveType, type GizmoMode, type GlobalPropType, type LightProperties, type TerrainProperties, type SkyProperties } from './types'; 
import type { SceneObjectType, ObjectProperties, PrimitiveSceneObject, ModelSceneObject } from './types';
import { DEFAULT_POSITION, DEFAULT_ROTATION, DEFAULT_SCALE } from './constants';

const getPrimitiveNameInPortuguese = (type: PrimitiveType): string => {
  switch (type) {
    case PrimitiveType.BOX: return 'Cubo';
    case PrimitiveType.CYLINDER: return 'Cilindro';
    case PrimitiveType.SPHERE: return 'Esfera';
    case PrimitiveType.PYRAMID: return 'Pirâmide';
    default: 
      // The `never` type is expected here due to the exhaustive switch.
      // Casting to string provides a fallback for any unhandled new primitive types.
      const defaultName = (type as string).charAt(0).toUpperCase() + (type as string).slice(1);
      return defaultName;
  }
};

const GROUND_Y_OFFSET = 0.01; // Small offset to prevent z-fighting with the terrain

const App: React.FC = () => {
  const [sceneObjects, setSceneObjects] = useState<SceneObjectType[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedObjectRef, setSelectedObjectRef] = useState<THREE.Object3D | null>(null);
  const [selectedGlobal, setSelectedGlobal] = useState<GlobalPropType | null>(null);
  const [gizmoMode, setGizmoMode] = useState<GizmoMode>('translate'); 

  const [lightProps, setLightProps] = useState<LightProperties>({
    intensity: 1.5,
    color: '#ffffff',
    position: [15, 7, -10],
  });

  const [terrainProps, setTerrainProps] = useState<TerrainProperties>({
    color: '#6B8E23',
    noiseStrength: 0,
    noiseScale: 0,
  });
  
  const [skyProps, setSkyProps] = useState<SkyProperties>({
    turbidity: 5.1,
    rayleigh: 1.0,
    inclination: 0.5,
    azimuth: 0.35,
  });

  const getNextName = useCallback((baseName: string): string => {
    let count = 1;
    let newName = `${baseName} ${count}`;
    while (sceneObjects.some(obj => obj.name === newName)) {
      count++;
      newName = `${baseName} ${count}`;
    }
    return newName;
  }, [sceneObjects]);
  
  const addPrimitive = useCallback((type: PrimitiveType) => {
    const id = crypto.randomUUID();
    const name = getNextName(getPrimitiveNameInPortuguese(type));
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    const newObject: PrimitiveSceneObject = {
      id,
      name,
      type: 'primitive',
      primitiveType: type,
      position: [...DEFAULT_POSITION], 
      rotation: [...DEFAULT_ROTATION],
      scale: [...DEFAULT_SCALE],
      color: randomColor, 
      opacity: 1, 
    };
    
    if (type === PrimitiveType.BOX || type === PrimitiveType.CYLINDER || type === PrimitiveType.PYRAMID) {
        newObject.position[1] = (newObject.scale[1] / 2) + GROUND_Y_OFFSET;
    } else if (type === PrimitiveType.SPHERE) {
        newObject.position[1] = (newObject.scale[1] * 0.5) + GROUND_Y_OFFSET;
    }

    setSceneObjects((prevObjects) => [...prevObjects, newObject]);
  }, [getNextName]);

  const addModel = useCallback((url: string, modelName: string) => {
    const id = crypto.randomUUID();
    const name = getNextName(modelName);
    const newObject: ModelSceneObject = {
      id,
      name,
      type: 'model',
      modelUrl: url,
      position: [...DEFAULT_POSITION],
      rotation: [...DEFAULT_ROTATION],
      scale: [0.5,0.5,0.5], 
      color: undefined, 
      opacity: 1, 
    };
    // This assumes model's origin is at its center and it has a height of 1 unit before scaling.
    newObject.position[1] = (newObject.scale[1] * 0.5) + GROUND_Y_OFFSET; 
    setSceneObjects((prevObjects) => [...prevObjects, newObject]);
  }, [getNextName]);

  const handleSelectObject = useCallback((id: string, ref: THREE.Object3D) => {
    setSelectedObjectId(id);
    setSelectedObjectRef(ref);
    setSelectedGlobal(null);
  }, []);

  const handleSelectGlobal = useCallback((type: GlobalPropType) => {
    setSelectedGlobal(type);
    setSelectedObjectId(null);
    setSelectedObjectRef(null);
  }, []);

  const handleDeselect = useCallback(() => {
    setSelectedObjectId(null);
    setSelectedObjectRef(null);
    setSelectedGlobal(null);
  }, []);

  const updateObjectProperties = useCallback((id: string, newProps: Partial<ObjectProperties>) => {
    setSceneObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === id ? { ...obj, ...newProps } : obj
      )
    );
  }, []);
  
  const updateLightProperties = useCallback((newProps: Partial<LightProperties>) => {
    setLightProps(prev => ({ ...prev, ...newProps }));
  }, []);
  
  const updateTerrainProperties = useCallback((newProps: Partial<TerrainProperties>) => {
    setTerrainProps(prev => ({ ...prev, ...newProps }));
  }, []);
  
  const updateSkyProperties = useCallback((newProps: Partial<SkyProperties>) => {
    setSkyProps(prev => ({ ...prev, ...newProps }));
  }, []);


  const deleteSelectedObject = useCallback(() => {
    if (selectedObjectId) {
      setSceneObjects((prevObjects) =>
        prevObjects.filter((obj) => obj.id !== selectedObjectId)
      );
      handleDeselect();
    }
  }, [selectedObjectId, handleDeselect]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedObjectId && (event.key === 'Delete' || event.key === 'Backspace')) {
        if (event.key === 'Backspace') {
            const target = event.target as HTMLElement;
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
                 event.preventDefault();
            } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }
        }
        deleteSelectedObject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedObjectId, deleteSelectedObject]); 

  const selectedObjectForSidebar = sceneObjects.find(obj => obj.id === selectedObjectId) || null;

  return (
    <div className="flex h-screen w-screen bg-gray-900">
      <LeftSidebar onAddPrimitive={addPrimitive} onSelectGlobal={handleSelectGlobal} />
      <SceneCanvas
        sceneObjects={sceneObjects}
        selectedObjectId={selectedObjectId}
        selectedObjectRef={selectedObjectRef}
        lightProps={lightProps}
        terrainProps={terrainProps}
        skyProps={skyProps}
        onSelectObject={handleSelectObject}
        onDeselect={handleDeselect}
        onUpdateObjectProperties={updateObjectProperties}
        gizmoMode={gizmoMode} 
      />
      <RightSidebar
        selectedObject={selectedObjectForSidebar}
        selectedGlobal={selectedGlobal}
        lightProps={lightProps}
        terrainProps={terrainProps}
        skyProps={skyProps}
        onUpdateObject={updateObjectProperties} 
        onUpdateLight={updateLightProperties}
        onUpdateTerrain={updateTerrainProperties}
        onUpdateSky={updateSkyProperties}
        currentGizmoMode={gizmoMode} 
        onSetGizmoMode={setGizmoMode} 
      />
    </div>
  );
};

export default App;