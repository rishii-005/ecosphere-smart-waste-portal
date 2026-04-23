import { useEffect, useRef } from "react";
import * as THREE from "three";

export function EarthScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 64, 64),
      new THREE.MeshStandardMaterial({ color: "#2f6f57", roughness: 0.62, metalness: 0.08 })
    );
    scene.add(earth);

    const continentMaterial = new THREE.MeshStandardMaterial({ color: "#4ade80", roughness: 0.8 });
    for (let i = 0; i < 22; i += 1) {
      const patch = new THREE.Mesh(new THREE.CircleGeometry(0.08 + Math.random() * 0.16, 18), continentMaterial);
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      patch.position.set(1.57 * Math.sin(phi) * Math.cos(theta), 1.57 * Math.cos(phi), 1.57 * Math.sin(phi) * Math.sin(theta));
      patch.lookAt(0, 0, 0);
      earth.add(patch);
    }

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.018, 12, 120),
      new THREE.MeshBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0.72 })
    );
    ring.rotation.x = 1.2;
    scene.add(ring);

    const arrows = new THREE.Group();
    const arrowMaterial = new THREE.MeshStandardMaterial({ color: "#f5c84c", metalness: 0.15, roughness: 0.4 });
    for (let i = 0; i < 3; i += 1) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.34, 24), arrowMaterial);
      const angle = (i / 3) * Math.PI * 2;
      cone.position.set(Math.cos(angle) * 2.05, Math.sin(angle) * 2.05, 0);
      cone.rotation.z = angle - Math.PI / 2;
      arrows.add(cone);
    }
    scene.add(arrows);

    scene.add(new THREE.AmbientLight("#ffffff", 1.25));
    const point = new THREE.PointLight("#4ade80", 3.2);
    point.position.set(3, 3, 4);
    scene.add(point);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      earth.rotation.y += 0.005;
      ring.rotation.z += 0.004;
      arrows.rotation.z -= 0.006;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
