
let canvasWidth = 800;
let canvasHeight = 800;

const maxVelocity = 3;

let numOrganisms = 80;
let organisms = [];

class Organism {

	constructor(x, y) {
		this.isAlive = true;
		this.size = 8;
		this.bodyColor = '#b86800';
		this.deadColor = '#4b5250';
		this.xVelocity = random(-maxVelocity, maxVelocity);
		this.yVelocity = random(-maxVelocity, maxVelocity);
		this.xPosition = x
		this.yPosition = y
	}

	render() {
		fill( this.isAlive ? this.bodyColor : this.deadColor);
		ellipse(this.xPosition, this.yPosition, this.size, this.size);
	}

	wrap() {
		if(this.xPosition < 0) {
			this.xPosition = canvasWidth;
		}
		if(this.xPosition > canvasWidth) {
			this.xPosition = 0;
		}
		if(this.yPosition < 0) {
			this.yPosition = canvasHeight;
		}
		if(this.yPosition > canvasHeight) {
			this.yPosition = 0;
		}
	}

	move() {
		this.xPosition = this.xPosition + this.xVelocity;
		this.yPosition = this.yPosition + this.yVelocity;
		this.wrap();
	}

	canEat(organism) {
		return organism.isAlive && this.isInRange(organism) && this.isLarger(organism)
	}

	isInRange(organism) {
		return dist(this.xPosition, this.yPosition, organism.xPosition, organism.yPosition) <= this.size/2 + organism.size/2;
	}

	isLarger(organism) {
		return this.size >= organism.size;
	}


	eat(organism) {
		console.log('eating')
		this.size = this.size + organism.size;
		organism.isAlive = false;
	}
}

function setup() {
	createCanvas(canvasWidth, canvasHeight);
	ellipseMode(CENTER);
	noStroke();

	for(let i = 0; i < numOrganisms; i++ ) {
		organisms[i] = new Organism(random(canvasWidth), random(canvasHeight));
	}
}

function draw() {
	background('#09382c');

	for(let i = 0; i < organisms.length; i++ ) {
		organisms[i].render();
		if(organisms[i].isAlive) {
			organisms[i].move();

			for(let j = 0; j < organisms.length; j++ ) {
				if(i !== j) {
					if( organisms[i].canEat(organisms[j])) {
						organisms[i].eat(organisms[j]);
					}
				}

			}
		}
	}
}