let canvas;
let numBalls = 888;
let spring = 0.088;
let gravity = -0.00005;
let friction = -0.8;
let balls = [];
let baseFont;
let title;

function windowResized() {
  resizeCanvas(displayWidth * 0.8, displayWidth * 0.8);
}

let satisfyRegular;

function preload() {
  satisfyRegular = loadFont("js/Satisfy-Regular.ttf");
}

function setup() {
  canvas = createCanvas(displayWidth * 0.8, displayHeight * 0.8);
  var wt = (windowWidth - width) / 2;
  var ht = (windowHeight - height) / 2;
  canvas.position(wt, ht);
  background(255, 0, 200);
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(random(width), random(height), tan(i), i);
  }
  noStroke();
  fill(255);
  title = new Title("S_P");
}

const emblaze = (balls) => balls.map((ball) => ball.changeColorBlack());
const randomaze = (balls) => balls.map((ball) => ball.changeColorRandom());

function draw() {
  background(255);

  balls.map((ball) => ball.move());
  balls.map((ball) => ball.collide(balls));
  balls.map((ball) => ball.display());

  title.display();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    randomaze(balls);
  } else if (keyCode === RIGHT_ARROW) {
    emblaze(balls);
  }
}

class Title {
  constructor(textIn, xIn = 500, yIn = 300) {
    this.text = textIn;
    this.x = xIn;
    this.y = yIn;
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  display() {
    textFont(satisfyRegular);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
  }
}

class Ball {
  constructor(xin, yin, din, idin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.color = [random(255), random(100), random(233)];
  }

  changeColor(r, g, b) {
    this.color = [r, g, b];
  }

  changeColorRandom() {
    this.changeColor(random(255), random(255), random(255));
  }

  changeColorBlack() {
    this.changeColor(0, 0, 0);
  }

  collide(balls) {
    balls.map((ball) => {
      let dx = this.x - ball.x;
      let dy = this.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const colliding = distance < this.diameter / 2 + ball.diameter / 2;
      if (colliding) {
        this.diameter = this.diameter - sqrt(ball.diameter / 2);
      }
    });
  }

  move() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }
  }

  display() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
    fill(...this.color);
  }
}
