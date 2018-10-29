var scene, camera, renderer;
var width, height;


scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 2.5;
renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor("#fcfcfc");
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var controls = new THREE.OrbitControls(camera, renderer.domElement);

window.addEventListener( 'resize', ()=>{
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

var light1 = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light1);

var light2 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light2);

    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(0, 500, 0);
    scene.add(spotLight);

var geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
var material = new THREE.MeshPhongMaterial({
  color: 0xebb4ed,
  shininess: 3});
var cube01 = new THREE.Mesh( geometry, material );
cube01.position.x = 2;
scene.add( cube01 );

var geometry = new THREE.BoxGeometry( 1.2,1.2,1.2 );
var material = new THREE.MeshBasicMaterial( { color: "#FF00FF",wireframe:true,transparent:true,opacity: 0.3 } );
var cube01_wireframe = new THREE.Mesh( geometry, material );
cube01_wireframe.position.x = 2;
scene.add( cube01_wireframe );

var geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
var material = new THREE.MeshPhongMaterial({
  color: 0xebb4ed,
  shininess: 3});
var cube02 = new THREE.Mesh( geometry, material );
cube02.position.x = -2;
scene.add( cube02 );

var geometry = new THREE.BoxGeometry( 1.2,1.2,1.2 );
var material = new THREE.MeshBasicMaterial({color:"#FF00FF",wireframe:true,transparent:true,opacity: 0.3});
var cube02_wireframe = new THREE.Mesh( geometry, material );
cube02_wireframe.position.x = -2;
scene.add( cube02_wireframe );

var geometry = new THREE.BoxGeometry( 0.5, 0.1, 0.1 );
var material = new THREE.MeshPhongMaterial({
  color: 0xebb4ed,
  shininess: 3});
var bar01 = new THREE.Mesh( geometry, material );
scene.add( bar01 );

var geometry = new THREE.BoxGeometry( 0.5, 0.1, 0.1 );
var material = new THREE.MeshPhongMaterial({
  color: 0xebb4ed,
  shininess: 3});
var bar02 = new THREE.Mesh( geometry, material );
bar02.position.z = 0.001;
scene.add( bar02 );

// Render Loop
var render = function () {
  requestAnimationFrame( render );
  cube01.rotation.x += 0.01;
  cube01.rotation.y += 0.011;

  cube01_wireframe.rotation.x += 0.012;
  cube01_wireframe.rotation.y += 0.011;

  cube02.rotation.x -= 0.011;
  cube02.rotation.y -= 0.01;


  cube02_wireframe.rotation.x -= 0.012;
  cube02_wireframe.rotation.y -= 0.013;

  bar01.rotation.y = 15;
  bar01.rotation.x = 15;
  bar02.rotation.y = 45;
  bar02.rotation.x = 45;

  bar01.rotation.z+=0.01;
  bar02.rotation.z+=0.01;



  //Render the scene
  renderer.render(scene, camera);
};

render();
