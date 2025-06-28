import React from 'react';

export const CubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21 16.5C21 16.8867 20.9022 17.2662 20.7161 17.5959L13.1118 21.3459C12.4227 21.7519 11.5773 21.7519 10.8882 21.3459L3.28391 17.5959C3.09782 17.2662 3 16.8867 3 16.5V7.5C3 7.11329 3.09782 6.73383 3.28391 6.40411L10.8882 2.65411C11.5773 2.24812 12.4227 2.24812 13.1118 2.65411L20.7161 6.40411C20.9022 6.73383 21 7.11329 21 7.5V16.5Z" stroke="#000" strokeWidth="1" strokeLinejoin="round"/>
    <path d="M3.5 7L11.5 11.5L20.5 7" stroke="#000" strokeWidth="1" strokeLinejoin="round"/>
    <path d="M11.5 21V11.5" stroke="#000" strokeWidth="1" strokeLinejoin="round"/>
  </svg>
);

export const CylinderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke="#000" strokeWidth="1" fill="none"/>
    <ellipse cx="12" cy="18" rx="8" ry="3" stroke="#000" strokeWidth="1"/>
    <line x1="4" y1="6" x2="4" y2="18" stroke="#000" strokeWidth="1"/>
    <line x1="20" y1="6" x2="20" y2="18" stroke="#000" strokeWidth="1"/>
  </svg>
);

export const SphereIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="1"/>
    <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#000" strokeWidth="1" fill="none" strokeDasharray="3 2"/>
  </svg>
);

export const PyramidIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 4L4 20H20L12 4Z" stroke="#000" strokeWidth="1" strokeLinejoin="round"/>
    {/* Optional: line from apex to center of base for perspective */}
    <line x1="12" y1="4" x2="12" y2="20" stroke="#000" strokeWidth="0.5" strokeDasharray="2 2" strokeLinejoin="round"/>
  </svg>
);

export const ModelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#000" strokeWidth="1" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const LightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="12" r="4" stroke="#000" strokeWidth="1" />
    <path d="M12 2V4" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 20V22" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M5.636 5.636L7.05 7.05" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M16.95 16.95L18.364 18.364" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12H4" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 12H22" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M5.636 18.364L7.05 16.95" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M16.95 7.05L18.364 5.636" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TerrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3,20L7.5,12L12,18L16,10L21,20H3Z" stroke="#000" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

export const SkyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M8 12.5C8 11.12 8.525 9.845 9.425 8.925C9.91426 8.42392 10.4853 8.01956 11.1111 7.73333C10.5 7.04167 9.61111 6.66667 8.5 6.66667C6.25 6.66667 4.5 8.41667 4.5 10.6667C4.5 12.9167 6.25 14.6667 8.5 14.6667C9.02778 14.6667 9.52778 14.5556 10 14.3333C9.08333 13.8889 8.5 13.25 8.5 12.5H8Z" stroke="#000" strokeWidth="1" fill="none"/>
        <path d="M17.5 14.5C18.88 14.5 20 13.38 20 12C20 10.62 18.88 9.5 17.5 9.5C17.0722 9.5 16.6722 9.61111 16.3333 9.80556C15.9167 8.02778 14.3611 6.66667 12.5 6.66667C10.5 6.66667 8.80556 8.13889 8.58333 10.0278C7.11111 10.1944 6 11.4722 6 13C6 14.6389 7.36111 16 9 16H17C17.2778 16 17.5278 15.9167 17.75 15.75" stroke="#000" strokeWidth="1" fill="none" strokeLinejoin="round"/>
    </svg>
);