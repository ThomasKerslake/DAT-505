
class Visualization{
    constructor(options){
        //Changeable options
        this.particles = options.particles;
        this.ease = options.ease;
        //Particle storage
        this.particlesStored1 = [];
        this.particlesStored2 = [];
        this.particlesStored3 = [];
        this.particlesStored4 = [];
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
        this.camera = new THREE.PerspectiveCamera( 50, this.windowWidth / this.windowHeight, 0.1, 5000 );
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.setClearColor(0x000000, 0.0);
        this.composer = new THREE.EffectComposer( this.renderer );
        this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
        this.camera.position.set(0, -100, 1000);
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        this.composer.setSize(this.windowWidth, this.windowHeight);
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
				this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.index = 0;
        this.shape = ['ring1', 'ring2', 'line', 'ring3'];
        this.octahedron = ['oct1','octc'];

        //Setting up the Orbit Controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

        // Render this to the body
        document.body.appendChild(this.renderer.domElement);

        this.render();
        this.addPostProcessing();
        this.addParticlesSet1();
        this.addParticlesSet2();
        this.addParticlesSet3();
        this.addParticlesSet4();
        this.addAmbientLight();
        //this.addPlane();
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
            this[this.shape[0]](this.particlesStored1[i],i, this.frequencyData[i]);
            this[this.shape[2]](this.particlesStored2[i],i, this.frequencyData[i]);
            this[this.shape[1]](this.particlesStored3[i],i, this.frequencyData[i]);
            this[this.shape[3]](this.particlesStored4[i],i, this.frequencyData[i]);
            this[this.octahedron[1]](this.myObj[0],this.frequencyData[i]);
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
      spotLight.position.set( 0, 0, 300 ); //150
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
      let myChildObj1;
      this.childObj = new THREE.OctahedronGeometry(7,0);
      this.childObjMat = new THREE.MeshLambertMaterial({
       color:0x000000,
      });
      myChildObj1 = new THREE.Mesh(this.childObj, this.childObjMat);
      myChildObj1.castShadow = true;
      myChildObj1.rotation.x =1.67;
      this.scene.add(myChildObj1);
      this.myObj.push(myChildObj1);
      this.segregation++
    }

    // addPlane(){
    //   let myPlane;
    //   this.planeGeo = new THREE.PlaneGeometry(300, 300, 32);
    //   this.planeMat = new THREE.MeshLambertMaterial( {color: 0x000000 , side: THREE.FrontSide} );
    //   myPlane = new THREE.Mesh( this.planeGeo, this.planeMat );
    //   myPlane.receiveShadow = true;
    //   myPlane.position.z = -10;
    //   this.scene.add(myPlane);
    //   this.segregation++
    // }

    addParticlesSet1(){
        let particle1,i;
        for (i = 0; i < this.particles; i++) {
						this.box = new THREE.SphereGeometry( 2, 32, 32 );
						this.boxMat = new THREE.MeshLambertMaterial({
             color:0x23ffff
            });
           particle1  = new THREE.Mesh(this.box, this.boxMat);
           particle1.castShadow = true;
            this.scene.add(particle1);
            this.particlesStored1.push(particle1);
        }
    }

    addParticlesSet2(){
        let particle2,i;
        for (i = 0; i < this.particles; i++) {
						this.box2 = new THREE.BoxGeometry( 1, 10, 1);
						this.boxMat2 = new THREE.MeshLambertMaterial({
             color:0x23ffff,
             wireframe:true
            });
           particle2  = new THREE.Mesh(this.box2, this.boxMat2);
           //particle2.rotation.x = 1.6
           particle2.castShadow = true;
            this.scene.add(particle2);
            this.particlesStored2.push(particle2);
            this.segregation++;
        }
    }

    addParticlesSet3(){
        let particle3,i;
        for (i = 0; i < this.particles; i++) {
						this.box3 = new THREE.SphereGeometry( 2, 32, 32 );
						this.boxMat3 = new THREE.MeshLambertMaterial({
             color:0x23ffff
            });
           particle3  = new THREE.Mesh(this.box3, this.boxMat3);
           //particle2.rotation.x = 1.6
           particle3.castShadow = true;
            this.scene.add(particle3);
            this.particlesStored3.push(particle3);
            this.segregation++;
        }
      }

        addParticlesSet4(){
            let particle4,i;
            for (i = 0; i < this.particles; i++) {
    						this.box4 = new THREE.SphereGeometry( 2, 32, 32 );
    						this.boxMat4 = new THREE.MeshLambertMaterial({
                 color:0x23ffff
                });
               particle4  = new THREE.Mesh(this.box4, this.boxMat4);
               //particle2.rotation.x = 1.6
               particle4.castShadow = true;
                this.scene.add(particle4);
                this.particlesStored4.push(particle4);
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
      part.rotation.z += (frequency * this.ease * 0.00003) * this.ease;
      part.scale.z = 15;
      part.scale.x = 11;
      part.scale.y = 11;
      part.position.z = 50;
      part.scale.y += (Math.min(1) * frequency / 15);
      part.scale.x += (Math.min(1) * frequency / 15);
      part.scale.z += (Math.min(1) * frequency / 15);
      //part.material.color.offsetHSL((frequency/10000) / 512, 0.1, 0);
      //part.material.rotation -= 0.01;
    }

    // These are different shapes that can be used when creating the layout of the particals
    //Change value of this.shape

    ring1(part, index, frequency){         //0.5
      var q = (index + 3000 + frequency * 50) * 0.05;
     part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
     part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
     part.position.z += ((frequency * this.ease * 0.1) - part.position.z) * this.ease;
     part.position.x += Math.sin(frequency / 15) * 20; //100
     part.position.y += Math.cos(frequency / 15) * 20; // 100
     //part.position.z -= Math.sin(frequency / 15) * 20; // 100
     part.material.color.offsetHSL((frequency/2000) / 512, 0.1, 0);
      }

    ring2(part, index, frequency){        //0.5
        var q = (index + 3000 + frequency * 50) * 0.05;
       part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
       part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
       part.position.z += ((frequency * this.ease * 0.1) - part.position.z) * this.ease;
       part.position.x -= Math.sin(frequency / 15) * 20; //100
       part.position.z -= Math.cos(frequency / 15) * 20; // 100
       //part.position.z -= Math.sin(frequency / 15) * 20; // 100
       part.material.color.offsetHSL((frequency/2000) / 512, 0.1, 0);
        }

      ring3(part, index, frequency){        //0.5
          var q = (index + 3000 + frequency * 50) * 0.05;
         part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
         part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
         part.position.z += ((frequency * this.ease * 0.1) - part.position.z) * this.ease;
         part.position.x -= Math.sin(frequency / 15) * 20; //100
         part.position.y -= Math.cos(frequency / 15) * 20; // 100
         //part.position.z -= Math.sin(frequency / 15) * 20; // 100
         part.material.color.offsetHSL((frequency/2000) / 512, 0.1, 0);
          }

      line(part, index, frequency){
        var q = (index + 3000 + frequency * 0.5) * 0.02;
         part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
         part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
        part.position.z += ((frequency * this.ease * 2) - part.position.z) * this.ease;
         part.scale.y += ((frequency * this.ease * 2) - part.scale.y) * this.ease;
         //part.scale.y += ((frequency * this.ease * 2) - part.scale.y) * this.ease;
        //part.rotation.z += ((frequency * this.ease * 2) - part.rotation.z) * this.ease; ;
        part.rotation.z = 360 / Math.PI + index;
        part.material.color.offsetHSL((frequency/2000) / 512, 0.1, 0);
        }





    //   let sqrt = Math.sqrt(this.scene.children.length);
    // part.position.x += ((index % sqrt * 10) * sqrt - 1000)  - part.position.x;
    // part.position.y += ((Math.floor(index /100) * 10 - sqrt) - part.position.y);
    // part.scale.y += ((frequency * this.ease * 1) - part.scale.y) * 0.02;
    // part.scale.x += ((frequency * this.ease * 1) - part.scale.x) * 0.02;
    // part.scale.z += ((frequency * this.ease * 1) - part.scale.z) * 0.02;
    // part.rotation.y += ((frequency * this.ease * 1) - part.rotation.y) * 0.02;
    // //part.position.y = -500;
    // part.position.x += Math.sin(frequency / 200) * 20; //100
    // part.position.y += Math.cos(frequency / 200) * 20;
    // part.material.color.offsetHSL((frequency/100) / 512, 0.1, 0);

      // ring2(part, index, frequency){
      //   var q = (index + 1000 + frequency * 0.5) * 0.04;
      //  part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
      //  part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
      //  //part.position.z += ((frequency * this.ease * 2) - part.position.z) * this.ease;
      //  part.scale.y += ((frequency * this.ease * 2) - part.scale.y) * this.ease;
      //  part.rotation.z = 1 ;
      //   }

}

//On load run class
window.onload = ()=>{
    var animate = new Visualization({particles: 60, ease: 0.1});
    animate.init();
};
