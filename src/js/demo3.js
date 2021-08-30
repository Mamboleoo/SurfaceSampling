import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

const elContent = document.querySelector('.content');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  elContent.offsetWidth / elContent.offsetHeight,
  0.1,
  1000
);
camera.position.z = 220;
camera.position.y = 100;
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(elContent.offsetWidth, elContent.offsetHeight);
elContent.appendChild(renderer.domElement);

const group = new THREE.Group();
scene.add(group);

let sampler = null;
let elephant = null;
let paths = [];
new OBJLoader().load(
  "Elephant_Model.obj",
  (obj) => { 
    sampler = new MeshSurfaceSampler(obj.children[0]).build();
    
    for (let i = 0;i < 4; i++) {
      const path = new Path(i);
      paths.push(path);
      group.add(path.line);
    }
    
    renderer.setAnimationLoop(render);
  },
  (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
  (err) => {
    console.log('oops');
    console.error(err)
  }
);

const tempPosition = new THREE.Vector3();
const materials = [new THREE.LineBasicMaterial({color: 0xFAAD80, transparent: true, opacity: 0.5}),
new THREE.LineBasicMaterial({color: 0xFF6767, transparent: true, opacity: 0.5}),
new THREE.LineBasicMaterial({color: 0xFF3D68, transparent: true, opacity: 0.5}),
new THREE.LineBasicMaterial({color: 0xA73489, transparent: true, opacity: 0.5})];
class Path {
  constructor (index) {
    this.geometry = new THREE.BufferGeometry();
    this.material = materials[index % 4];
    this.line = new THREE.Line(this.geometry, this.material);
    this.vertices = [];
    
    sampler.sample(tempPosition);
    this.previousPoint = tempPosition.clone();
  }
  update () {
    let pointFound = false;
    while (!pointFound) {
      sampler.sample(tempPosition);
      if (tempPosition.distanceTo(this.previousPoint) < 30) {
        this.vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
        this.previousPoint = tempPosition.clone();
        pointFound = true;
      }
    }
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.vertices, 3));
  }
}


function render(a) {
  group.rotation.y += 0.002;
  
  paths.forEach(path => {
    if (path.vertices.length < 10000) {
      path.update();
    }
  });

  renderer.render(scene, camera);
}

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = elContent.offsetWidth / elContent.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(elContent.offsetWidth, elContent.offsetHeight);
}