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
        this.scene.background = new THREE.Color(0x5afcf9);
        this.camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 0.1, 5000 );
        this.renderer = new THREE.WebGLRenderer();
        this.camera.position.z = -50;
				this.camera.position.y = 1;

        this.windowHeight = $(window).height();
        this.windowWidth = $(window).width();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;
        this.renderer.setClearColor(0x000000, 0.0);
        this.index = 0;
        this.shape = 'ring';

        //Setting up the Orbit Controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

        // Render this to the body
        document.body.appendChild(this.renderer.domElement);

        this.render();
        this.addParticles();

        //Add listeners
        $(window).on('resize', this.resize.bind(this));
        $('input').on('change', this.inputChange.bind(this));
        //Change shape on click
        //$(window).on('click', this.changeShape.bind(this));
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
		//Removes 'click to add MP3' on change
    inputChange(e){
        this.audioObj.src = URL.createObjectURL(e.target.files[0]);
        this.audioObj.play();
        this.analyseAudio();
        $('input, label').remove();
    }

    render(){
        requestAnimationFrame(this.render.bind(this) );
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
						this.boxMat = new THREE.MeshNormalMaterial();
            particle  = new THREE.Mesh(this.box, this.boxMat);
            this.scene.add(particle);
            this.particlesStored.push(particle);
        }
    }


	ring(part, index,frequency){
        var v = (index + 1000 + frequency * 0.5) * 0.05;
        part.position.x += ((Math.sin(index * 100) * v) - part.position.x) * this.ease;
        part.position.y += ((Math.cos(index * 100) * v) - part.position.y) * this.ease;
        part.position.z += ((frequency * this.ease * 10) - part.position.z) * this.ease;

    }
}

$(function(){
    var animate = new Visualization({particles: 1024, ease: 0.08});
    animate.init();
});
