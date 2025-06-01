"use client"
import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Sliders, RotateCcw, Download, Settings, Upload } from 'lucide-react';

const Dashboard3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const animationRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  
  // Parameter state
  const [params, setParams] = useState({
    width: 2,
    height: 2,
    depth: 2,
    segments: 1,
    color: '#f63b3b',
    metalness: 0.3,
    roughness: 0.4,
    wireframe: false,
    autoRotate: false // Changed default to false since we have camera controls
  });

  const [modelType, setModelType] = useState('box'); // 'box', 'sphere', 'cylinder', 'custom'
  const [isLoading, setIsLoading] = useState(false);

  // Camera controls implementation
  const setupCameraControls = (camera, renderer) => {
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let radius = 8;
    let theta = 0;
    let phi = Math.PI / 3;

    const onMouseDown = (event) => {
      if (event.button === 0) { // Left click
        isMouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
      }
    };

    const onMouseMove = (event) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      theta -= deltaX * 0.01;
      phi += deltaY * 0.01;
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (event) => {
      radius += event.deltaY * 0.01;
      radius = Math.max(2, Math.min(20, radius));
    };

    const updateCamera = () => {
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      camera.position.set(x, y, z);
      camera.lookAt(targetX, targetY, 0);
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Initial camera position
    updateCamera();

    return {
      updateCamera,
      cleanup: () => {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onWheel);
      }
    };
  };

  // Load custom model function
  const loadCustomModel = async (file) => {
    setIsLoading(true);
    
    try {
      if (file.name.toLowerCase().endsWith('.stl')) {
        // STL Loader implementation
        const text = await file.text();
        const geometry = parseSTL(text);
        
        if (meshRef.current && sceneRef.current) {
          sceneRef.current.remove(meshRef.current);
          meshRef.current.geometry.dispose();
          meshRef.current.material.dispose();
        }

        const material = new THREE.MeshStandardMaterial({
          color: params.color,
          metalness: params.metalness,
          roughness: params.roughness,
          wireframe: params.wireframe
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        
        mesh.position.sub(center);
        mesh.scale.setScalar(scale);
        
        meshRef.current = mesh;
        sceneRef.current.add(mesh);
        setModelType('custom');
      } else {
        alert('Please upload an STL file');
      }
    } catch (error) {
      console.error('Error loading model:', error);
      alert('Error loading model. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple STL parser (ASCII format)
  const parseSTL = (stlText) => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const normals = [];

    const lines = stlText.split('\n');
    let currentNormal = null;
    let vertexCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('facet normal')) {
        const parts = line.split(' ');
        currentNormal = [
          parseFloat(parts[2]),
          parseFloat(parts[3]),
          parseFloat(parts[4])
        ];
      } else if (line.startsWith('vertex')) {
        const parts = line.split(' ');
        vertices.push(
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        );
        if (currentNormal) {
          normals.push(...currentNormal);
        }
        vertexCount++;
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    if (normals.length > 0) {
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    } else {
      geometry.computeVertexNormals();
    }

    return geometry;
  };
  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x210a0a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Setup camera controls
    const controls = setupCameraControls(camera, renderer);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4f46e5, 0.8, 10);
    pointLight.position.set(-3, 3, -3);
    scene.add(pointLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x1a1a2e,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelper.position.y = -1.99;
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Update camera controls
      if (controlsRef.current) {
        controlsRef.current.updateCamera();
      }
      
      // Auto rotate only if enabled and not using camera controls
      if (params.autoRotate && meshRef.current) {
        meshRef.current.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (controlsRef.current) {
        controlsRef.current.cleanup();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update 3D object when parameters change
  useEffect(() => {
    if (!sceneRef.current || modelType === 'custom') return;

    // Remove existing mesh
    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      meshRef.current.material.dispose();
    }

    // Create geometry based on model type and parameters
    let geometry;
    switch (modelType) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(
          params.width / 2,
          Math.max(8, params.segments * 8),
          Math.max(6, params.segments * 6)
        );
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(
          params.width / 2,
          params.width / 2,
          params.height,
          Math.max(8, params.segments * 8)
        );
        break;
      default: // box
        geometry = new THREE.BoxGeometry(
          params.width,
          params.height,
          params.depth,
          params.segments,
          params.segments,
          params.segments
        );
    }

    // Create material with parameters
    const material = new THREE.MeshStandardMaterial({
      color: params.color,
      metalness: params.metalness,
      roughness: params.roughness,
      wireframe: params.wireframe
    });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    meshRef.current = mesh;
    sceneRef.current.add(mesh);
  }, [params, modelType]);

  // Update material properties for custom models
  useEffect(() => {
    if (meshRef.current && modelType === 'custom') {
      meshRef.current.material.color.setStyle(params.color);
      meshRef.current.material.metalness = params.metalness;
      meshRef.current.material.roughness = params.roughness;
      meshRef.current.material.wireframe = params.wireframe;
      meshRef.current.material.needsUpdate = true;
    }
  }, [params.color, params.metalness, params.roughness, params.wireframe, modelType]);

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const resetParams = () => {
    setParams({
      width: 2,
      height: 2,
      depth: 2,
      segments: 1,
      color: '#f63b3b',
      metalness: 0.3,
      roughness: 0.4,
      wireframe: false,
      autoRotate: false
    });
    setModelType('box');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      loadCustomModel(file);
    }
  };

  const exportModel = () => {
    // In a real app, you'd implement STL/OBJ export here
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* 3D Viewport */}
      <div className="flex-1 relative">
        <div ref={mountRef} className="w-full h-full" />
        
        {/* Viewport Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <label className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" title="Upload Model">
            <Upload size={20} />
            <input
              type="file"
              accept=".stl"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={resetParams}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset Parameters"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={exportModel}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title="Export Model"
          >
            <Download size={20} />
          </button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading model...</p>
            </div>
          </div>
        )}

        {/* Camera controls info */}
        <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-3 text-sm">
          <div className="font-semibold mb-1">Camera Controls:</div>
          <div>• Left click + drag: Orbit</div>
          <div>• Mouse wheel: Zoom</div>
        </div>

        {/* Info Panel */}
        <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Settings size={18} />
            Current Parameters
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Dimensions: {params.width} × {params.height} × {params.depth}</div>
            <div>Segments: {params.segments}</div>
            <div>Metalness: {params.metalness.toFixed(2)}</div>
            <div>Roughness: {params.roughness.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 bg-gray-800 p-6 overflow-y-auto border-l border-gray-700">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Sliders size={24} />
          Parameters
        </h2>

        <div className="space-y-6">
          {/* Model Type Selection */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Model Type</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setModelType('box')}
                className={`p-2 rounded text-sm transition-colors ${
                  modelType === 'box' ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                Box
              </button>
              <button
                onClick={() => setModelType('sphere')}
                className={`p-2 rounded text-sm transition-colors ${
                  modelType === 'sphere' ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                Sphere
              </button>
              <button
                onClick={() => setModelType('cylinder')}
                className={`p-2 rounded text-sm transition-colors ${
                  modelType === 'cylinder' ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                Cylinder
              </button>
              <label className={`p-2 rounded text-sm transition-colors cursor-pointer text-center ${
                modelType === 'custom' ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
              }`}>
                Custom STL
                <input
                  type="file"
                  accept=".stl"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Dimensions - only show for built-in models */}
          {modelType !== 'custom' && (
            <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Dimensions</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {modelType === 'sphere' ? 'Radius' : modelType === 'cylinder' ? 'Radius' : 'Width'}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={params.width}
                  onChange={(e) => handleParamChange('width', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{params.width}</span>
              </div>

              {modelType !== 'sphere' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Height</label>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={params.height}
                    onChange={(e) => handleParamChange('height', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{params.height}</span>
                </div>
              )}

              {modelType === 'box' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Depth</label>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={params.depth}
                    onChange={(e) => handleParamChange('depth', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{params.depth}</span>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Geometry - only show for built-in models */}
          {modelType !== 'custom' && (
            <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Geometry</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Segments</label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={params.segments}
                onChange={(e) => handleParamChange('segments', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{params.segments}</span>
            </div>
          </div>
          )}

          {/* Material */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Material</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="color"
                  value={params.color}
                  onChange={(e) => handleParamChange('color', e.target.value)}
                  className="w-full h-10 rounded border-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Metalness</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={params.metalness}
                  onChange={(e) => handleParamChange('metalness', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{params.metalness}</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Roughness</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={params.roughness}
                  onChange={(e) => handleParamChange('roughness', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{params.roughness}</span>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Display</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={params.wireframe}
                  onChange={(e) => handleParamChange('wireframe', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Wireframe</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={params.autoRotate}
                  onChange={(e) => handleParamChange('autoRotate', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto Rotate</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={resetParams}
              className="w-full py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={exportModel}
              className="w-full py-2 bg-red-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Export Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard3D;