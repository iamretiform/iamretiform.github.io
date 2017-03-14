$( document ).ready(function() {
  var canvas,
  ctx,
  width,
  height,
  xCenter,
  yCenter,
  startRadius,
  planets,
  meteors,
  tick,
  PI,
  TWOPI;

function rand( min, max ) {
  return Math.random() * ( max - min ) + min;
}

function randInt( min, max ) {
  return Math.floor( min + Math.random() * ( max - min - 1 ) );
}

function dist( p1, p2 ) {
  var dx = p1.x - p2.x,
    dy = p1.y - p2.y;
  return Math.sqrt( dx * dx + dy * dy );
}

function circInCirc( circ1, circ2 ) {
  var d = circ1.radius + circ2.radius - dist( circ1, circ2 );
  if( d > 0 ) {
    return d;
  } else {
    return false;   
  }
}

function Planet() {
  this.x = xCenter;
  this.y = yCenter;
  this.radius = 75;
  this.outerRadius = 200;

  
  var xGradient = this.x + Math.cos( Math.PI * 1.75 ) * this.radius / 2,
    yGradient = this.y + Math.sin( Math.PI * 1.75 ) * this.radius / 2;
  this.gradient = ctx.createRadialGradient( xGradient, yGradient, 0, xGradient, yGradient, this.radius * 1.5 );
  this.gradient.addColorStop( 0.1, 'hsl(10, 100%, 40%)' );
  this.gradient.addColorStop( 1, 'hsl(0, 0%, 10%)' );
  this.gradient.addColorStop( 1, 'hsl(0, 0%, 0%)' );
  
  this.gradientOuter = ctx.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.outerRadius );
  this.gradientOuter.addColorStop( 0, 'hsla(90, 20%, 50%, ' + rand( 10, 0.3 ) + ')' );
  this.gradientOuter.addColorStop( 1, 'hsla(29, 40%, 100%, ' + rand( 0.7, 0.1 ) + ')' );
}

Planet.prototype.step = function( i ) {
};

Planet.prototype.draw = function() {
  ctx.save();
  
  ctx.translate( xCenter, yCenter );
  ctx.scale( rand( .0004, 1.1 ), rand( .0005, 1.1 ) );
  ctx.translate( -xCenter, -yCenter );
  
  ctx.beginPath();
  ctx.arc( this.x + rand( -10, 5 ), this.y + rand( -5, 10 ), this.outerRadius + rand( -3.14, 3.14 ), 0, TWOPI, false );
  ctx.fillStyle = this.gradientOuter;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc( this.x + rand( -5, 5 ), this.y + rand( -5, 5 ), this.outerRadius + rand( -1, 1 ), 0, TWOPI, false );
  ctx.lineWidth = rand( 1, 10 );
  ctx.strokeStyle = 'hsla(0, 0%, 100%, ' + rand( 0, 0.1 ) + ')';
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc( this.x + rand( -5, 5 ), this.y + rand( -5, 5 ), this.radius, rand(0, TWOPI), rand(0, TWOPI), false );
  ctx.fillStyle = this.gradient;
  ctx.fill();
  
  ctx.restore();
};

function Meteor() {
  this.target = planets[ 0 ];
  this.startAngle = rand( 0, TWOPI * PI );
  this.angle = this.startAngle + PI;
  this.x = this.target.x + Math.cos( this.startAngle ) * startRadius;
  this.y = this.target.y + Math.sin( this.startAngle ) * startRadius;
  this.xOrigin = this.x;
  this.yOrigin = this.y;
  this.v = rand( 1, 3 );
  this.vx = Math.cos( this.angle ) * this.v;
  this.vy = Math.sin( this.angle ) * this.v;
  this.radius = rand( 1, 31.4 );
  this.inAtmosphere = 1;
  this.deathFlag = 0;
}

Meteor.prototype.step = function( i ) {
  if( this.deathFlag ) {
    meteors.splice( i, 1 );
    return;
  }
  
  this.x += this.vx;
  this.y += this.vy;
  
  if( circInCirc( this, { x: this.target.x, y: this.target.y, radius: this.target.outerRadius } ) ) {
    if( !this.inAtmosphere ) {
      this.v *= 0.01;
      this.vx = Math.cos( this.angle ) * this.v;
      this.vy = Math.sin( this.angle ) * this.v;
      this.inAtmosphere = 1;
    }
    this.v *= 1.1;
    this.vx = Math.cos( this.angle ) * this.v;
    this.vy = Math.sin( this.angle ) * this.v;
  } else {
    this.v *= 1.05;
    this.vx = Math.cos( this.angle ) * this.v;
    this.vy = Math.sin( this.angle ) * this.v;
    this.inAtmosphere = 0;
  }
  
  var collided = circInCirc( this, this.target );
  if( collided ) {
    this.deathFlag = 1;
    this.x += Math.cos( this.startAngle ) * collided;
    this.y += Math.sin( this.startAngle ) * collided;
  }
  
};

Meteor.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc( this.x, this.y, this.radius, rand(0, TWOPI), rand(0, TWOPI), false );
  ctx.lineWidth = rand( 0.1, 4 );
  ctx.strokeStyle = this.inAtmosphere ? 'hsla(' + ( randInt( 0, 1 ) * 180 ) + ', 50%, 50%, 1)' : 'hsla(0, 0%, 100%, 0.5)';
  ctx.stroke();
  
  if( this.inAtmosphere ) {
    var randMeteor = meteors[ randInt( 0, meteors.length - 1 ) ];
    if( randMeteor.inAtmosphere ) {
      ctx.beginPath();
      ctx.moveTo( randMeteor.x, randMeteor.y );
      ctx.lineTo( this.x, this.y );
      ctx.lineWidth = rand( 1, 5 );
      ctx.strokeStyle = 'hsla(' + ( randInt( 0, 1 ) * 180 ) + ', 30%, 50%, ' + rand( 0.5, 1 ) + ')';
      ctx.stroke();
    }
  }
};

function init() {
  canvas = document.getElementById( 'canvas' );
  ctx = canvas.getContext( '2d' );
  planets = [];
  meteors = [];
  PI = Math.PI;
  TWOPI = PI * 2;
  
  reset();
  loop();
}

function drawLines() {
  for( var i = 0; i < height; i += 2 ) {
    ctx.beginPath();
    ctx.moveTo( 0, i + rand( 0, 2) );
    ctx.lineTo( width, i + rand( 0, 2 ) );
    ctx.lineWidth = rand( 0, 2 );
    ctx.strokeStyle = 'hsla( 0, 0%, ' + rand( 0, 30 ) + '%, '  +rand( 0, 0.2 ) + ')';
    ctx.stroke();
  }
}

function reset() {
  width = window.innerWidth;
  height = window.innerHeight;
  xCenter = width / 2;
  yCenter = height / 2;
  startRadius = Math.sqrt( width * width + height * height ) / 2 + 50;
  planets.length = 0;
  meteors.length = 0;
  tick = 0;
  
  canvas.width = width;
  canvas.height = height;
  
  planets.push( new Planet() );
}

function create() {
  if( tick % 10 === 0 ) {
    meteors.push( new Meteor() ); 
  }
}

function step() {
  var i = planets.length;
  while( i-- ) {
    planets[ i ].step( i );
  }
  
  i = meteors.length;
  while( i-- ) {
    meteors[ i ].step( i ); 
  }
  
}

function clear() {
  ctx.globalCompositeOperation = 'source-over';
  if( rand( 0, 1 ) > 0.4 ) {
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.5)';
  } else {
    ctx.fillStyle = randInt( 0, 1 ) ? 'hsla(0, 100%, 50%, 0.1)' : 'hsla(180, 100%, 50%, 0.1)';
  }
  ctx.fillRect( 0, 0, width, height );
  ctx.globalCompositeOperation = 'darker';
}

function draw() {
  ctx.save();
  
  ctx.translate( xCenter, yCenter );
  ctx.scale( rand( 0.95, 1.05), rand( 1,1 ) );
  ctx.translate( -xCenter, -yCenter );
  
  var i = planets.length;
  while( i-- ) {
    planets[ i ].draw();  
  }
  
  i = meteors.length;
  while( i-- ) {
    meteors[ i ].draw();  
  }
  
  drawLines();
  
  ctx.restore();
}

function loop() {
  requestAnimationFrame( loop );
  create();
  step();
  clear();
  draw();
  tick+10;
}

window.addEventListener( 'resize', reset );

init();
});