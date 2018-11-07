var renderer, scene, camera, particle, cubes;

window.onload = function() {
  init();
  animate();
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.body.appendChild(renderer.domElement);


  window.addEventListener( 'resize', ()=>{
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  });


  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 330;
  scene.add(camera);

  particle = new THREE.Object3D();
  cubes = new THREE.Object3D();

  scene.add(particle);
  scene.add(cubes);

  var geometry = new THREE.TetrahedronGeometry(2, 4);
  var cubeGeometry = new THREE.BoxGeometry(200, 200, 200);

  var material = new THREE.MeshPhongMaterial({
    color: 0xfff600,
    shading: THREE.FlatShading
  });

  var cubeMaterial = new THREE.MeshPhongMaterial({
    color: 0x92fcf5,
    shading: THREE.FlatShading,
    wireframe: true
  });

  for (var i = 0; i < 1000; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(120 + (Math.random() * 40));
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }

  for (var i = 0; i < 10; i++) {
    var meshCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    meshCube.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    meshCube.position.multiplyScalar(0.2 + (Math.random() * 40));
    meshCube.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);

    cubes.add(meshCube);
  }

  var ambientLight = new THREE.AmbientLight(0x70a6ff );
  scene.add(ambientLight);

  var lights = [];
lights[0] = new THREE.DirectionalLight( 0xffffff, 1 );
lights[0].position.set( 1, 0, 0 );
lights[1] = new THREE.DirectionalLight( 0x70a6ff, 1 );
lights[1].position.set( 0.75, 1, 0.5 );
lights[2] = new THREE.DirectionalLight( 0xf46f4e, 1 );
lights[2].position.set( -0.75, -1, 0.5 );
scene.add( lights[0] );
scene.add( lights[1] );
scene.add( lights[2] );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
};

function animate() {
  requestAnimationFrame(animate);

  particle.rotation.x += 0.0000;
  particle.rotation.y -= 0.0020;
  cubes.rotation.x += 0.0000;
  cubes.rotation.y -= 0.0020;


  renderer.render( scene, camera )
};
