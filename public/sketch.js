
var socket;

var emoji;
var slider;

var drawBtn;
var drawing = true;

var deleteBtn;

var circle;

function preload() {
  emoji = loadImage('images/emoji.png');
}

function mouseClicked() {

  if ( drawing ) return;

  image ( emoji, mouseX, mouseY, 50, 50 );

  var data = {
    x: mouseX,
    y: mouseY
  };

  socket.emit ( 'emoji', data );
}

function setup() {

  var canvas = createCanvas ( windowWidth - 200, windowHeight );

  canvas.position (0,0);

  background ( 200, 200, 200 );

  socket = io.connect('https://acc-hw7.herokuapp.com/');

  // handle broadcast calls
  socket.on ( 'mouse', newDrawing );
  socket.on ( 'emoji', newEmoji );
  socket.on ( 'clear', function() {
    background ( 200, 200, 200 );
  } );

  //colorMode ( HSB );

  slider = createSlider ( 0, 200, 20 );
  slider.position ( windowWidth - 170, 50 );

  drawBtn = createButton ( 'Stamp' );
  drawBtn.id('drawBtn');
  drawBtn.position ( windowWidth - 170, 100 );
  drawBtn.mousePressed ( flipDrawing );

  deleteBtn = createButton ( "clear" );
  deleteBtn.position ( windowWidth - 170, 150 );
  deleteBtn.mousePressed ( clearWindow );

}

function clearWindow() {

  background ( 200, 200, 200 );

  socket.emit ( 'clear' );
}

function flipDrawing() {

  if ( drawing ) document.getElementById('drawBtn').innerHTML = "Draw";
  else document.getElementById('drawBtn').innerHTML = "Stamp";

  drawing = !drawing;
  
}

/*function keyPressed () {
  console.log ( 'pressed' );
  if ( keyCode == DELETE ) {

    console.log ('delete pressed');

    background ( 200, 200, 200 );

    socket.emit ( 'clear' );
  }
}*/

function newEmoji ( data ) {
  image ( emoji, data.x, data.y, 50, 50 );
}

function newDrawing ( data ) {
    fill ( 50, 100, 100 );
    ellipse ( data.x, data.y, data.size, data.size );
}

function draw() {}

// will activate whenever you click and dragg
function mouseDragged() {

  if ( !drawing ) return;

  fill ( 50, 100, 100 );
  noStroke();
  ellipse ( mouseX, mouseY, slider.value(), slider.value() );

  // data is what socket will send to other clinets
  // object literal notation
  var data = {
    x: mouseX,
    y: mouseY,
    size: slider.value()
  };

  // mouse is a channel name
  socket.emit('mouse', data);

}
