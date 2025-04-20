"use strict";

// Size of Board
var gridWidth = 800;
var gridHeight = 800;

var canvas_div;

var numColumns = 32;
var numRows = 32;
var colWidth;
var rowHeight;

// User interface specs
var uiBarHeight = 40;

// Speed of Game must be >= 1, larger number makes slower game.
var speed = 10;

// Rules
var minToLive = 2; //2
var maxToLive = 3; //3
var revive = [3]; //3

// A counter to keep track of how many iteratons of the draw() loop have been done.
var loop;
var paused;

// What was the status of the first cell that was clicked, so the next cells dragged can be inverted properly
var startDragStatus;

// Enum type for state
var Status = {"DEAD":0, "ALIVE":1};

// An array of cells
var cells;

/*
* Initialize the main 2d array of cells. 
* Can set some cells to be alive, otherwise they are starting as dead.
*/
function initCells() {
	for(var i = 0; i < numColumns; i++) {
		for(var j = 0; j < numRows; j++) {
			if( (i == 1 && j == 3) ||
				(i == 2 && j == 3) ||
				(i == 3 && j == 3) ||
				(i == 3 && j == 2) ||
				(i == 2 && j == 1) ) {

				cells[i][j] = new Cell(i,j,Status.ALIVE);
			}
			else {
				cells[i][j] = new Cell(i,j,Status.DEAD);
			}
		}
	}
}

/*
* call update() on all cells
*/
function updateStatus() {
	for(var i = 0; i < numColumns; i++) {
		for(var j = 0; j < numRows; j++) {
			cells[i][j].update();
		}
	}
}

/*
* call change() on all cells
*/
function changeStatus() {
	for(var i = 0; i < numColumns; i++) {
		for(var j = 0; j < numRows; j++) {
			cells[i][j].change();
		}
	}
}

/*
* call drawCell() on all cells
*/
function drawCells() {
	for(var i = 0; i < numColumns; i++) {
		for(var j = 0; j < numRows; j++) {
			cells[i][j].drawCell();
		}
	}
}

/*
* Initialize variables.
*/
function setup() {

	canvas_div = document.getElementById('game-of-life-div');

	// gridWidth = canvas_div.offsetWidth;
	// gridHeight = windowHeight-100;

	if(gridWidth < 700 )
	{
		numColumns = 16;
	}
	else if(gridWidth < 1000)
	{
		numColumns = 32;
	}
	else 
	{
		numColumns = 50;
	}
	numRows = floor(numColumns * (gridHeight/gridWidth));

	var canvas = createCanvas(gridWidth,gridHeight);
	canvas.parent('game-of-life-div');
	
	cells = new Array;
	for( var i = 0; i < numColumns; i++) {
		cells[i] = new Array;	
	}

	colWidth = width/numColumns;
	rowHeight = (height-uiBarHeight)/numRows;
	
	loop = 0;

	initCells();	
	drawCells();
}


function drawUI() {
	drawCursor();
	drawUIBar();
	drawPlayButton();
	drawClearButton();
}

function drawUIBar() {
	noStroke();
	fill( 100,100,100);
	rect(0, height - uiBarHeight, width, uiBarHeight);
}

function drawCursor() {
	if(mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height){
		var xCoord = Math.floor(mouseX/colWidth)*colWidth;
		var yCoord = Math.floor(mouseY/rowHeight)*rowHeight;
		noFill();

		stroke(0,200,0);
		rect(xCoord,yCoord,colWidth,rowHeight);
	}
}

function drawPlayButton() {
	if(mouseInsidePlayButton()){
		fill(0,200,0);
	}
	else {
		fill(0);
	}

	var fifth = uiBarHeight/5;
	if(paused) {
		// draw play button
		triangle(fifth,height-fifth, fifth,height-(4*fifth) , 4*fifth,height-(uiBarHeight/2));
	}
	else {
		var three_fifths = 3*fifth;
		// draw pause symbol
		rect(fifth, height-(4*fifth), fifth, three_fifths);
		rect(three_fifths, height-(4*fifth), fifth, three_fifths);
	}
}

function drawClearButton() {
	if(mouseInsideClearButton()){
		fill(0,200,0);
	}
	else {
		fill(0);
	}

	var fifth = uiBarHeight/6;

	// draw clear button
	quad(
		width-(4*fifth), height-(5*fifth),
		width-(5*fifth), height-(4*fifth),
		width-(2*fifth), height-(fifth),
		width-(fifth), height-(2*fifth)
		);
	quad(
		width-(2*fifth), height-(5*fifth),
		width-(fifth), height-(4*fifth),
		width-(4*fifth), height-(fifth),
		width-(5*fifth), height-(2*fifth)
		);
}


/*
* Continue to perform this routine over and over, once setup() has completed
*/
function draw() {
	
	if(!paused) {
		if( 0 == loop % speed) {
			updateStatus();
			changeStatus();
		}

		loop++;
		if(loop > 10000){
			loop = 0;
		}
	}
	background(0);
	drawCells();

	drawUI();
}

function toggleCell(x, y, pressed) {

	// what cell was the first to be clicked, that will determine what happens when dragged
	if(pressed)
	{
		startDragStatus = cells[x][y].status;
	}

	if(paused && startDragStatus == Status.ALIVE) {
		cells[x][y].next = Status.DEAD;
		cells[x][y].status = Status.DEAD;
		cells[x][y].drawCell();
	}
	else {
		cells[x][y].next = Status.ALIVE;
		cells[x][y].status = Status.ALIVE;
		cells[x][y].drawCell();
	}
}

function mouseDragged() {
	if(mouseInsideGrid()){
		var xCoord = Math.floor(mouseX/colWidth);
		var yCoord = Math.floor(mouseY/rowHeight);
		toggleCell(xCoord, yCoord, false);
	}
}

function mousePressed() {

	if(mouseInsidePlayButton()){
		paused = !paused;
	}

	if(mouseInsideClearButton()){
		clearCells();
	}


	if(mouseInsideGrid()){
		var xCoord = Math.floor(mouseX/colWidth);
		var yCoord = Math.floor(mouseY/rowHeight);
		toggleCell(xCoord, yCoord, true);
	}
}

function keyTyped() {

	if(key === 'p') {
		paused = !paused;
	}

	if(key === 'x') {
		clearCells();
	}
}

function mouseInsidePlayButton(){
	return mouseX >= 0 && mouseX <= uiBarHeight && mouseY >= height-uiBarHeight && mouseY <= height;
}

function mouseInsideClearButton(){
	return mouseX >= width-uiBarHeight && mouseX <= width && mouseY >= height-uiBarHeight && mouseY <= height;
}

function mouseInsideGrid(){
	return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height-uiBarHeight;
}

function clearCells() {
	for(var i = 0; i < numColumns; i++) {
		for(var j = 0; j < numRows; j++) {
			cells[i][j].status = Status.DEAD;
			cells[i][j].next = Status.DEAD;
		}
	}
}

function windowResized() {
	gridWidth = canvas_div.offsetWidth;
	resizeCanvas(gridWidth, windowHeight-100);
}
