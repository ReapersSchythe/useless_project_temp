let snake;
let scl = 20;
let food;
let score = 0;
let isGameOver = false;
let obstacles = [];
let cols;
let rows;

function setup() {
	createCanvas(600, 600);
	cols = floor(width / scl);
	rows = floor(height / scl);
	snake = new Snake();
	frameRate(10);
	pickFoodLocation();

	for (let i = 0; i < 10; i++) {
		let obstacle = createVector(floor(random(cols)), floor(random(rows)));
		obstacle.mult(scl);
		obstacles.push(obstacle);
	}
}

function pickFoodLocation() {
	food = createVector(floor(random(cols)), floor(random(rows)));
	food.mult(scl);
}

function mousePressed() {
	snake.grow();
}

function draw() {
	background(51);

	if (!isGameOver) {
		if (score % 5 === 0) {
			frameRate(10 + score / 5);
		}

		for (let obstacle of obstacles) {
			fill(0, 255, 255);
			rect(obstacle.x, obstacle.y, scl, scl);
		}

		if (snake.eat(food)) {
			pickFoodLocation();
			score++;
		}
		if(score == 3)
			location.href="index.html";

		snake.checkCollision(obstacles);
		snake.update();
		snake.display();

		fill(255, 0, 100);
		rect(food.x, food.y, scl, scl);
	} else {
		textSize(32);
		fill(255);
		text("Game Over", width / 2 - 100, height / 2);
		text("Score: " + score, width / 2 - 40, height / 2 + 40);
	}
}

function keyPressed() {
	switch (keyCode) {
		case UP_ARROW:
			snake.setDirection(0, -1);
			break;
		case DOWN_ARROW:
			snake.setDirection(0, 1);
			break;
		case RIGHT_ARROW:
			snake.setDirection(1, 0);
			break;
		case LEFT_ARROW:
			snake.setDirection(-1, 0);
			break;
	}
}

function Snake() {
	this.x = 0;
	this.y = 0;
	this.xspeed = 1;
	this.yspeed = 0;
	this.total = 0;
	this.tail = [];

	this.eat = function (pos) {
		let d = dist(this.x, this.y, pos.x, pos.y);
		if (d < 1) {
			this.total++;
			return true;
		} else {
			return false;
		}
	};

	this.setDirection = function (x, y) {
		this.xspeed = x;
		this.yspeed = y;
	};

	this.checkCollision = function (obstacles) {
		for (let obstacle of obstacles) {
			let d = dist(this.x, this.y, obstacle.x, obstacle.y);
			if (d < 1) {
				isGameOver = true;
			}
		}

		for (let i = 0; i < this.tail.length; i++) {
			let pos = this.tail[i];
			let d = dist(this.x, this.y, pos.x, pos.y);
			if (d < 1) {
				isGameOver = true;
			}
		}
	};

	this.update = function () {
		for (let i = 0; i < this.tail.length - 1; i++) {
			this.tail[i] = this.tail[i + 1];
		}
		if (this.total >= 1) {
			this.tail[this.total - 1] = createVector(this.x, this.y);
		}

		this.x = this.x + this.xspeed * scl;
		this.y = this.y + this.yspeed * scl;

		this.x = constrain(this.x, 0, width - scl);
		this.y = constrain(this.y, 0, height - scl);
	};

	this.display = function () {
		fill(255);
		for (let i = 0; i < this.tail.length; i++) {
			rect(this.tail[i].x, this.tail[i].y, scl, scl);
		}
		rect(this.x, this.y, scl, scl);
	};

	this.grow = function () {
		this.total++;
		this.tail.push(createVector(this.x, this.y));
	};
}

function restartGame() {
	location.reload();
}