
let circleSize = 0;
let growing = true;
let circleSpeed = 3;
let maxSize = 400
let minSize = 0
let circleColor = 0

function setup() {
	createCanvas(800, 800);
}

const  drawCircle = (size) => {
	circleColor = map(size, minSize, maxSize, 0, 255)
	fill(circleColor, 0, 0);
	ellipse(width/2,height/2, size, size);
}

function draw() {
	background(0)

	drawCircle(circleSize)

	if(growing) {
		circleSize += circleSpeed;
		if(circleSize >= maxSize) {
			growing = false;
		}
	} else {
		circleSize -= circleSpeed;
		if(circleSize <= minSize) {
			growing = true;
		}
	}
}