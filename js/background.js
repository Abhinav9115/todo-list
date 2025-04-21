/**
 * NEXUS - Premium Task Management Application
 * Background Animation with Three.js
 * 
 * This file contains the Three.js implementation for the animated particle
 * background that provides a modern, dynamic visual effect.
 */

class ParticleBackground {
  constructor() {
    // Setup Three.js scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    this.init();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }
  
  /**
   * Initialize the renderer and append it to the DOM
   */
  init() {
    // Set renderer size and append to container
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-container').appendChild(this.renderer.domElement);
    
    // Set camera position
    this.camera.position.z = 5;
  }
  
  /**
   * Create the particle system
   */
  createParticles() {
    // Create particles geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    // Create particle positions array
    const posArray = new Float32Array(particlesCount * 3);
    
    // Randomly position particles in 3D space
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    // Set geometry attributes
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create material for particles
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: '#c7b299', // Match accent color
      transparent: true,
      opacity: 0.8
    });
    
    // Create the particle system mesh
    this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particlesMesh);
  }
  
  /**
   * Setup event listeners (e.g., window resize)
   */
  setupEventListeners() {
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Add mouse interaction for enhanced visual effect
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    // Update camera aspect ratio and projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * Handle mouse movement to interact with particles
   * @param {Event} event - Mouse move event
   */
  handleMouseMove(event) {
    // Calculate normalized mouse position (-1 to 1)
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Subtle rotation based on mouse position
    this.particlesMesh.rotation.x += mouseY * 0.0003;
    this.particlesMesh.rotation.y += mouseX * 0.0003;
  }
  
  /**
   * Animation loop
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    // Rotate particles slowly for ambient motion
    this.particlesMesh.rotation.x += 0.0005;
    this.particlesMesh.rotation.y += 0.0003;
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * Update particle color (for theme switching)
   * @param {string} color - New color for particles
   */
  updateColor(color) {
    this.particlesMesh.material.color.set(color);
  }
}

// Initialize the background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const background = new ParticleBackground();
  
  // Update particle color when theme changes
  const themeSwitch = document.getElementById('themeSwitch');
  themeSwitch.addEventListener('click', () => {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    background.updateColor(isDarkTheme ? '#e3e3e3' : '#c7b299');
  });
}); 