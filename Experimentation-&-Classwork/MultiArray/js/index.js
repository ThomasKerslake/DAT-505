var renderer, scene, camera;
var tetras = []; //tetras[] needs to be globally declared so that we can access them from any function
var cubes = [];
var z, x, y;


//Create two arrays to store random values for speed rotation
var randomRotationX = [];
var randomRotationY = [];

function init() {
  scene = new THREE.Scene();

  var W = window.innerWidth,
      H = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
  camera.position.set(0, 80, 0);
  camera.lookAt(scene.position);

  var light1 = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light1);


  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(0, 1000, 0);
  scene.add(spotLight);
  //spotLight.castShadow = true;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0xffbf3f);
  renderer.setSize(W, H);
  //renderer.shadowMapEnabled = true;

  //Create a two dimensional grid of objects, and position them accordingly
  for (x = -20; x <= 20; x += 10) { // Start from -45 and sequentially add one every 5 pixels
    for ( y = -20; y <= 20; y += 10) {
      var tetsGeometry = new THREE.TetrahedronGeometry(3, 4);
      //The color of the material is assigned a random color
      var tetsMaterial = new THREE.MeshLambertMaterial({color:0x5c07b7, wireframe:true});
      var tets = new THREE.Mesh(tetsGeometry, tetsMaterial);

      var cubesGeometry = new THREE.BoxGeometry(6, 6, 6);
      var box = new THREE.Mesh(cubesGeometry, tetsMaterial);

      //tets.castShadow = true;


      tets.position.x = x;
      tets.position.z = y;
      tets.scale.y = 0.5;

      box.position.x = x;
      box.position.z = y;
      box.scale.y = 0.5;

      // tets.rotation.x = Math.random() * 2 * Math.PI;;
      // tets.rotation.y = Math.random() * 2 * Math.PI;;
      // tets.rotation.z = Math.random() * 2 * Math.PI;;

      //Create random values for x and y, and store them on the arrays
      var randomValueX = (Math.random() * 0.1) - 0.05;
      var randomValueY = (Math.random() * 0.1) - 0.05;
      randomRotationX.push(randomValueX);
      randomRotationY.push(randomValueY);

      scene.add(tets);
      scene.add(box);
      tetras.push(tets);
      cubes.push(box);
    }
  }
  //console.log(randomRotation);
  document.body.appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  window.addEventListener( 'resize', ()=>{
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
}

function drawFrame(){
  requestAnimationFrame(drawFrame);

  //Rotation speed is extracted from the arrays we created
  //i is keeping track of the index for each cube
  tetras.forEach((c, i)=> {
    c.rotation.x += randomRotationX[i];
    c.rotation.y += randomRotationY[i];
  });

  cubes.forEach((v, z)=> {
    v.rotation.x += randomRotationX[z];
    v.rotation.y += randomRotationY[z];
  });

  renderer.render(scene, camera);
}

init();
drawFrame();
