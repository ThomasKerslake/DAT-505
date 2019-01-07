
class Visualization{
    constructor(options){
        //Changeable options
        this.particles = options.particles;
        this.ease = options.ease;
        //Particle storage
        this.particlesStored = [];
        this.particlesStored2 = [];
        this.particlesStored3 = [];
        //Stores new objs
        this.myObj = [];
        //The starting value of scences that need to be subtracted from length of scene.children.length
        //It is used to stop the value of the for loop in the render from overflowing
        //For every new addition to my scene the value increments by (1) --> this.segregation++
        this.segregation = 1;
    }

//Start of the Init
    init(){
        this.scene = new THREE.Scene();
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.camera = new THREE.PerspectiveCamera( 90, this.windowWidth / this.windowHeight, 0.1, 5000 );
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.setClearColor(0x000000, 0.0);
        this.composer = new THREE.EffectComposer( this.renderer );
        this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
        this.camera.position.set(0, -95, 30);
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        this.composer.setSize(this.windowWidth, this.windowHeight);
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
				this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.index = 0;
        this.shape = ['line0', 'line1'];
        this.octahedron = ['oct1','octc'];

        //Setting up the Orbit Controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

        // Render this to the body
        document.body.appendChild(this.renderer.domElement);

        this.render();
        this.addPostProcessing();
        this.addParticles();
        this.addParticles2();
        this.addAmbientLight();
        this.addPlane();
        this.addSpotLight();
        this.addCenterChildren();
        this.initAudio();

        //Add listeners
        window.addEventListener( 'resize', this.resize.bind(this));
        document.getElementById("file").addEventListener('change', this.onFileSelect.bind(this));

			//End of INIT -----------------------------------------------------------
    }

    initAudio(){
        //Init Audio
        this.audioObj = new Audio();
        this.audioObj.controls = true;
        document.body.appendChild(this.audioObj);

        //Init context/analyser
        this.audioContext = new AudioContext();
        this.source = this.audioContext.createMediaElementSource(this.audioObj);
        this.analyser = this.audioContext.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.bufferLength = this.analyser.frequencyBinCount;
        this.frequencyData = new Uint8Array(this.bufferLength);
    }

    analyseAudio(){
        requestAnimationFrame(this.analyseAudio.bind(this));
        this.analyser.getByteFrequencyData(this.frequencyData);
    }

    onFileSelect(z){
        //Links the selected audio (taget file -> posistion [0])
        this.audioObj.src = URL.createObjectURL(z.target.files[0]);
        this.audioObj.play();
        this.analyseAudio();
        //Removes 'text' on change
        document.getElementById("myLabel").outerHTML = "";
        document.getElementById("file").outerHTML = "";
    }

    render(){
        requestAnimationFrame(this.render.bind(this));
        for (let i=0; i<(this.scene.children.length)-this.segregation; i++) {
            //Choose Shape to render
            this[this.shape[0]](this.particlesStored[i],i, this.frequencyData[i]);
            this[this.shape[1]](this.particlesStored2[i],i, this.frequencyData[i]);
            this[this.octahedron[1]](this.myObj[0],this.frequencyData[i]);
            this[this.octahedron[1]](this.myObj[1],this.frequencyData[i]);//this.frequencyData[i]
            this[this.octahedron[1]](this.myObj[2],this.frequencyData[i]);
            this[this.octahedron[1]](this.myObj[3],this.frequencyData[i]);

        }
        this.composer.render();
    }

    addPostProcessing(){

    var afterimagePass = new THREE.AfterimagePass();
    afterimagePass.uniforms['damp'].value = 0.98;
  	afterimagePass.renderToScreen = true;
  	this.composer.addPass( afterimagePass );

    var taaRenderPass = new THREE.TAARenderPass( this.scene, this.camera );
		taaRenderPass.unbiased = false;
    taaRenderPass.sampleLevel = 2;
		this.composer.addPass( taaRenderPass );

    var smaaPass = new THREE.SMAAPass( window.innerWidth * this.renderer.getPixelRatio(), window.innerHeight * this.renderer.getPixelRatio() );
		smaaPass.renderToScreen = true;
		this.composer.addPass( smaaPass );

    var effect2 = new THREE.ShaderPass( THREE.RGBShiftShader );
    effect2.uniforms[ 'amount' ].value = 0;
    effect2.renderToScreen = true;
    this.composer.addPass( effect2 );

// Taa and smaaa shader pass test, after image does not work with SMAA and effect2
    }

    resize(){
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        this.composer.setSize(this.windowWidth, this.windowHeight);
    }

    addAmbientLight(){
      let ambLight
      ambLight = new THREE.AmbientLight( 0xc4c4c4 );
      this.scene.add(ambLight);
    }

    addSpotLight(){
      var spotLight = new THREE.SpotLight( 0xc4c4c4 );
      spotLight.position.set( 0, 0, 150 );
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      spotLight.shadow.camera.near = 10;
      spotLight.shadow.camera.far = 1000;
      spotLight.shadow.camera.fov = 90;

      this.scene.add( spotLight );
      this.segregation++
     }


    addCenterChildren(){
      let myChildObj1, myChildObj2, myChildObj3, myChildObj4, myChildObj5;
      this.childObj = new THREE.OctahedronGeometry(7,0);
      this.childObjMat = new THREE.MeshLambertMaterial({
       color:0x42f498,
      });
     myChildObj1 = new THREE.Mesh(this.childObj, this.childObjMat);
     myChildObj1.position.z = 20;
     myChildObj1.position.x = -20;
     myChildObj1.position.y = -10 - 30;
     myChildObj1.castShadow = true;
     this.scene.add(myChildObj1);
     this.myObj.push(myChildObj1);
     this.segregation++

     myChildObj2 = new THREE.Mesh(this.childObj, this.childObjMat);
     myChildObj2.position.z = 20;
     myChildObj2.position.x = -30 + - 30;
     myChildObj2.position.y = -10 - 30;
     myChildObj2.castShadow = true;
     this.scene.add(myChildObj2);
     this.myObj.push(myChildObj2);
     this.segregation++

     myChildObj3 = new THREE.Mesh(this.childObj, this.childObjMat);
     myChildObj3.position.z = 20;
     myChildObj3.position.x = 30 + 30;
     myChildObj3.position.y = -10 - 30;
     myChildObj3.castShadow = true;
     this.scene.add(myChildObj3);
     this.myObj.push(myChildObj3);
     this.segregation++

     myChildObj4 = new THREE.Mesh(this.childObj, this.childObjMat);
     myChildObj4.position.z = 20;
     myChildObj4.position.y = -10 - 30;
     myChildObj4.position.x = 20;
     myChildObj4.castShadow = true;
     this.scene.add(myChildObj4);
     this.myObj.push(myChildObj4);
     this.segregation++
    }

    addPlane(){
      let myPlane;
      this.planeGeo = new THREE.PlaneGeometry(300, 300, 32);
      this.planeMat = new THREE.MeshLambertMaterial( {color: 0xf442dc , side: THREE.FrontSide} );
      myPlane = new THREE.Mesh( this.planeGeo, this.planeMat );
      myPlane.receiveShadow = true;
      myPlane.position.z = -10;
      this.scene.add(myPlane);
      this.segregation++
    }

    addParticles(){
        let particle,i;
        for (i = 0; i < this.particles; i++) {
						this.box = new THREE.BoxGeometry( 3 , 100, 3);
						this.boxMat = new THREE.MeshLambertMaterial({
             color:0x42f498
            });
           particle  = new THREE.Mesh(this.box, this.boxMat);
           particle.rotation.x = 1.6; //1.6
           particle.castShadow = true;
            this.scene.add(particle);
            this.particlesStored.push(particle);
        }
    }

    addParticles2(){
        let particle2,i;
        for (i = 0; i < this.particles; i++) {
						this.box2 = new THREE.BoxGeometry( 3, 100, 3);
						this.boxMat2 = new THREE.MeshLambertMaterial({
             color:0x42f498
            });
           particle2  = new THREE.Mesh(this.box2, this.boxMat2);
           particle2.rotation.x = 1.6;
           particle2.castShadow = true;
            this.scene.add(particle2);
            this.particlesStored2.push(particle2);
            this.segregation++;
        }
    }


    oct1(part){
      //part.scale.y = (Math.min(0.5));
      //part.scale.x = (Math.min(0.5));
      //part.scale.y += ((frequency * this.ease * 0.2) - part.scale.y) * this.ease;
      //part.scale.x += ((frequency * this.ease * 0.2) - part.scale.x) * this.ease;
      part.rotation.z += 0.00002;
    }

    octc(part, frequency){
      part.position.z += ((frequency * this.ease * 1) - part.position.z) * this.ease;
      part.rotation.z += (frequency * this.ease * 0.0002) * this.ease;
      part.scale.z = 1;
      part.scale.x = 0.7;
      part.scale.y = 0.7;
      part.position.z = 5;
      part.material.color.offsetHSL((frequency/5000) / 512, 0.1, 0);
      //part.material.rotation -= 0.01;
    }

    // These are different shapes that can be used when creating the layout of the particals
    //Change value of this.shape

	line0(part, index, frequency){
    let sqrt = Math.sqrt(this.scene.children.length);
  part.position.x += ((index % sqrt) * 15 - sqrt)  - part.position.x;
  part.position.y += ((Math.floor(index /1000) * 10 - sqrt) - part.position.y);
  part.position.z += ( -55 +(frequency * 0.3) - part.position.z) * this.ease;
    }

    line1(part, index, frequency){
      let sqrt = Math.sqrt(this.scene.children.length);
    part.position.x += ((index % sqrt) * -15 - sqrt)  - part.position.x;
    part.position.y += ((Math.floor(index /1000) * 10 - sqrt) - part.position.y);
    part.position.z += ( -55 +(frequency * 0.3) - part.position.z) * this.ease;
      }

}

//On load run class
window.onload = ()=>{
    var animate = new Visualization({particles: 12, ease: 0.15});
    animate.init();
};
