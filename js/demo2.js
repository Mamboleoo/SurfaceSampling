const elContent = document.querySelector('.content');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  elContent.offsetWidth / elContent.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(elContent.offsetWidth, elContent.offsetHeight);
elContent.appendChild(renderer.domElement);

camera.position.z = 50;
camera.position.y = 50;
camera.lookAt(0, 0, 0);

const group = new THREE.Group();
scene.add(group);

const sparkles = [];
const sparklesGeometry = new THREE.BufferGeometry();
const sparklesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    pointTexture: {
      value: new THREE.TextureLoader().load('assets/dotTexture.png')
    }
  },
  vertexShader: document.getElementById("vertexshader").textContent,
  fragmentShader: document.getElementById("fragmentshader").textContent,
  alphaTest: 1.0,
  depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  transparent: true
});
const points = new THREE.Points(sparklesGeometry, sparklesMaterial);
group.add(points);

const p1 = new THREE.Vector3();
let sampler = null;
const lines = [];
let linesColors = [new THREE.Color(0xFAAD80).multiplyScalar(0.5), new THREE.Color(0xFF6767).multiplyScalar(0.5), new THREE.Color(0xFF3D68).multiplyScalar(0.5), new THREE.Color(0xA73489).multiplyScalar(0.5)];
function initLines() {
  sampler = new THREE.MeshSurfaceSampler(turtle).build();
  
  for (let i = 0; i < 6; i++) {
    sampler.sample(p1);
    const linesMesh = {
      colorIndex: i % 4,
      previous: p1.clone()
    };
    lines.push(linesMesh);
  }

  renderer.setAnimationLoop(render);
}

let turtle = null;
new THREE.OBJLoader().load(
  "assets/Turtle_Model.obj",
  (obj) => {
    turtle = obj.children[0];
    turtle.geometry.rotateX(Math.PI * -0.5);
    turtle.geometry.rotateY(Math.PI * -0.3);
    initLines();
  },
  (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
  (err) => console.error(err)
);

function findNextVector(line) {
  let ok = false;
  while (!ok) {
    sampler.sample(p1);

    if (p1.distanceTo(line.previous) < 2.5) {
      line.previous = p1.clone();

      const spark = new Sparkle();
      spark.setup(line.previous, line.colorIndex);
      sparkles.push(spark);

      const tempSparklesArrayColors = [];
      sparkles.forEach(s => {
        tempSparklesArrayColors.push(linesColors[s.colorIndex].r, linesColors[s.colorIndex].g, linesColors[s.colorIndex].b);
      });
      sparklesGeometry.setAttribute("color", new THREE.Float32BufferAttribute(tempSparklesArrayColors, 3));
      
      ok = true;
    }
  }
}

class Sparkle extends THREE.Vector3 {
  setup(origin, colorIndex) {
    this.add(origin).multiplyScalar(1.2);
    this.dest = origin;

    this._size = Math.random() * 5 + 0.5;
    this.size = 0.5;
    this.colorIndex = colorIndex;
    this.scaleSpeed = Math.random() * 0.03 + 0.03;
    this.stop = false;
  }
  update() {
    this.x += (this.dest.x - this.x) * 0.08;
    this.y += (this.dest.y - this.y) * 0.08;
    this.z += (this.dest.z - this.z) * 0.08;
    if (this.size < this._size) {
      this.size += this.scaleSpeed;
    } else {
      if (this.distanceTo(this.dest) < 0.1) {
        this.stop = true;
      }
    }
  }
}

function render(a) {
  group.rotation.y += 0.002;

  if (sparkles.length < 30000) {
    lines.forEach(l => {
      findNextVector(l);
      findNextVector(l);
    });
  }

  const tempSparklesArray = [];
  const tempSparklesArraySizes = [];
  sparkles.forEach(s => {
    if (!s.stop) {
      s.update();
    }
    tempSparklesArray.push(s.x, s.y, s.z);
    tempSparklesArraySizes.push(s.size);
  });
  sparklesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(tempSparklesArray, 3));
  sparklesGeometry.setAttribute("size", new THREE.Float32BufferAttribute(tempSparklesArraySizes, 1));

  renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
  camera.aspect = elContent.offsetWidth / elContent.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(elContent.offsetWidth, elContent.offsetHeight);
}
