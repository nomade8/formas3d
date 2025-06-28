import React, { useState, useEffect, useCallback } from 'react';
import type { SceneObjectType, ObjectProperties, EditableObjectProperties, GizmoMode, LightProperties, TerrainProperties, GlobalPropType, Vector3Array } from '../types';
import { parseFloatSafe } from '../utils/conversionUtils';

interface RightSidebarProps {
  selectedObject: SceneObjectType | null;
  selectedGlobal: GlobalPropType | null;
  lightProps: LightProperties;
  terrainProps: TerrainProperties;
  onUpdateObject: (id: string, newProps: Partial<ObjectProperties>) => void;
  onUpdateLight: (newProps: Partial<LightProperties>) => void;
  onUpdateTerrain: (newProps: Partial<TerrainProperties>) => void;
  currentGizmoMode: GizmoMode;
  onSetGizmoMode: (mode: GizmoMode) => void;
}

const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; }> = ({ label, value, onChange }) => (
  <div className="mb-3">
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
    />
  </div>
);

const RangeInput: React.FC<{ label: string; value: string; min?: string; max?: string; step?: string; onChange: (value: string) => void; displayValue?: string }> = 
  ({ label, value, min = "0", max = "1", step = "0.01", onChange, displayValue }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <label className="block text-xs font-medium text-gray-400">{label}</label>
      {displayValue && <span className="text-xs text-gray-300">{displayValue}</span>}
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
    />
  </div>
);

const VectorInput: React.FC<{ label: string; value: Vector3Array; onChange: (newValue: Vector3Array) => void; }> = ({ label, value, onChange }) => {
  const handleAxisChange = (axisIndex: number, axisValue: string) => {
    const newValueArr = [...value] as Vector3Array;
    newValueArr[axisIndex] = parseFloatSafe(axisValue, value[axisIndex]);
    onChange(newValueArr);
  };

  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        {['X', 'Y', 'Z'].map((axis, index) => (
          <div key={axis} className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-xs text-gray-500">{axis}</span>
            <input
              type="number"
              step="0.5"
              value={value[index].toFixed(1)}
              onChange={(e) => handleAxisChange(index, e.target.value)}
              className="w-full pl-6 pr-1 py-1 bg-gray-700 border border-gray-600 rounded-md text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};


const GizmoModeButton: React.FC<{
  label: string;
  mode: GizmoMode;
  currentMode: GizmoMode;
  onClick: (mode: GizmoMode) => void;
}> = ({ label, mode, currentMode, onClick }) => (
  <button
    onClick={() => onClick(mode)}
    className={`w-full p-2 text-sm rounded-md transition-colors duration-150 ease-in-out
                ${mode === currentMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
  >
    {label}
  </button>
);

const ObjectEditor: React.FC<Pick<RightSidebarProps, 'selectedObject' | 'onUpdateObject' | 'currentGizmoMode' | 'onSetGizmoMode'>> = ({ selectedObject, onUpdateObject, currentGizmoMode, onSetGizmoMode }) => {
    const [editableProps, setEditableProps] = useState<EditableObjectProperties | null>(null);

    useEffect(() => {
        if (selectedObject) {
            setEditableProps({
                color: selectedObject.color || '#ffffff',
                opacity: (selectedObject.opacity ?? 1).toString(),
            });
        } else {
            setEditableProps(null);
        }
    }, [selectedObject]);

    const handlePropertyChange = useCallback((propName: keyof EditableObjectProperties, value: string) => {
        if (!selectedObject) return;

        setEditableProps(prev => (prev ? { ...prev, [propName]: value } : null));

        const finalValue: string | number = propName === 'opacity' ? parseFloatSafe(value, 1) : value;
        onUpdateObject(selectedObject.id, { [propName]: finalValue });

    }, [selectedObject, onUpdateObject]);

    if (!selectedObject || !editableProps) return null;

    return (
        <>
            <h3 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Propriedades: {selectedObject.name}</h3>
            <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 mb-2">Modo do Gizmo</h4>
                <div className="grid grid-cols-3 gap-2">
                    <GizmoModeButton label="Mover" mode="translate" currentMode={currentGizmoMode} onClick={onSetGizmoMode} />
                    <GizmoModeButton label="Rotacionar" mode="rotate" currentMode={currentGizmoMode} onClick={onSetGizmoMode} />
                    <GizmoModeButton label="Escala" mode="scale" currentMode={currentGizmoMode} onClick={onSetGizmoMode} />
                </div>
            </div>
            <ColorInput label="Cor" value={editableProps.color || '#ffffff'} onChange={(val) => handlePropertyChange('color', val)} />
            <RangeInput label="Opacidade" value={editableProps.opacity || '1'} onChange={(val) => handlePropertyChange('opacity', val)} displayValue={parseFloat(editableProps.opacity || '1').toFixed(2)} />
        </>
    );
};

const LightEditor: React.FC<Pick<RightSidebarProps, 'lightProps' | 'onUpdateLight'>> = ({ lightProps, onUpdateLight }) => {
    return (
        <>
            <h3 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Propriedades da Luz</h3>
            <ColorInput label="Cor" value={lightProps.color} onChange={(color) => onUpdateLight({ color })} />
            <RangeInput
                label="Intensidade"
                value={String(lightProps.intensity)}
                min="0" max="5" step="0.1"
                onChange={(intensity) => onUpdateLight({ intensity: parseFloatSafe(intensity, 1) })}
                displayValue={lightProps.intensity.toFixed(2)}
            />
            <VectorInput label="Posição" value={lightProps.position} onChange={(position) => onUpdateLight({ position })} />
        </>
    );
};

const TerrainEditor: React.FC<Pick<RightSidebarProps, 'terrainProps' | 'onUpdateTerrain'>> = ({ terrainProps, onUpdateTerrain }) => {
    return (
        <>
            <h3 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Propriedades do Terreno</h3>
            <ColorInput label="Cor" value={terrainProps.color} onChange={(color) => onUpdateTerrain({ color })} />
            <RangeInput
                label="Força do Ruído"
                value={String(terrainProps.noiseStrength)}
                min="0" max="5" step="0.1"
                onChange={(val) => onUpdateTerrain({ noiseStrength: parseFloatSafe(val, 0) })}
                displayValue={terrainProps.noiseStrength.toFixed(2)}
            />
            <RangeInput
                label="Escala do Ruído"
                value={String(terrainProps.noiseScale)}
                min="1" max="50" step="1"
                onChange={(val) => onUpdateTerrain({ noiseScale: parseFloatSafe(val, 10) })}
                displayValue={terrainProps.noiseScale.toFixed(1)}
            />
        </>
    );
};

export const RightSidebar: React.FC<RightSidebarProps> = (props) => {
    const { selectedObject, selectedGlobal } = props;

    const renderContent = () => {
        if (selectedGlobal === 'light') {
            return <LightEditor {...props} />;
        }
        if (selectedGlobal === 'terrain') {
            return <TerrainEditor {...props} />;
        }
        if (selectedObject) {
            return <ObjectEditor {...props} />;
        }
        return (
            <>
                <h3 className="text-sm font-semibold mb-2 text-gray-400 uppercase tracking-wider">Propriedades</h3>
                <p className="text-xs text-gray-500">Selecione um objeto, ou escolha 'Luz' ou 'Terreno' na barra lateral esquerda para editar as propriedades.</p>
            </>
        );
    };

    return (
        <div className="w-72 bg-gray-800 text-white p-4 custom-scrollbar overflow-y-auto">
            {renderContent()}
        </div>
    );
};