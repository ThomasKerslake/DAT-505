
class Visualization{
    constructor(options){
        //Changeable options
        this.particles = options.particles;
        this.ease = options.ease;
        //particle storage
        this.particlesStored = [];
    }

    init(){
        //Start of the Init
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 0.1, 5000 );
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setClearColor( 0x000000, 0 );
        this.camera.position.set(0, 0, 100);

        this.windowHeight = $(window).height();
        this.windowWidth = $(window).width();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;
        this.renderer.setClearColor(0x000000, 0.0);
        this.index = 0;
        this.shape = 'clam';

        //Setting up the Orbit Controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

        // Render this to the body
        document.body.appendChild(this.renderer.domElement);

        this.render();
        this.addParticles();

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
        for (let i=0; i<this.scene.children.length; i++) {
            //Choose Shape to render
            this[this.shape](this.particlesStored[i],i, this.frequencyData[i]);
        }
        //Render
        this.renderer.render( this.scene, this.camera );
    }

    resize(){
        this.windowHeight = $(window).height();
        this.windowWidth = $(window).width();
        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.windowWidth, this.windowHeight);
    }

    addParticles(){
        let particle,i;
        for (i = 0; i < 200; i++) {
						this.box = new THREE.BoxGeometry(3, 3, 3);
						this.boxMat = new THREE.MeshLambertMaterial({
              color:0xd639e5,
              emissive:0xcd3bdb,
            });
            particle  = new THREE.Mesh(this.box, this.boxMat);
            this.scene.add(particle);
            this.particlesStored.push(particle);
        }
    }

	//ring(part, index,frequency){
  //  var v = (index + 1000 + frequency * 0.5) * 0.05;
  //  part.position.x += ((Math.sin(index * 100) * v) - part.position.x) * this.ease;
  //  part.position.y += ((Math.cos(index * 100) * v) - part.position.y) * this.ease;
  //  part.position.z += ((frequency * this.ease * 4) - part.position.z) * this.ease;

  //  }

    // These are different shapes that can be used when creating the layout of the particals
    //Change value of this.shape and remove comment(s) to try shape.

    //Line
    // line(part,index,frequency){
    //     let sqrt = Math.sqrt(this.scene.children.length);
    //     part.position.x += ((index % sqrt) * 10 - sqrt)  - part.position.x;
    //     part.position.y += ((Math.floor(index /1000) * 10 - sqrt) - part.position.y);
    //     part.position.z += ((frequency * 0.5) - part.position.z) * this.ease;
    // }

    //Speaker
    // speaker(part, index,frequency){
    //       var v = (index + 100 + frequency * 0.5) * 0.2;
    //       part.position.x += ((Math.sin(index * -0.2) * v) - part.position.x) * this.ease;
    //       part.position.y += ((Math.cos(index * -0.2) * v) - part.position.y) * this.ease;
    //       part.position.z += ((frequency * this.ease * 3.5) - part.position.z) * this.ease;
    //
    //   }

    //Clam
     clam(part, index,frequency){
          var v = (index + 100 + frequency * 0.5) * 0.2;
           part.position.x += ((Math.sin(index * 100) * v) - part.position.x) * this.ease;
          part.position.y += ((Math.cos(index * 100) * v) - part.position.y) * this.ease;
          part.position.z += ((frequency * this.ease * 3.5) - part.position.z) * this.ease;

      }

}

//On load run class
$(function(){
    var animate = new Visualization({particles: 1024, ease: 0.08});
    animate.init();
});
