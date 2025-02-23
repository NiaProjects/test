import React, { useEffect, useRef, Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

// ✅ تحميل ملف FBX وتغيير لونه إلى الأبيض
const FurnitureModel = ({ modelPath }) => {
  const fbx = useLoader(FBXLoader, modelPath);

  // تغيير المادة إلى اللون الأبيض
  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({ color: "white" });
    }
  });

  return <primitive object={fbx} scale={0.01} position={[0, -1, 0]} />;
};

// ✅ تطبيق المشهد ثلاثي الأبعاد فوق الكاميرا الحية
const App = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // ✅ تشغيل الكاميرا عند تحميل الصفحة
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* ✅ فيديو الكاميرا كخلفية */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      {/* ✅ مشهد ثلاثي الأبعاد فوق الكاميرا */}
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />

        <Suspense fallback={<mesh><boxGeometry /><meshBasicMaterial color="gray" /></mesh>}>
          <FurnitureModel modelPath="/test.fbx" />
        </Suspense>

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default App;
