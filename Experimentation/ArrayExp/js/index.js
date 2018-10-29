var renderer, scene, camera, box, x, y;

//Create a new array that will store multiple cubes
var cubes = [];

function init() {
  scene = new THREE.Scene();

  var W = window.innerWidth,
      H = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
  camera.position.set(0, 55, 85);
  camera.lookAt(scene.position);

  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(0, 500, 0);
  scene.add(spotLight);
  //spotLight.castShadow = true;

  var light1 = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light1);

  var light2 = new THREE.PointLight(0xffffff, 0.5);
  scene.add(light2);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0x17293a);
  renderer.setSize(W, H);
  //renderer.shadowMapEnabled = true;


  //Create a two dimensional grid of objects, and position them accordingly
  for (x = -25; x <= 25; x += 5) { // Start from -45 and sequentially add one every 5 pixels
    for (y = -10; y <= 10; y += 5) {
      var boxGeometry = new THREE.BoxGeometry(3, 6, 3);
      //The color of the material is assigned a random color
      var boxMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xFFFFFF});
      box = new THREE.Mesh(boxGeometry, boxMaterial);

      //box.castShadow = true;

      box.position.x = x;
      box.position.z = y;
      box.scale.y = 4;

      scene.add(box);
      cubes.push(box);
    }
  }

  document.body.appendChild(renderer.domElement);
}

function drawFrame(){
  requestAnimationFrame(drawFrame);

  cubes[12].rotation.y += 0.01;
  cubes[30].rotation.y += 0.01;

  renderer.render(scene, camera);
}

init();
drawFrame();
