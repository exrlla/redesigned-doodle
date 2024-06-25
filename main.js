import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

const canvasContainer = document.getElementById('canvas-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 0.5 * window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
renderer.setSize(window.innerWidth / 2, window.innerHeight);
renderer.setClearColor(new THREE.Color("#f0f0f0")); // Set background color to match body

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)

// Load the shiba model
const loader = new GLTFLoader();
let shiba;
loader.load(
    './public/shiba.glb',
    function (gltf) {
        shiba = gltf.scene;
        scene.add(shiba);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

camera.position.z = 3;
camera.position.x = 2;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onDocumentMouseDown(event) {
    event.preventDefault();
    
    mouse.x = ((event.clientX - canvasContainer.offsetLeft - window.innerWidth / 4) / (window.innerWidth / 2)) * 2 - 1;
    mouse.y = -((event.clientY - canvasContainer.offsetTop) / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log('intersects:', intersects);
    if (intersects.length <= 0) {
        const jumpHeight = 1.2;
        const jumpDuration = 0.3;
        gsap.to(shiba.position, { y: jumpHeight, duration: jumpDuration, yoyo: true, repeat: 1, ease: "power1.inOut" });
    }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls with damping
    renderer.render(scene, camera);
}

animate();
