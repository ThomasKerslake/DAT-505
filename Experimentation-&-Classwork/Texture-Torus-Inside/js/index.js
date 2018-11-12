var camera, scene, renderer, geometry, material, mesh;
var sphere;
var controls;

window.onload = function() {
  init();
  animate();
}

function init() {
	scene = new THREE.Scene();
	scene.add(new THREE.AmbientLight(0x333333));

	var light = new THREE.DirectionalLight(0xffffff, 0.8);
	light.position.set(5,3,5);
	scene.add(light);


  tube = createTorus();
	scene.add(tube)

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
	camera.position.z = 100;
	controls = new THREE.OrbitControls( camera, renderer.domElement );
}

window.addEventListener( 'resize', ()=>{
width = window.innerWidth;
height = window.innerHeight;
renderer.setSize(width, height);
camera.aspect = width / height;
camera.updateProjectionMatrix();
});

function animate() {
  tube.rotation.x = 1.6;
	requestAnimationFrame( animate );
  tube.rotation.z += 0.005;
	renderer.render( scene, camera );
}

function createTorus(radius, segments, diameter, segments) {
	return new THREE.Mesh(
		new THREE.TorusGeometry(60,50, 40, 300),
		new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
			map:         THREE.ImageUtils.loadTexture('images/bg2.jpg'),
			//bumpMap:     THREE.ImageUtils.loadTexture('images/bg2.jpg'),
			//bumpScale:   0.05,
			//specularMap: THREE.ImageUtils.loadTexture('images/bg2.jpg'),
			//specular:    new THREE.Color('grey')
		})
	);
}
