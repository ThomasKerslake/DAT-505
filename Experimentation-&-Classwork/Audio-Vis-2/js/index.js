
class Visualization{
    constructor(options){
        //Changeable options
        this.particles = options.particles;
        this.ease = options.ease;
        //particle storage
        this.particlesStored = [];
        //This is a
        this.segregation = 1;
    }

    init(){
        //Start of the Init
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 0.1, 5000 );
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor( 0x000000, 0 );
        this.camera.position.set(0, 0, 100);

        this.windowHeight = $(window).height();
        this.windowWidth = $(window).width();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;
        this.renderer.setClearColor(0x000000, 0.0);
        this.index = 0;
        this.shape = ['clam','speaker','ring','line'];

        //Setting up the Orbit Controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

        // Render this to the body
        document.body.appendChild(this.renderer.domElement);

        this.render();
        this.addParticles();
        this.addLight();

        //Add listeners
        $(window).on('resize', this.resize.bind(this));
        $('input').on('change', this.inputChange.bind(this));
        this.initAudio();

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

    inputChange(e){
        //Links the selected audio (taget file -> posistion [0])
        this.audioObj.src = URL.createObjectURL(e.target.files[0]);
        this.audioObj.play();
        this.analyseAudio();
        //Removes 'click to add MP3' on change
        $('input, label').remove();
    }

    render(){
        requestAnimationFrame(this.render.bind(this));
        for (let i=0; i<(this.scene.children.length)-this.segregation; i++) {
            //Choose Shape to render
            this[this.shape[2]](this.particlesStored[i],i, this.frequencyData[i]);
        }
        //Render
        //console.log(this.scene.children.length);
        this.renderer.render( this.scene, this.camera );
    }

    resize(){
        this.windowHeight = $(window).height();
        this.windowWidth = $(window).width();
        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.windowWidth, this.windowHeight);
    }

    addLight(){
      var lights = [];
      lights[0] = new THREE.DirectionalLight( 0xffffff, 1 );
      lights[0].position.set( 1, 0, 0 );
      lights[1] = new THREE.DirectionalLight( 0xffffff, 1 );
      lights[1].position.set( 0.75, 1, 0.5 );
      lights[2] = new THREE.DirectionalLight( 0xffffff, 1 );
      lights[2].position.set( -0.75, -1, 0.5 );
      this.scene.add( lights[0] );
      this.segregation++
      this.scene.add( lights[1] );
      this.segregation++
      this.scene.add( lights[2] );
    }

    addParticles(){
        let particle,i;
        for (i = 0; i < this.particles; i++) {
						this.box = new THREE.BoxGeometry(3, 3, 3);
						this.boxMat = new THREE.MeshLambertMaterial({
             color:0x93bcff,
             
            });
           particle  = new THREE.Mesh(this.box, this.boxMat);

            this.scene.add(particle);
            this.particlesStored.push(particle);
        }
    }

    // These are different shapes that can be used when creating the layout of the particals
    //Change value of this.shape

	ring(part, index,frequency){
    var v = (index + 1000 + frequency * 0.5) * 0.05;
   part.position.x += ((Math.sin(index * 100) * v) - part.position.x) * this.ease;
   part.position.y += ((Math.cos(index * 100) * v) - part.position.y) * this.ease;
   part.position.z += ((frequency * this.ease * 2) - part.position.z) * this.ease;
    }

    //Line
    line(part,index,frequency){
        let sqrt = Math.sqrt(this.scene.children.length);
      part.position.x += ((index % sqrt) * 10 - sqrt)  - part.position.x;
      part.position.y += ((Math.floor(index /1000) * 10 - sqrt) - part.position.y);
      part.position.z += ((frequency * 0.5) - part.position.z) * this.ease;
     }

    //Speaker
  speaker(part, index,frequency){
        var v = (index + 100 + frequency * 0.5) * 0.2;
      part.position.x += ((Math.sin(index * -0.2) * v) - part.position.x) * this.ease;
      part.position.y += ((Math.cos(index * -0.2) * v) - part.position.y) * this.ease;
      part.position.z += ((frequency * this.ease * 3.5) - part.position.z) * this.ease;
      }

    //Clam
     clam(c,index,frequency){
       var v = (index + 100 + frequency * 0.5) * 0.2;
      c.position.x += ((Math.sin(index * 100) * v) - c.position.x) * this.ease;
      c.position.y += ((Math.cos(index * 100) * v) - c.position.y) * this.ease;
      c.position.z += ((frequency * this.ease * 3) - c.position.z) * this.ease;
      }

}

//On load run class
$(function(){
    var animate = new Visualization({particles: 150, ease: 0.15});
    animate.init();
});
