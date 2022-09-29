let canvas;
let numBalls = 888;
let spring = 0.088;
let gravity = -0.00005;
let friction = -0.8;
let balls = [];
let baseFont;
let title;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  canvas = createCanvas(displayWidth, displayHeight);
  var wt = (windowWidth - width) / 2;
  var ht = (windowHeight - height) / 2;
  canvas.position(wt, ht);
  background(255, 0, 200);
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(
      random(width),
      random(height),
      tan(i),
      i,
      balls
    );
  }
  noStroke();
  fill(255);
  title = new Title('Scott Plunkett');
}

function draw() {
  background(255);

  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display();
    if (keyCode === LEFT_ARROW) {
      ball.changeColorBlack();
    } else if (keyCode === RIGHT_ARROW) {
      ball.changeColorRandom();
    }
  });

  title.display();
  title.move(0.05, 0.010);
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
    textFont('Georgia');
    textSize(48);
    textAlign(CENTER, CENTER)
    text(this.text, this.x, this.y);
  }
}

class Ball {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
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


  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      // console.log(others[i]);
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = sqrt(this.others[i].diameter + this.diameter);
      //   console.log(distance);
      //console.log(minDist);
      if (distance < minDist) {
        //console.log("2");
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
        this.diameter = this.diameter - sqrt(this.others[i].diameter / 2);
        this.others[i].diameter = this.others[i].diameter - this.diameter;
      }
    }
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
