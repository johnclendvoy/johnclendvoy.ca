
let cols = 8;
let rows = 8;
let offsetX;
let offsetY;


function drawFace(x, y) {
	// face
	fill(255, 255, 0);
	ellipse(x,y, 90, 90);

	// eyes
	fill(0);
	ellipse(x + 10, y - 10, 10, 20);
	ellipse(x - 10, y - 10, 10, 20);

	// mouth
	arc(x, y + 10, 50, 50, 0, PI, OPEN)
}

function setup() {
	createCanvas(800, 800);
	// noStroke()
	offsetX = width/cols;
	offsetY = height/rows;

	background(0, 100, 0);

	for(let i = 0; i < cols; i++) {

		x = (i * offsetX) + offsetX/2;

		for(let j = 0; j < cols; j++) {
			y = (j * offsetY) + offsetY/2;

			drawFace(x,y)
		}
	}
}