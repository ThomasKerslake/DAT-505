//Global variables
var scene, camera, renderer;
var geometry, geometry2, geometry3, material, material2, material3, mesh, mesh2, mesh3;

function init(){
  // Create an empty scene --------------------------
  scene = new THREE.Scene();

  // Create a basic perspective camera --------------
  camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 300, 10000 );

  // Create a renderer with Antialiasing ------------
  renderer = new THREE.WebGLRenderer({antialias:true});

  // Configure renderer clear color
  renderer.setClearColor("#55496b");

  // Configure renderer size
  renderer.setSize( window.innerWidth, window.innerHeight );

  // Append Renderer to DOM
  document.body.appendChild( renderer.domElement );
}


function geometry(){
    //Lights
    var light1 = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light1);

    var light2 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light2);

  // Create a Cube Mesh with basic material ---------

  geometry = new THREE.TorusKnotGeometry(60, 20, 100, 10);
  material = new THREE.MeshPhongMaterial({shininess: 3});
  mesh = new THREE.Mesh( geometry, material );
  mesh.position.z = -1000;
  mesh.position.x = -300;

  // Add mesh to scene
  scene.add( mesh );

  geometry2 = new THREE.TorusKnotGeometry(60, 20, 100, 10);
  material2 = new THREE.MeshPhongMaterial({
  color: 0x695DCF,
  specular: 0xffffff,
  shininess: 1000,
  lightMap: null,
  lightMapIntensity: 1,
  bumpMap: null,
  bumpScale: 1,
  normalMap: null,
  normalScale: 1,
  displacementMap: null,
  displacementScale: 1,
  displacementBias: 0,
  specularMap: null
  });
  mesh2 = new THREE.Mesh( geometry2, material2 );
  mesh2.position.z = -1000;
  mesh2.position.x = 0;

  // Add mesh to scene
  scene.add( mesh2 );

  geometry3 = new THREE.TorusKnotGeometry(60, 20, 100, 10);
  material3 = new THREE.MeshLambertMaterial({
  color: 0x7fff51,
  lightMap: null,
  lightMapIntensity: 1,
  emissive: 0x68ffd4,
  emissiveMap: null,
  emissiveIntensity: 1,
  specularMap: null
  });
  mesh3 = new THREE.Mesh( geometry3, material3 );
  mesh3.position.z = -1000;
  mesh3.position.x = 300;

  // Add mesh to scene
  scene.add( mesh3 );

}

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  mesh.rotation.x += 0.001; //Continuously rotate the mesh
  mesh.rotation.y += 0.002;
  mesh2.rotation.x += 0.005;
  mesh2.rotation.y += 0.005;
  mesh3.rotation.x += 0.02;
  mesh3.rotation.y += 0.01;

  renderer.setClearColor("#55496b");

  // Render the scene
  renderer.render(scene, camera);
};

init();
geometry();
render();
