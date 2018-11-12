var renderer, scene, camera;
var cubes = [];

function init() {
  scene = new THREE.Scene();

  var W = window.innerWidth,
      H = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
  camera.position.set(0, 55, 85);
  camera.lookAt(scene.position);

  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(0, 1000, 0);
  scene.add(spotLight);
  spotLight.castShadow = true;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xffe45e);
  renderer.setSize(W, H);
  renderer.shadowMapEnabled = true;

  //Create a two dimensional grid of objects, and position them accordingly
  for (var x = -20; x <= 20; x += 10) { // Start from -45 and sequentially add one every 5 pixels
    for (var y = -20; y <= 20; y += 10) {
      var octGeometry = new THREE.DodecahedronGeometry(4,0);
      //The color of the material is assigned a random color
      var octMaterial = new THREE.MeshLambertMaterial({color: 0x79ff5e});
      var oct = new THREE.Mesh(octGeometry, octMaterial);

      oct.castShadow = true;

      oct.position.x = x;
      oct.position.z = y;
      oct.scale.y = 0.5;

      scene.add(oct);
      cubes.push(oct);
    }
  }

var geometry = new THREE.PlaneGeometry( 70, 70, 32);
var material = new THREE.MeshBasicMaterial( {color: 0xf7b242, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );
plane.receiveShadow = true;
scene.add( plane );
plane.rotation.x = 1.57;
plane.position.y = -10;

  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 0.5);
  lights[0].position.set(1, 0, 0);
  lights[1] = new THREE.DirectionalLight( 0xffffff, 0.5);
  lights[1].position.set(-0.75, -1, 0.5);
  scene.add(lights[0]);
  scene.add(lights[1]);


  document.body.appendChild(renderer.domElement);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
}
window.addEventListener( 'resize', ()=>{
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  });

var spin = 0;

function drawFrame(v){
  requestAnimationFrame(drawFrame);
  spin += 0.01;

  cubes.forEach(function(c, i) {
    //c.rotation.x = spin;
    c.rotation.y = spin;
    //sin (speed - frequency - amplitude)
    //c.scale.y = Math.sin(v/500 * Math.PI + c.position.x * 4.95) + 1;
    c.scale.y = Math.sin(v/1000*Math.PI + c.position.x*4.95 + c.position.z/10) + 1;
    //c.scale.y = Math.cos(v/500*Math.PI + c.position.x*4.95 + c.position.z/10) + 1;
  });

  renderer.render(scene, camera);
}

init();
drawFrame();
