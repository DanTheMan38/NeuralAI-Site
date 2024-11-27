let particles = []; 
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
  adjustParticleCount(); // Set number of particles based on screen size
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container'); // Attach canvas to the container
  background(0);
  initializeParticles();
}

function draw() {
  background(0, 100);

  // Draw connections between particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      let distance = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);

      if (distance < maxConnectionDist) {
        let alpha = map(distance, 0, maxConnectionDist, 255, 50);
        stroke(177, 102, 255, alpha);
        strokeWeight(1);
        line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
      }
    }
  }

  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function adjustParticleCount() {
  // Adjust the number of particles based on the screen size
  const area = windowWidth * windowHeight;
  numParticles = Math.floor(area / 30000); // Example scaling factor
  numParticles = constrain(numParticles, 20, 100); // Min 50, max 200 particles
}

function initializeParticles() {
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
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

    stroke(177, 102, 255, 100);
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
  adjustParticleCount(); // Recalculate particle count for new size
  resizeCanvas(windowWidth, windowHeight);
  initializeParticles(); // Reinitialize particles
  background(0);
}

// Responsive navigation menu
function toggleMenu() {
  var nav = document.querySelector('nav ul');
  if (nav.style.display === 'flex') {
    nav.style.display = 'none';
  } else {
    nav.style.display = 'flex';
    nav.style.flexDirection = 'column';
  }
}

window.addEventListener('resize', function () {
  var nav = document.querySelector('nav ul');
  if (window.innerWidth > 768) {
    nav.style.display = 'flex';
    nav.style.flexDirection = 'row';
  } else {
    nav.style.display = 'none';
  }
});