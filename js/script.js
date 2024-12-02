// Existing Particle Animation Code (p5.js)
let p5Particles = []; 
let numParticles;
let maxConnectionDist = 150;

// Define the "no-go zone" for particles (center rectangle)
const noGoZone = {
  x: 0.3,
  y: 0.3,
  width: 0.4,
  height: 0.4,
};

function setup() {
  let container = document.getElementById('sketch-container');
  let containerWidth = container.offsetWidth;
  let containerHeight = container.offsetHeight;
  
  adjustParticleCount(containerWidth, containerHeight); // Adjust particle count based on container size
  let canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent('sketch-container'); // Attach canvas to the container
  background(0);
  initializeParticles();
}

function draw() {
  background(0, 100);

  // Draw connections between particles
  for (let i = 0; i < p5Particles.length; i++) {
    for (let j = i + 1; j < p5Particles.length; j++) {
      let p1 = p5Particles[i];
      let p2 = p5Particles[j];
      let distance = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);

      if (distance < maxConnectionDist) {
        let alpha = map(distance, 0, maxConnectionDist, 255, 50);
        stroke(255, alpha);
        strokeWeight(1);
        line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
      }
    }
  }

  // Update and display particles
  for (let p of p5Particles) {
    p.update();
    p.display();
  }
}

// Adjust particle count based on container dimensions
function adjustParticleCount(width, height) {
  const area = width * height;
  numParticles = Math.floor(area / 30000);
  numParticles = constrain(numParticles, 20, 100);
}

function initializeParticles() {
  p5Particles = [];
  for (let i = 0; i < numParticles; i++) {
    p5Particles.push(new Particle());
  }
}

class Particle {
  constructor() {
    let pos;
    do {
      pos = createVector(random(width), random(height));
    } while (this.isInNoGoZone(pos));
    this.pos = pos;

    this.vel = p5.Vector.random2D().mult(random(0.1, 0.5));
    this.radius = random(5, 10);
    this.pulseDirection = 1;
  }

  update() {
    this.pos.add(this.vel);

    // Reflect off edges of the canvas
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    // Reflect off the edges of the "no-go zone"
    if (this.isInNoGoZone(this.pos)) {
      if (this.pos.x > noGoZone.x * width && this.pos.x < (noGoZone.x + noGoZone.width) * width) {
        this.vel.x *= -1;
      }
      if (this.pos.y > noGoZone.y * height && this.pos.y < (noGoZone.y + noGoZone.height) * height) {
        this.vel.y *= -1;
      }
    }

    // Pulsing effect
    this.radius += this.pulseDirection * 0.1;
    if (this.radius > 12 || this.radius < 5) this.pulseDirection *= -1;
  }

  display() {
    noStroke();
    fill(0, 255, 255, 200);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);

    stroke(255, 100);
    strokeWeight(2);
    noFill();
    ellipse(this.pos.x, this.pos.y, this.radius * 2.5);
  }

  isInNoGoZone(pos) {
    return (
      pos.x > noGoZone.x * width &&
      pos.x < (noGoZone.x + noGoZone.width) * width &&
      pos.y > noGoZone.y * height &&
      pos.y < (noGoZone.y + noGoZone.height) * height
    );
  }
}

function windowResized() {
  let container = document.getElementById('sketch-container');
  let containerWidth = container.offsetWidth;
  let containerHeight = container.offsetHeight;

  resizeCanvas(containerWidth, containerHeight);
  adjustParticleCount(containerWidth, containerHeight);
  initializeParticles();
  background(0);
}

function toggleMenu() {
  var nav = document.querySelector('nav ul');
  var burger = document.querySelector('.burger');
  nav.classList.toggle('open');
  burger.classList.toggle('active'); // Add animation to burger icon
}

// Adjust menu on window resize
window.addEventListener('resize', function () {
  var nav = document.querySelector('nav ul');
  if (window.innerWidth > 768) {
    nav.classList.remove('open');
    document.querySelector('.burger').classList.remove('active');
  }
});

// Minimize menu on significant scroll
let lastScrollY = window.scrollY;

window.addEventListener('scroll', function () {
  var nav = document.querySelector('nav ul');
  var burger = document.querySelector('.burger');
  if (nav.classList.contains('open') && Math.abs(window.scrollY - lastScrollY) > 50) {
    nav.classList.remove('open');
    burger.classList.remove('active');
  }
  lastScrollY = window.scrollY;
});

// Neural Network Animation Code
(function() {
  // Encapsulate variables to avoid conflicts
  const neuralParticles = [];
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');

  // Define layers
  const layers = {
      input: 5,
      hidden: 7,
      output: 3,
  };

  // Nodes and connections
  const nodes = { input: [], hidden: [], output: [] };
  const connections = [];

  // Initialize nodes
  function createNodes(layer, count, yOffset) {
      for (let i = 0; i < count; i++) {
          nodes[layer].push({
              x: layer === 'input' ? 100 : layer === 'hidden' ? 300 : 500,
              y: yOffset + i * 40,
              size: 8,
              isHovered: false,
              phase: Math.random() * Math.PI * 2,
              prediction: null,
          });
      }
  }

  // Create connections
  function createConnections(fromLayer, toLayer) {
      nodes[fromLayer].forEach(fromNode => {
          nodes[toLayer].forEach(toNode => {
              connections.push({
                  from: fromNode,
                  to: toNode,
                  glow: 0,
              });
          });
      });
  }

  // Initialize network
  function initNeuralNetwork() {
      // Create nodes for each layer
      createNodes('input', layers.input, 80);
      createNodes('hidden', layers.hidden, 40);
      createNodes('output', layers.output, 100);

      // Connect layers
      createConnections('input', 'hidden');
      createConnections('hidden', 'output');
  }

  // Draw nodes
  function drawNodes(layer) {
      nodes[layer].forEach(node => {
          node.phase += 0.02; // Adjust speed of pulsation
          const pulsateSize = node.size + Math.sin(node.phase) * 2;

          ctx.beginPath();
          ctx.arc(node.x, node.y, pulsateSize, 0, Math.PI * 2);
          if (node.isHovered) {
              ctx.fillStyle = '#FFFFFF'; // White when hovered
              ctx.shadowColor = '#FFFFFF';
              ctx.shadowBlur = 20;
          } else {
              ctx.fillStyle = '#00FFFF'; // Cyan glow
              ctx.shadowColor = '#00FFFF';
              ctx.shadowBlur = 10;
          }
          ctx.fill();

          // If output node and has prediction, draw it
          if (layer === 'output' && node.prediction) {
              ctx.font = '12px Roboto';
              ctx.fillStyle = '#FFFFFF';
              ctx.fillText(node.prediction, node.x + 10, node.y);
          }
      });
  }

  // Draw connections
  function drawConnections() {
      connections.forEach(connection => {
          ctx.beginPath();
          ctx.moveTo(connection.from.x, connection.from.y);
          ctx.lineTo(connection.to.x, connection.to.y);

          let glow = connection.glow;
          if (connection.from.isHovered || connection.to.isHovered) {
              glow = 1; // Full glow if connected to hovered node
              ctx.strokeStyle = `rgba(255, 255, 255, ${glow})`; // White for hovered
          } else {
              ctx.strokeStyle = `rgba(0, 255, 255, ${glow})`; // Cyan
          }
          ctx.lineWidth = 2;
          ctx.stroke();
      });
  }

  // Animate network
  function animateNeuralNetwork() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update connections glow
      connections.forEach(connection => {
          connection.glow = 0.7 + Math.sin(Date.now() / 1000) * 0.2; // Slower glow
      });

      // Update particles
      for (let i = neuralParticles.length - 1; i >= 0; i--) {
          const particle = neuralParticles[i];
          const segment = particle.path[particle.pathIndex];
          const fromNode = segment.from;
          const toNode = segment.to;

          // Update progress
          particle.progress += particle.speed;
          if (particle.progress >= 1) {
              particle.progress = 0;
              particle.pathIndex++;
              if (particle.pathIndex >= particle.path.length) {
                  // Particle has reached the end
                  const lastNode = particle.path[particle.path.length - 1].to;
                  // Set prediction
                  lastNode.prediction = getRandomPrediction();
                  // Clear prediction after 2 seconds
                  setTimeout(() => {
                      lastNode.prediction = null;
                  }, 2000);
                  neuralParticles.splice(i, 1);
                  continue;
              }
          }

          // Draw particle
          const x = fromNode.x + (toNode.x - fromNode.x) * particle.progress;
          const y = fromNode.y + (toNode.y - fromNode.y) * particle.progress;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 15;
          ctx.fill();
      }

      // Draw layers and connections
      drawConnections();
      drawNodes('input');
      drawNodes('hidden');
      drawNodes('output');

      requestAnimationFrame(animateNeuralNetwork);
  }

  // Generate random prediction
  function getRandomPrediction() {
      const predictions = ['Yes', 'No', 'Maybe'];
      return predictions[Math.floor(Math.random() * predictions.length)];
  }

  // Mousemove effect
  canvas.addEventListener('mousemove', function(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const allNodes = nodes.input.concat(nodes.hidden, nodes.output);

      allNodes.forEach(node => {
          const dx = x - node.x;
          const dy = y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < node.size + 5) { // Node radius plus padding
              node.isHovered = true;
          } else {
              node.isHovered = false;
          }
      });
  });

  // Click effect
  canvas.addEventListener('click', () => {
      // For each input node, create a particle
      nodes.input.forEach(inputNode => {
          // Create a path for the particle
          const path = [];

          // From input node, randomly select a connected hidden node
          const connectedHiddenNodes = nodes.hidden.filter(hiddenNode => {
              return connections.some(connection => connection.from === inputNode && connection.to === hiddenNode);
          });
          const randomHiddenNode = connectedHiddenNodes[Math.floor(Math.random() * connectedHiddenNodes.length)];

          // From hidden node, randomly select an output node
          const connectedOutputNodes = nodes.output.filter(outputNode => {
              return connections.some(connection => connection.from === randomHiddenNode && connection.to === outputNode);
          });
          const randomOutputNode = connectedOutputNodes[Math.floor(Math.random() * connectedOutputNodes.length)];

          // Build path
          path.push({ from: inputNode, to: randomHiddenNode });
          path.push({ from: randomHiddenNode, to: randomOutputNode });

          // Create particle
          neuralParticles.push({
              path: path,
              pathIndex: 0, // Start at first segment
              progress: 0, // Start at 0 progress
              speed: 0.02 + Math.random() * 0.02, // Random speed
          });
      });
  });

  // Initialize and start animation
  initNeuralNetwork();
  animateNeuralNetwork();

})(); // End of IIFE