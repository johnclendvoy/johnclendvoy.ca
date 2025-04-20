"use strict";

// Author John C. Lendvoy
// For /r/proceduralgeneration Nov 2016

//GLOBAL VARIABLES

// size of canvas
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 800;

var canvas_div;

// color intensity limits
var COLOR_LOWER_THRESHOLD = 30;
var COLOR_UPPER_THRESHOLD = 255;

var STAR_PROB_LOWER_THRESHOLD = 0.000001;
var STAR_PROB_UPPER_THRESHOLD = 0.0005;

var MOON_SIZE_LOWER_THRESHOLD = 40;
var MOON_SIZE_UPPER_THRESHOLD = 200;

var PEAK_HEIGHT_LOWER_THRESHOLD = CANVAS_HEIGHT;
var PEAK_HEIGHT_UPPER_THRESHOLD = CANVAS_HEIGHT/3;

// constant colors
var WHITE;
var BLACK;
var GREY;
var DARK_GREY;

function defineColors()
{
	WHITE = color(255,255,255);
	BLACK = color(30,30,30);
	DARK_GREY = color(80,80,80);
	GREY = color(120,120,120);
}


/*
* Initialize variables.
*/
function setup()
{
	defineColors();

	// create the canvas
	canvas_div = document.getElementById('canvas-div');

	// CANVAS_WIDTH = canvas_div.offsetWidth;
	// CANVAS_HEIGHT = (CANVAS_WIDTH*2)/3;

	var canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	canvas.parent('canvas-div');

	drawScene();
}


function drawScene() {

	// pick the sky colors
	var top_color = getRandomColor();
	var bottom_color = getRandomColor();

	var star_prob = getRandomStarProb();

	drawSky(top_color, bottom_color);
	drawStars(star_prob);
	drawMoon();
	drawMountains(GREY, 0);
	drawMountains(DARK_GREY, 50);
	drawMountains(BLACK, 100);
}


function drawSky(t_color, b_color)
{
	background(t_color);

	for(var i = 0; i < height; i++)
	{
		var amount = i/height;
		var mixed_color = lerpColor(t_color, b_color, amount)
		stroke(mixed_color);
		line(0, i, width, i);
	}
}

function drawStars(star_prob) {

	// loop over each pixel
	for(var i = 0; i < width; i++)
	{
		for(var j = 0; j < height; j++)
		{
			if(shouldDrawStar(star_prob))
			{
				drawStar(i,j);
			}
		}
	}
}

function shouldDrawStar(prob)
{
	return random() < prob;
}

function drawStar(x, y)
{
	var size = getRandomStarSize();
	noStroke();
	fill(WHITE);
	ellipse(x, y, size, size);
}

function drawMoon() {
	var size = getRandomMoonSize();
	var x = getRandomMoonPosition(size, width);
	var y = getRandomMoonPosition(size, height/2);
	noStroke();
	fill(WHITE);
	ellipse(x, y, size, size);
}


function drawMountains(color, offset) {

	var h_jump = getRandomJump();
	var v_jump = getRandomJump();
	var j =  getRandomPeakHeight(0,height); //starting point
	var goal = getRandomPeakHeight(0, j); // get initial peak
	var direction = getDirection(j, goal); // find the direction needed to travel to get to the peak

	fill(color);

	beginShape();
	vertex(0,height);

	// move across canvas left to right
	for(var i = 0; i < width; i=i+h_jump)
	{
		j = j + v_jump;

		// draw the line
		fill(color);
		vertex(i, j+offset);

		if(reachedGoal(j, goal, direction))
		{
			goal = getRandomPeakHeight(direction, j);
			direction = getDirection(j, goal);
		}
		// update new jup distances
		h_jump = getRandomJump()
		v_jump = direction * getRandomJump()
	}
	vertex(width,j);
	vertex(width,height);
	endShape(CLOSE);
}

function reachedGoal(pos, goal, dir) {
	// going down and below goal
	if(1 == dir && pos >= goal)
	{
		return true;
	}
	//going up and below goal
	else if(-1 == dir && pos <= goal)
	{
		return true;
	}
	// not there yet
	else
	{
		return false;
	}
}

function getDirection(cur, goal)
{
	if(cur > goal)
	{
		return -1; // must go up to reach goal
	}
	else
	{
		return 1; //must go down to reach goal
	}
}

function getRandomColor()
{
	var r = getRandomColorComponent();
	var g = getRandomColorComponent();
	var b = getRandomColorComponent();

	return color(r, g, b);
}

function getRandomColorComponent()
{
	return random(COLOR_LOWER_THRESHOLD, COLOR_UPPER_THRESHOLD);
}

function getRandomStarProb()
{
	return random(STAR_PROB_LOWER_THRESHOLD, STAR_PROB_UPPER_THRESHOLD);
}

function getRandomMoonSize()
{
	return random(MOON_SIZE_LOWER_THRESHOLD, MOON_SIZE_UPPER_THRESHOLD);
}

function getRandomPeakHeight(direction, pos)
{
	if(1 == direction) // at valley, new peak should be above
	{
		var lower = pos;
		var upper = PEAK_HEIGHT_UPPER_THRESHOLD;
	}
	else if(-1 == direction) //at peak, new peak should be below
	{
		var lower = PEAK_HEIGHT_LOWER_THRESHOLD;
		var upper = pos;
	}
	else // starting off, dont car where first peak is
	{
		var lower = PEAK_HEIGHT_LOWER_THRESHOLD;
		var upper = PEAK_HEIGHT_UPPER_THRESHOLD;
	}

	return random(lower, upper);
}

function getRandomStarSize()
{
	// mean, sd
	return randomGaussian(2, 1.5);
}

function getRandomJump()
{
	return randomGaussian(10, 5);
}

function getRandomMoonPosition(size, limit)
{
	var half = size/2;
	return random(0+half, limit-half);
}

function keyTyped()
{
	if(key === 'p') {
		print("pausing");
	}
}

function mousePressed()
{
	drawScene();
}

function windowResized() {
	CANVAS_WIDTH = canvas_div.offsetWidth;
	CANVAS_HEIGHT = (CANVAS_WIDTH*9)/16;
	resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	drawScene();
}

