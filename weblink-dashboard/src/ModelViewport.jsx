export default function ModelViewport() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <span className="font-mono text-lg text-gray-100 opacity-95 select-none pointer-events-none tracking-wider acumin-thin"
        style={{ letterSpacing: '0.09em', background: 'rgba(0,0,0,0.13)', padding: '0.4em 1.2em', borderRadius: '14px' }}>
        3D Model Viewport
      </span>
    </div>
  );
}