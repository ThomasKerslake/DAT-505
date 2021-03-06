//Global Vars
var myAudioContext, myAudio, highQual, lowQual, medQual;
// Post Processing Params
var params = {
  enable: 'After',
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0,
};

// Creating my Class
class Visualization{
    constructor(options){
        //Changeable options
        this.particles = options.particles; // This controles the number of particles that are stored in each array
        this.ease = options.ease; // This is a modifier for controling the speed at which the particles move.
        //Particle storage
        this.particlesStored1 = [];
        this.particlesStored2 = [];
        this.particlesStored3 = [];
        this.particlesStored4 = [];
        //Stores new objs that I add to the scene
        this.myObj = [];

        //The starting value of scences that needs to be subtracted from length of scene.children.length
        //It is used to stop the value of the for loop in the render from overflowing
        //For every new addition to my scene the value increments by (1) --> this.segregation++
        this.segregation = 1;
    }

//Start of the Init
    init(){
        //Creating the scene
        this.scene = new THREE.Scene();
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        //Setting up scene camera
        this.camera = new THREE.PerspectiveCamera( 50, this.windowWidth / this.windowHeight, 0.1, 5000 );
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor( 0x000000, 0 );
        //composer for my AfterimagePass
        this.composer = new THREE.EffectComposer( this.renderer );
        this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
        //composer for my bloomPass
        this.composerALT = new THREE.EffectComposer( this.renderer );
        this.composerALT.addPass( new THREE.RenderPass( this.scene, this.camera ) );
        //composer for my TAAPass
        this.composerTAA = new THREE.EffectComposer( this.renderer );
        this.composerTAA.addPass( new THREE.RenderPass( this.scene, this.camera ) );
        //Setting camera position / Setting the size of both composers + renderer
        this.camera.position.set(0, -100, 1000);
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        this.composer.setSize(this.windowWidth, this.windowHeight);
        this.composerALT.setSize(this.windowWidth, this.windowHeight);
        this.composerTAA.setSize(this.windowWidth, this.windowHeight);

        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
				this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //Arrays to hold method names for organization of my particles
        this.index = 0;
        this.shape = ['ring1', 'ring2', 'line', 'ring3'];
        this.octahedron = ['octc'];
        //Inititation of my DAT GUI
        this.gui = new dat.GUI( { name: 'MyGui' } );

        //Setting up the Orbit Controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

        // Render this to the body
        document.body.appendChild(this.renderer.domElement);

        //methods to run
        this.render();
        this.addPostProcessing();
        this.addParticlesSet1();
        this.addParticlesSet2();
        this.addParticlesSet3();
        this.addParticlesSet4();
        this.addAmbientLight();
        this.addSpotLight();
        this.addCenterChildren();
        this.initAudio();

        //Event listeners for screen size change / file upload
        window.addEventListener( 'resize', this.resize.bind(this));
        document.getElementById("file").addEventListener('change', this.onFileSelect.bind(this));
        // Display the fall back button
        document.getElementById("file").addEventListener('change', function(){
          var help = document.getElementById('mybtn');
          help.style.display = "block";
          setTimeout(function(){help.remove();}, 5000); // Remove after 5 seconds
        });


			//End of INIT -----------------------------------------------------------
    }

    //Init Audio to process the audio for the visualization
    initAudio(){
        myAudio = new Audio()
        this.audioObj = myAudio;
        this.audioObj.controls = true;
        document.body.appendChild(this.audioObj); // Render my audioObj to page body

        //Init context/analyser
        myAudioContext = new AudioContext();
        this.audioContext = myAudioContext;
        this.source = this.audioContext.createMediaElementSource(this.audioObj);
        this.analyser = this.audioContext.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.bufferLength = this.analyser.frequencyBinCount;
        this.frequencyData = new Uint8Array(this.bufferLength); //Stores frequencyData
    }

    //Analyser for the audio
    analyseAudio(){
        requestAnimationFrame(this.analyseAudio.bind(this));
        this.analyser.getByteFrequencyData(this.frequencyData);
    }

    //This controls the source of the audio (the file the user selects)
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
        requestAnimationFrame(this.render.bind(this)); //bind render
        for (let i=0; i<(this.scene.children.length)-this.segregation; i++) { // For loop for total children in scene
            //Choose Shape from array to render with particals

            //Shape selection  //Selecting particle Array  //particle index  //Stored audio frequencies
            //E.g. this[ring1](pass arguments ...)
            this[this.shape[0]](this.particlesStored1[i], i, this.frequencyData[i]);
            this[this.shape[2]](this.particlesStored2[i], i, this.frequencyData[i]);
            this[this.shape[1]](this.particlesStored3[i], i, this.frequencyData[i]);
            this[this.shape[3]](this.particlesStored4[i], i, this.frequencyData[i]);
            this[this.octahedron[0]](this.myObj[0],this.frequencyData[i]);
        }
        if(params.enable == 'After'){ //Rendering with composer for After image
        this.composer.render();
      }
      else if(params.enable == 'Bloom'){ //Rendering with composer for UnrealBloom
        this.composerALT.render();
      }
      else{ // Render with composer for TAA
        this.composerTAA.render();
      }
    }

    addPostProcessing(){
    // After image post processing
    var afterimagePass = new THREE.AfterimagePass();
    afterimagePass.uniforms['damp'].value = 0.98; // Value for Afterimage 'amount'
  	afterimagePass.renderToScreen = true;
  	this.composer.addPass( afterimagePass ); //Add effect to composer

    // Bloom Pass post processing
    var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.3, 0.5, 0.75 );
    bloomPass.renderToScreen = true;
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    this.composerALT.addPass( bloomPass ); //Add effect to composerALT

    //TAA Pass post processing
    var taaRenderPass = new THREE.TAARenderPass( this.scene, this.camera );
    taaRenderPass.renderToScreen = true;
		taaRenderPass.unbiased = false;
    taaRenderPass.sampleLevel = 2;
		this.composerTAA.addPass( taaRenderPass ); //Add effect to composerTAA

    //Adding Datgui options to change after image value / enable and edit UnrealBloom effect / TAA
    //Gui Section that controls my Afterimage options
    this.gui.add( afterimagePass.uniforms[ "damp" ], 'value', 0, 1 ).step( 0.001 );
    this.gui.add( params, 'enable', ['After', 'Bloom', 'TAA']); // Selection for what effect the user wants to view

    //Gui Section that controls my Bloom options
    this.gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) { bloomPass.threshold = Number( value );});
		this.gui.add( params, 'bloomStrength', 0.0, 4.0 ).onChange( function ( value ) { bloomPass.strength = Number( value );});
		this.gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) { bloomPass.radius = Number( value );});

    }

    //Window resize method
    resize(){
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.windowWidth, this.windowHeight); //Updating renderer size
        this.composer.setSize(this.windowWidth, this.windowHeight); //Updating compser size
        this.composerALT.setSize(this.windowWidth, this.windowHeight); //Updating composerALT size
        this.composerTAA.setSize(this.windowWidth, this.windowHeight); //Updating composerTAA size
    }

    //Scene AmbientLight
    addAmbientLight(){
      let ambLight
      ambLight = new THREE.AmbientLight( 0xc4c4c4 ); // Creating an AmbientLight for my scene
      this.scene.add(ambLight); //Adding AmbientLight to scene
    }

    //Scene spotLight
    addSpotLight(){
      var spotLight = new THREE.SpotLight( 0xc4c4c4 ); // Creating a SpotLight for my scene
      spotLight.position.set( 0, 0, 300 ); // projected from the top - > down
      this.scene.add( spotLight ); //Adding SpotLight to scene
      this.segregation++
     }

    // The creation of the center object of my design (Black Octahedron)
    addCenterChildren(){
      let myChildObj1;
      let rotationX = 1.58;
      this.childObj = new THREE.OctahedronGeometry(7,0);  // Creating Octahedron
      this.childObjMat = new THREE.MeshLambertMaterial({  //Setting the material to Lambert
       color:0x000000,
      });
      myChildObj1 = new THREE.Mesh(this.childObj, this.childObjMat);
      myChildObj1.rotation.x = rotationX;
      this.gui.add( myChildObj1.rotation, 'x', 0, 5 ).step( 0.001 );
      this.scene.add(myChildObj1); //Adding my Object to scene
      this.myObj.push(myChildObj1); // Pushing the new Octahedron to be stored in the myObj array
      this.segregation++
    }

    //First Particel set
    addParticlesSet1(){
        let particle1,i;
        for (i = 0; i < this.particles; i++) { // For loop to run through and create a number of particles equal to my particle option.
						this.sph1 = new THREE.SphereGeometry(2, 32, 32 );
						this.sphMat1 = new THREE.MeshLambertMaterial({
             color:0x23ffff
            });
           particle1  = new THREE.Mesh(this.sph1, this.sphMat1);
            this.scene.add(particle1);//Adding particles to scene
            this.particlesStored1.push(particle1); // Pushing the generated particles to be stored in my first array
        }
    }

    //Functions same as above
    // Second Particle set (Creation of centre lines)
    addParticlesSet2(){
        let particle2,i;
        for (i = 0; i < this.particles; i++) {
						this.box = new THREE.BoxGeometry( 1, 10, 1);
						this.boxMat = new THREE.MeshLambertMaterial({
             color:0x23ffff,
             wireframe:true
            });
           particle2  = new THREE.Mesh(this.box, this.boxMat);
            this.scene.add(particle2);//Adding particles to scene
            this.particlesStored2.push(particle2);// Pushing the generated particles to be stored in my second array
            this.segregation++;
        }
    }

    //Functions same as above
    // Third Particle set
    addParticlesSet3(){
        let particle3,i;
        for (i = 0; i < this.particles; i++) {
						this.sph2 = new THREE.SphereGeometry( 2, 32, 32 );
						this.sphMat2 = new THREE.MeshLambertMaterial({
             color:0x23ffff
            });
           particle3  = new THREE.Mesh(this.sph2, this.sphMat2);
            this.scene.add(particle3);//Adding particles to scene
            this.particlesStored3.push(particle3);// Pushing the generated particles to be stored in my third array
            this.segregation++;
        }
      }

      //Functions same as above
      // Fourth Particle set
        addParticlesSet4(){
            let particle4,i;
            for (i = 0; i < this.particles; i++) {
    						this.sph3 = new THREE.SphereGeometry( 2, 32, 32 );
    						this.sphMat3 = new THREE.MeshLambertMaterial({
                 color:0x23ffff
                });
               particle4  = new THREE.Mesh(this.sph3, this.sphMat3);
                this.scene.add(particle4);//Adding particles to scene
                this.particlesStored4.push(particle4); // Pushing the generated particles to be stored in my fourth array
                this.segregation++;
            }
    }

    // Method for creating the centre object
    octc(part, frequency){ //Octc Parameters
      part.position.z += ((frequency * this.ease * 1) - part.position.z) * this.ease; //Adjusting z positioning of my Object
      part.scale.z = 15; // Setting shape size (scale)
      part.scale.x = 11; // Setting shape size (scale)
      part.scale.y = 11; // Setting shape size (scale)
      part.position.z = 50;
      part.scale.y += (Math.min(1) * frequency / 15);
      part.scale.x += (Math.min(1) * frequency / 15);
      part.scale.z += (Math.min(1) * frequency / 15);
    }

  // These are different shapes that can be used when creating the layout of the particals -------------------------
  // These also control how the particles in the project move
    ring1(part, index, frequency){ //Ring parameters
      var q = (index + 3000 + frequency * 50) * 0.05; //Size of circle
     part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;//Adjusting x positioning of particle
     part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;//Adjusting y positioning of particle
     part.position.z += ((frequency * this.ease * 0.1) - part.position.z) * this.ease; //Adjusting z positioning of parameter
     part.position.x += Math.sin(frequency / 15) * 20;
     part.position.y += Math.cos(frequency / 15) * 20;
     part.position.z -= Math.cos(frequency / 15) * 20;
     part.material.color.offsetHSL((frequency/2000) / 512, 0.1, 0); //This slowly changes the colour of the particles according to the frequency
      }

    //Functions the same as above
    ring2(part, index, frequency){
        var q = (index + 3000 + frequency * 50) * 0.05;
       part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
       part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
       part.position.z += ((frequency * this.ease * 0.1) - part.position.z) * this.ease;
       part.position.x -= Math.sin(frequency / 15) * 20;
       part.position.z -= Math.cos(frequency / 15) * 20;
       part.material.color.offsetHSL((frequency/2000) / 512, 0.1, 0);
        }
    //Functions the same as above
    ring3(part, index, frequency){
          var q = (index + 3000 + frequency * 50) * 0.05;
         part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
         part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
         part.position.z += ((frequency * this.ease * 0.1) - part.position.z) * this.ease;
         part.position.x -= Math.sin(frequency / 15) * 20;
         part.position.y -= Math.cos(frequency / 15) * 20;
         part.position.z -= Math.cos(frequency / 15) * 20;
         part.material.color.offsetHSL((frequency/2000) / 512, 0.1, 0);
          }
      //Functions the same as above, however this is the used to control the lines in the center the project
      line(part, index, frequency){
        var q = (index + 3000 + frequency * 0.5) * 0.02;
         part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
         part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
        part.position.z += ((frequency * this.ease * 2) - part.position.z) * this.ease;
         part.scale.y += ((frequency * this.ease * 2) - part.scale.y) * this.ease;
        part.rotation.z = 360 / Math.PI + index;    //This controls the rotation of the z index on the lines.
        part.material.color.offsetHSL((frequency/2000) / 512, 0.1, 0);
        }

}

//quality selection buttons
//These 'buttons' are displayed on an overlay when the user loads the page.
highQual = document.getElementById("High");
medQual = document.getElementById("Med");
lowQual = document.getElementById("Low");

//High -> creates a new 'Visualization' class with the number of particles limited to 60
highQual.addEventListener('click', function(){
  document.getElementById("overlay").style.display = "none";
  var animate = new Visualization({particles: 60, ease: 0.1});
  animate.init();
});

//Medium -> creates a new 'Visualization' class with the number of particles limited to 45
medQual.addEventListener('click', function(){
  document.getElementById("overlay").style.display = "none";
  var animate = new Visualization({particles: 45, ease: 0.1});
  animate.init();
});

//Low -> creates a new 'Visualization' class with the number of particles limited to 30
lowQual.addEventListener('click', function(){
  document.getElementById("overlay").style.display = "none";
  var animate = new Visualization({particles: 30, ease: 0.1});
  animate.init();
});

// Fall back button for if the visualization is not running
document.getElementById('mybtn').addEventListener('click', function() {
  myAudioContext.resume().then(() => {
    console.log('Playback resumed successfully');
    document.getElementById("mybtn").outerHTML = "";
  });
});
