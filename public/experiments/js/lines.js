
let canvasWidth = 800;
let canvasHeight = 800;


let lines = []
let cycle = 0


let defaultSettings = {
	bgColor: '#BADA55',
	strokeWeight: 8,
	numLines: 80,
	vMax: 10,
	calculateV: (ob) => {
		return ((ob.yMid/canvasHeight)  * ob.vMax ) + 1
	}
}

let wild1 = {
	bgColor: '#8BCE00',
	numLines: 80,
	vMax: 10,
	calculateV: (ob) => {
		return ((ob.yMid/canvasHeight)  * ob.vMax ) + (ob.id +1)
	}
}

let splash = {
	numLines: 40,
	vMax: 2,
	calculateV: (ob) => {
		return ((ob.yMid/canvasHeight)  * ob.vMax ) + (ob.id +1)
	}
}

let three = {
	bgColor: '#53b5b5',
	strokeWeight: 4,
	numLines: 33,
	vMax: 40,
	calculateV: (ob) => {
		return ((ob.yMid/canvasHeight/2)  * (ob.vMax + ob.id) )
	}
}

let four = {
	bgColor: '#ffffff',
	strokeWeight: 2,
	numLines: 20,
	vMax: 2,
	calculateV: (ob) => {
		return ob.vMax + ob.id
	}
}

// change this to change the vibe
let settings = {...defaultSettings,
// ...wild1
// ...splash
...three
// ...four
}




class Line {
	constructor(id, x) {
		this.vMax = settings.vMax
		this.id = id
		this.x1 = x
		this.y1 = 0
		this.x2 = x
		this.y2 = canvasHeight
		this.yMid = canvasHeight /2

		this.direction = 1

		// alternate up and down
		if(this.id % 2 === 0) {
			// this.direction = -1 
		}

		this.v = this.calculateV()
	}

	calculateV() {
		return settings.calculateV(this)
	}

	renderSelf() {
		// strokeWeight(2)
		// line(this.x1,this.y1,this.x2,this.yMid)
		strokeWeight(settings.strokeWeight)
		line(this.x1,this.yMid,this.x2,this.y2)
	}

	update(cycle) {
		//move
		this.yMid = this.yMid + (this.v * this.direction)

		// change direction if reaches the end
		if(this.yMid >= canvasHeight) {
			this.direction = -1
		}
		if(this.yMid <= 1) {
			this.direction = 1
		}

		this.v = this.calculateV()
	}
}

function setup() {
	createCanvas(canvasWidth, canvasHeight);
	strokeCap(SQUARE);

	for(let i = 0; i < settings.numLines; i++) {
		let x = (canvasWidth / settings.numLines) * i
		lines.push(new Line(i, x))
	}
}

function draw() {
	background(settings.bgColor);

	for(let i = 0; i < settings.numLines; i++){
		lines[i].renderSelf()
		lines[i].update(cycle++)
	}
}