import React from 'react';
import { PrimitiveType, GlobalPropType } from '../types';
import { CubeIcon, CylinderIcon, SphereIcon, PyramidIcon, LightIcon, TerrainIcon } from './icons';

interface LeftSidebarProps {
  onAddPrimitive: (type: PrimitiveType) => void;
  onSelectGlobal: (type: GlobalPropType) => void;
}

const SidebarButton: React.FC<{ onClick: () => void; children: React.ReactNode; title: string; }> = ({ onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="w-full flex flex-col items-center justify-center p-3 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {children}
  </button>
);

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ onAddPrimitive, onSelectGlobal }) => {
  return (
    <div className="w-48 bg-gray-800 text-white p-4 space-y-6 custom-scrollbar overflow-y-auto">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Adicionar Primitivas</h3>
        <div className="grid grid-cols-2 gap-3">
          <SidebarButton onClick={() => onAddPrimitive(PrimitiveType.BOX)} title="Adicionar Cubo">
            <CubeIcon className="w-10 h-10 mb-1 text-blue-400" />
            Cubo
          </SidebarButton>
          <SidebarButton onClick={() => onAddPrimitive(PrimitiveType.CYLINDER)} title="Adicionar Cilindro">
            <CylinderIcon className="w-10 h-10 mb-1 text-green-400" />
            Cilindro
          </SidebarButton>
          <SidebarButton onClick={() => onAddPrimitive(PrimitiveType.SPHERE)} title="Adicionar Esfera">
            <SphereIcon className="w-10 h-10 mb-1 text-red-400" />
            Esfera
          </SidebarButton>
          <SidebarButton onClick={() => onAddPrimitive(PrimitiveType.PYRAMID)} title="Adicionar Pirâmide">
            <PyramidIcon className="w-10 h-10 mb-1 text-orange-400" /> 
            Pirâmide
          </SidebarButton>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">Propriedades da Cena</h3>
        <div className="grid grid-cols-2 gap-3">
           <SidebarButton onClick={() => onSelectGlobal('light')} title="Editar Propriedades da Luz">
            <LightIcon className="w-10 h-10 mb-1 text-yellow-400" />
            Luz
          </SidebarButton>
          <SidebarButton onClick={() => onSelectGlobal('terrain')} title="Editar Propriedades do Terreno">
            <TerrainIcon className="w-10 h-10 mb-1 text-green-600" />
            Terreno
          </SidebarButton>
        </div>
      </div>
       <div className="text-xs text-gray-500 mt-auto pt-4">
        <p>Dica: Clique nos objetos na cena para selecionar e movê-los com o gizmo.</p>
        <p>Use os controles do mouse para orbitar (arrastar-esquerdo), zoom (rolar) e pan (arrastar-direito).</p>
        <p className="mt-4 text-gray-400">Desenvolvido por : Professor Marcelo Nunes e Gemini AI.</p>
      </div>
    </div>
  );
};