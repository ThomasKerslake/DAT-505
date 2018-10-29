var renderer, scene, camera, box, boxGeometry, boxMaterial;
var x, y, width, height;
var cubes = [];

var W = window.innerWidth,
    H = window.innerHeight;

function init() {
  scene = new THREE.Scene();


  camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
  camera.position.set(0, 55, 85);
  camera.lookAt(scene.position);

  var light1 = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light1);

var light2 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light2);

    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(0, 500, 0);
    scene.add(spotLight);
  //spotLight.castShadow = true;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0x17293a);
  renderer.setSize(W, H);
  //renderer.shadowMapEnabled = true;

  //Create a new array that will store multiple cubes


  //Create a two dimensional grid of objects, and position them accordingly
  for (x = -30; x <= 30; x += 10) { // Start from -45 and sequentially add one every 5 pixels
    for (y = -30; y <= 30; y += 10) {
      boxGeometry = new THREE.BoxGeometry(3, 2, 3);
      //The color of the material is assigned a random color
      boxMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xFFFFFF});
      box = new THREE.Mesh(boxGeometry, boxMaterial);

      //box.castShadow = true;

      box.position.x = x;
      box.position.z = y;
      box.scale.y = 2;

      scene.add(box);
      cubes.push(box);
    }
  }

  document.body.appendChild(renderer.domElement);
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
  for(var i= 0; i < cubes.length; i++){
    //cubes[i].rotation.y += Math.random() * 0.010 * Math.PI;
    if(i % 2 == 0){
      cubes[i].rotation.y -= Math.random() * 0.010 * Math.PI;
      cubes[i].rotation.x -=  Math.random() * 0.010 * Math.PI;
    }
  else{
    cubes[i].rotation.y += Math.random() * 0.010 * Math.PI;
    cubes[i].rotation.x +=  Math.random() * 0.010 * Math.PI;
    }
  }
  renderer.render(scene, camera);
}






/*function drawFrame(){
  requestAnimationFrame(drawFrame);
  for(var i= 0; i < cubes.length; i++){
    cubes[i].rotation.y += Math.random() * 0.010 * Math.PI;
    cubes[i].rotation.x +=  Math.random() * 0.010 * Math.PI;
  }*/

init();
drawFrame();
