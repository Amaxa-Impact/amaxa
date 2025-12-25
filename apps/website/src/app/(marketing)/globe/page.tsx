"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Real project locations with actual work done
const projectLocations = [
  {
    id: 1,
    name: "Educational Platform for ISNAD Center",
    country: "Palestine",
    city: "West Bank",
    lat: 31.9522,
    lng: 35.2332,
    type: "education",
    description:
      "Created an accessible educational platform for students at the ISNAD Center, providing digital learning resources and tools.",
    impact: "Reached 200+ students",
    year: "2023",
    color: "#ffd700",
  },
  {
    id: 2,
    name: "Tuition Support Program",
    country: "Liberia",
    city: "Monrovia",
    lat: 6.4281,
    lng: -9.4295,
    type: "education",
    description:
      "Paid full-year tuition for 7 students through martial arts tournament and bake sale fundraising events.",
    impact: "7 students supported",
    year: "2023",
    color: "#ffd700",
  },
  {
    id: 3,
    name: "Medical Supply Aid",
    country: "Ukraine",
    city: "Kyiv",
    lat: 50.4501,
    lng: 30.5234,
    type: "humanitarian",
    description:
      "Raised $500 for critical medical supplies to support Ukrainian civilians affected by the conflict.",
    impact: "$500 raised",
    year: "2022",
    color: "#ff6b6b",
  },
  {
    id: 4,
    name: "Basketball Tournament Fundraiser",
    country: "Qatar",
    city: "Doha",
    lat: 25.2854,
    lng: 51.531,
    type: "fundraising",
    description:
      "Organized basketball tournament that raised funds for humanitarian aid in Gaza.",
    impact: "Part of $700 total raised",
    year: "2023",
    color: "#4ecdc4",
  },
  {
    id: 5,
    name: "Student Benefit Concert",
    country: "United States",
    city: "Georgia",
    lat: 33.749,
    lng: -84.388,
    type: "fundraising",
    description:
      "Hosted benefit concert that raised funds for Gazans, bringing together local community for humanitarian cause.",
    impact: "Part of $700 total raised",
    year: "2023",
    color: "#4ecdc4",
  },
  {
    id: 6,
    name: "Tree Planting Initiative",
    country: "Turkey",
    city: "Istanbul",
    lat: 41.0082,
    lng: 28.9784,
    type: "environment",
    description:
      "Planted trees as part of international environmental campaign across Turkey, US, and UAE.",
    impact: "100+ trees planted",
    year: "2023",
    color: "#6ab04c",
  },
  {
    id: 7,
    name: "Student Cohort Program",
    country: "UAE",
    city: "Dubai",
    lat: 25.2048,
    lng: 55.2708,
    type: "education",
    description:
      "Running ongoing cohort programs connecting students with nonprofit partners for meaningful impact projects.",
    impact: "18 active members",
    year: "2023-2024",
    color: "#ffd700",
  },
  {
    id: 8,
    name: "Project Management Training",
    country: "Romania",
    city: "Bucharest",
    lat: 44.4268,
    lng: 26.1025,
    type: "community",
    description:
      "Provided project management training and support for student-led social impact initiatives.",
    impact: "7 team members trained",
    year: "2023",
    color: "#95e1d3",
  },
  {
    id: 9,
    name: "Youth Development Programs",
    country: "Egypt",
    city: "Cairo",
    lat: 30.0444,
    lng: 31.2357,
    type: "community",
    description:
      "Supporting youth-led initiatives and development programs focused on education and community building.",
    impact: "14 active participants",
    year: "2023-2024",
    color: "#95e1d3",
  },
  {
    id: 10,
    name: "Colorado Ámaxa Network",
    country: "United States",
    city: "Colorado",
    lat: 39.5501,
    lng: -105.7821,
    type: "community",
    description:
      "Launched first in-person pathway connecting Colorado changemakers for local and global impact projects.",
    impact: "22 network members",
    year: "2024",
    color: "#95e1d3",
  },
  {
    id: 11,
    name: "LGBTQ+ Refugee Documentary PR",
    country: "Netherlands",
    city: "Amsterdam",
    lat: 52.3676,
    lng: 4.9041,
    type: "humanitarian",
    description:
      "Providing trained PR team to promote Piera van de Wiel's documentary on LGBTQ+ refugees.",
    impact: "Ongoing support",
    year: "2024",
    color: "#ff6b6b",
  },
  {
    id: 12,
    name: "Tree Planting - UAE Chapter",
    country: "UAE",
    city: "Abu Dhabi",
    lat: 24.4539,
    lng: 54.3773,
    type: "environment",
    description:
      "Environmental initiative planting trees across UAE as part of multi-country campaign.",
    impact: "50+ trees planted",
    year: "2023",
    color: "#6ab04c",
  },
];

// Convert lat/lng to 3D coordinates on sphere
function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Fetch and create detailed world map from Natural Earth data
const createDetailedWorldMap = async () => {
  const width = 1440;
  const height = 720;

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
    );
    const geoData = await response.json();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#1a5fb4";
    ctx.fillRect(0, 0, width, height);

    const project = (coords: number[]) => {
      const [lng, lat] = coords;
      const x = ((lng + 180) / 360) * width;
      const y = ((90 - lat) / 180) * height;
      return [x, y];
    };

    geoData.features.forEach((feature: any) => {
      const geometry = feature.geometry;

      const landColors = [
        "#57e389",
        "#33d17a",
        "#26a269",
        "#8ff0a4",
        "#5bc8af",
        "#62a0ea",
        "#c0bfbc",
        "#99c1f1",
        "#deddda",
        "#f6f5f4",
      ];

      const countryName = feature.properties.NAME || "";
      const colorIndex =
        countryName
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        landColors.length;

      ctx.fillStyle = landColors[colorIndex];
      ctx.strokeStyle = "#2a4a2a";
      ctx.lineWidth = 0.5;

      const drawPolygon = (coordinates: number[][][]) => {
        coordinates.forEach((ring) => {
          ctx.beginPath();
          const [startX, startY] = project(ring[0]);
          ctx.moveTo(startX, startY);

          for (let i = 1; i < ring.length; i++) {
            const [x, y] = project(ring[i]);
            ctx.lineTo(x, y);
          }

          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
      };

      if (geometry.type === "Polygon") {
        drawPolygon(geometry.coordinates);
      } else if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon: number[][][]) => {
          drawPolygon(polygon);
        });
      }
    });

    const map: boolean[][] = Array(height)
      .fill(false)
      .map(() => Array(width).fill(false));

    const imageData = ctx.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        if (!(r < 50 && g < 150 && b > 150)) {
          map[y][x] = true;
        }
      }
    }

    return { map, canvas };
  } catch (error) {
    console.error("Failed to fetch geo data, using fallback", error);
    return createFallbackMap();
  }
};

const createFallbackMap = () => {
  const width = 1440;
  const height = 720;
  const map: boolean[][] = Array(height)
    .fill(false)
    .map(() => Array(width).fill(false));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#1a5fb4";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#33d17a";
  ctx.fillRect(200, 100, 400, 300);
  ctx.fillRect(400, 400, 250, 400);
  ctx.fillRect(700, 120, 200, 180);
  ctx.fillRect(700, 300, 300, 400);
  ctx.fillRect(900, 100, 500, 400);
  ctx.fillRect(1100, 500, 200, 150);

  const imageData = ctx.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = imageData.data[i];
      if (r > 100) {
        map[y][x] = true;
      }
    }
  }

  return { map, canvas };
};

// Globe Component - NO AUTO ROTATION
function DetailedGlobe({
  onMarkerClick,
}: {
  onMarkerClick: (project: any) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [earthData, setEarthData] = useState<{
    map: boolean[][];
    canvas: HTMLCanvasElement;
  } | null>(null);

  useEffect(() => {
    createDetailedWorldMap().then((data) => setEarthData(data));
  }, []);

  // Removed auto-rotation

  const earthTexture = useMemo(() => {
    if (!earthData) return null;

    const canvas = document.createElement("canvas");
    const pixelSize = 1;
    canvas.width = 1440 * pixelSize;
    canvas.height = 720 * pixelSize;
    const ctx = canvas.getContext("2d")!;

    const oceanColors = ["#1a5fb4", "#1c71d8", "#3584e4", "#62a0ea"];
    const landColors = [
      "#57e389",
      "#33d17a",
      "#26a269",
      "#8ff0a4",
      "#5bc8af",
      "#62a0ea",
      "#99c1f1",
      "#c0bfbc",
      "#deddda",
      "#f6f5f4",
      "#c2e59c",
      "#64b3f4",
      "#c7ea46",
      "#96c93d",
      "#00b09b",
    ];

    for (let y = 0; y < 720; y++) {
      for (let x = 0; x < 1440; x++) {
        const isLand = earthData.map[y][x];
        const variation = Math.random();
        let color;

        if (isLand) {
          const latFactor = y / 720;

          if (latFactor < 0.1 || latFactor > 0.9) {
            color = variation > 0.5 ? "#f6f5f4" : "#deddda";
          } else if (latFactor < 0.2 || latFactor > 0.8) {
            color = landColors[Math.floor(variation * 3) + 7];
          } else if (latFactor < 0.35 || latFactor > 0.65) {
            color = landColors[Math.floor(variation * 6)];
          } else {
            color = landColors[Math.floor(variation * landColors.length)];
          }
        } else {
          color = oceanColors[Math.floor(variation * oceanColors.length)];
        }

        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [earthData]);

  if (!earthTexture) {
    return (
      <mesh>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial color="#1a5fb4" roughness={0.8} metalness={0.1} />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.05, 128, 128]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {projectLocations.map((project) => {
        const position = latLngToVector3(project.lat, project.lng, 2.08);
        return (
          <ProjectMarker
            key={project.id}
            position={position}
            project={project}
            onClick={() => onMarkerClick(project)}
          />
        );
      })}
    </group>
  );
}

// Enhanced Project Marker - Pin style with bigger size
function ProjectMarker({
  position,
  project,
  onClick,
}: {
  position: THREE.Vector3;
  project: any;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pinRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pinRef.current && hovered) {
      pinRef.current.position.y +=
        Math.sin(state.clock.elapsedTime * 4) * 0.002;
    }
    if (pulseRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.03 + 0.15;
      pulseRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Calculate normal vector for pin orientation
  const normal = position.clone().normalize();

  return (
    <group position={position}>
      {/* Pulsing ring glow */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.15, 0.18, 32]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={hovered ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pin marker group */}
      <group
        ref={pinRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Pin head (rounded top) */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={hovered ? 1.2 : 0.6}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Pin body (cone pointing down) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.05, 0.12, 8]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Glow sphere inside pin head */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={hovered ? 0.9 : 0.6}
          />
        </mesh>
      </group>
    </group>
  );
}

// Scene Component
function Scene({ onMarkerClick }: { onMarkerClick: (project: any) => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <pointLight position={[-3, -2, -3]} intensity={0.4} color="#4a9eff" />

      <DetailedGlobe onMarkerClick={onMarkerClick} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        rotateSpeed={0.5}
      />

      <Stars />
    </>
  );
}

// Stars Component
function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const starGeometry = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return (
    <points ref={starsRef} geometry={starGeometry}>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main Page Component
export default function GlobePage() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0a0e1a]">
      {/* 3D Canvas - Full Screen */}
      <div className="h-full w-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Scene onMarkerClick={setSelectedProject} />
        </Canvas>
      </div>

      {/* Project Details Popup */}
      {selectedProject && (
        <div className="absolute right-8 top-1/2 z-20 w-96 -translate-y-1/2 rounded-3xl border border-white/20 bg-black/80 p-6 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute right-4 top-4 text-white/60 transition-colors hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Location Badge */}
          <div className="mb-4 flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: selectedProject.color }}
            />
            <span className="text-sm font-medium text-white/60">
              {selectedProject.city}, {selectedProject.country}
            </span>
          </div>

          {/* Project Name */}
          <h3 className="mb-3 text-2xl font-bold text-white">
            {selectedProject.name}
          </h3>

          {/* Description */}
          <p className="mb-4 leading-relaxed text-white/80">
            {selectedProject.description}
          </p>

          {/* Impact Stats */}
          <div className="mb-4 rounded-2xl bg-white/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="text-sm font-semibold text-white">
                {selectedProject.impact}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-white/60">
                {selectedProject.year}
              </span>
            </div>
          </div>

          {/* Type Badge */}
          <div className="inline-block rounded-full bg-white/10 px-4 py-2">
            <span className="text-xs font-medium uppercase tracking-wide text-white/80">
              {selectedProject.type}
            </span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/20 bg-black/60 px-6 py-3 backdrop-blur-md">
        <p className="text-sm text-white/80">
          🌍 Drag to rotate • 🔍 Zoom • 📍 Click pins to see our impact
        </p>
      </div>

      {/* Title Overlay */}
      <div className="absolute left-8 top-8 z-10">
        <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
          Our Global Impact
        </h1>
        <p className="text-lg text-white/80">
          {projectLocations.length} projects •{" "}
          {new Set(projectLocations.map((p) => p.country)).size} countries
        </p>
      </div>
    </main>
  );
}
