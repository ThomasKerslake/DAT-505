var renderer, scene, camera, myModel;

window.onload = function() {
  init();
  geometry();
  animate();
}

function init(){
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  renderer.setClearColor(0xffffff, 1.0);
  document.body.appendChild( renderer.domElement );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );
  camera.position.z = 400;
  scene.add(camera);

  var ambientLight = new THREE.AmbientLight(0x999999, 0.5);
  scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 0.5);
  lights[0].position.set(1, 0, 0);
  lights[1] = new THREE.DirectionalLight( 0xffffff, 0.5);
  lights[1].position.set(0.75, 1, 0.5);
  lights[2] = new THREE.DirectionalLight( 0xffffff, 0.5);
  lights[2].position.set(-0.75, -1, 0.5);
  scene.add(lights[0]);
  scene.add( lights[1] );
  scene.add( lights[2] );

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function geometry(){
  myModel = new THREE.Object3D();
  scene.add(myModel);
  var mtlLoader = new THREE.MTLLoader()
  mtlLoader.load(
    'BarrellObjM.mtl',
    function (material) {
      var objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(material)
      objLoader.load(
        'BarrellObjO.obj',
        function (object) {
          myModel.add(object);
        }
      )
    }
  )
}
function animate(){
  requestAnimationFrame(animate);

  myModel.rotation.x -= 0.0020;
  myModel.rotation.y -= 0.0030;

  renderer.clear();
  renderer.render(scene, camera);
}
