
const canvasWidth = 800;
const canvasHeight = 800;

const maxVelocity = 1;
const defaultBodyColor = '#4de8bc66'

const numOrganisms = 10;
let organisms = [];

const Direction = {
	UP: 'UP',
	DOWN: 'DOWN',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
}

const mapDirectionToXVelocity = {
	UP: 0,
	DOWN: 0,
	LEFT: -1,
	RIGHT: 1,
}
const mapDirectionToYVelocity = {
	UP: -1,
	DOWN: 1,
	LEFT: 0,
	RIGHT: 0,
}
const mapReverseDirection = {
	UP: Direction.DOWN,
	DOWN: Direction.UP,
	LEFT: Direction.RIGHT,
	RIGHT: Direction.LEFT,
}

class Organism {

	constructor(x, y, direction, allowOverlap) {
		this.allowOverlap = allowOverlap;
		this.isAlive = true;
		this.direction = direction;
		this.size = 80;
		this.bodyColor = defaultBodyColor;
		this.xVelocity = mapDirectionToXVelocity[direction];
		this.yVelocity = mapDirectionToYVelocity[direction];
		this.xPosition = x
		this.yPosition = y
	}


	render() {
		fill(this.bodyColor);
		rect(this.xPosition, this.yPosition, this.size, this.size);
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

	collidedWith(organism) {
		const xDiff = Math.abs(this.xPosition - organism.xPosition);
		const yDiff = Math.abs(this.yPosition - organism.yPosition);
		const sharedSize = this.size/2 + organism.size/2;

		if(this.allowOverlap || organism.allowOverlap) {
			return false;
		}

		return  yDiff <= sharedSize && xDiff <= sharedSize;
	}

	reverseDirection() {
		this.direction = mapReverseDirection[this.direction];
		this.xVelocity = mapDirectionToXVelocity[this.direction];
		this.yVelocity = mapDirectionToYVelocity[this.direction];
	}
}

function setup() {
	createCanvas(canvasWidth, canvasHeight);
	rectMode(CENTER)
	noStroke();

	for(let i = 0; i < numOrganisms; i++ ) {
		organisms[i] = new Organism(random(canvasWidth), random(canvasHeight), random(Object.values(Direction)));
	}
}

function draw() {
	background('#0b382b');

	for(let i = 0; i < organisms.length; i++ ) {
		if(organisms[i].isAlive) {
			organisms[i].move();
			let isColliding = false
			for(let j = 0; j < organisms.length; j++ ) {
				if(i !== j) {
					if(organisms[i].collidedWith(organisms[j])) {
						isColliding = true
						continue;
					}
				}
			}
			if(isColliding) {
				organisms[i].bodyColor = '#00ff0066';
				// organisms[i].reverseDirection();
				// if(organisms.length < 50) {
				// 	organisms = [...organisms, new Organism(organisms[i].xPosition, organisms[i].yPosition, mapReverseDirection[organisms[i].direction], true)];
				// }
			} else {
				organisms[i].bodyColor = defaultBodyColor;
			}
		}
		organisms[i].render();
	}
}