
let cols = 10;
let rows = 10;
let offsetX;
let offsetY;

function setup() {
	createCanvas(800, 800);
	noStroke()
	offsetX = width/cols;
	offsetY = height/rows;
}

function draw() {
	background(220,mouseY/height*225, mouseX/width*225);
	fill(mouseY/height*225, mouseX/width*225, 220);

	for(let i = 0; i < cols; i++) {

		x = (i * offsetX) + offsetX/2;

		for(let j = 0; j < cols; j++) {
			y = (j * offsetY) + offsetY/2;

			let diffX =  Math.abs(x - mouseX)/width;
			let diffY = Math.abs(y - mouseY)/height;

			let circleSizeX = offsetX - (offsetX * diffX);
			let circleSizeY = offsetY - (offsetY * diffY);
			ellipse(x,y, circleSizeX, circleSizeY);
		}
	}
}