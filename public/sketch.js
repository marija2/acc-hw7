
var socket;

var emoji;
var slider;

var drawBtn;
var drawing = true;

var deleteBtn;

var circle;

var colorPicker;

var drawLabel;
var sizeLabel;
var clearLabel;
var colorLabel;
var textLabel;

var line1;
var line2;
var line3;

var textInput;
var emojiSelect;

var dictionary;

var flower;
var sun;
var heart;
var butterfly;
var unicord;
var candy;

function preload() {
  flower = loadImage('images/flower.png');
  sun = loadImage('images/sun.png');
  heart = loadImage('images/heart.png');
  candy = loadImage('images/candy.png');
  butterfly = loadImage('images/butterfly.png');
  unicorn = loadImage('images/unicorn.png');
}

function setup() {

  var canvas = createCanvas ( windowWidth - 200, windowHeight );

  canvas.position (0,0);

  background ( 254, 254, 254 );

  socket = io.connect('https://acc-hw7.herokuapp.com/');
  
  //socket = io.connect ( 'http://localhost:3000' );

  // handle broadcast calls
  socket.on ( 'mouse', newDrawing );

  socket.on ( 'emoji', newEmoji );

  socket.on ( 'clear', function() {
    background ( 254, 254, 254 );
  } );

  socket.on ( 'text', newText );

  drawLabel = createElement ( 'h5', 'Choose drawing or stamping:' );
  drawLabel.addClass ( 'labelClass' );
  drawLabel.position ( windowWidth - 180, 10 );

  drawBtn = createButton ( 'Stamp' );
  drawBtn.id('drawBtn');
  drawBtn.addClass ( 'btnClass' );
  drawBtn.position ( windowWidth - 180, 50 );
  drawBtn.mousePressed ( flipDrawing );

  sizeLabel = createElement ( 'h5', 'Choose a size:' );
  sizeLabel.addClass ( 'labelClass' );
  sizeLabel.position ( windowWidth - 180, 80 );

  slider = createSlider ( 0, 200, 20 );
  slider.addClass ( 'sliderClass' );
  slider.position ( windowWidth - 180, 120 );

  line1 = createElement('hr');
  line1.addClass ( 'lineClass' );
  line1.position ( windowWidth - 180, 140 );

  colorLabel = createElement ( 'h5', 'Choose a drawing color:' );
  colorLabel.addClass ( 'labelClass' );
  colorLabel.position ( windowWidth - 180, 150 );

  colorPicker = createColorPicker ( "blue" );
  colorPicker.position ( windowWidth - 180, 190 );

  line2 = createElement('hr');
  line2.addClass ( 'lineClass' );
  line2.position ( windowWidth - 180, 220 );

  textLabel = createElement ( 'h5', 'Add text to canvas:' );
  textLabel.addClass ( 'labelClass' );
  textLabel.position ( windowWidth - 180, 230 );

  textInput = createInput();
  textInput.position ( windowWidth - 180, 270 );

  textBtn = createButton ( 'Add text' );
  textBtn.addClass ( 'btnClass' );
  textBtn.position ( windowWidth - 180, 300 );
  textBtn.mousePressed ( addText );

  line3 = createElement('hr');
  line3.addClass ( 'lineClass' );
  line3.position ( windowWidth - 180, 330 );

  emojiLabel = createElement ( 'h5', 'Choose stamp:' );
  emojiLabel.addClass ( 'labelClass' );
  emojiLabel.position ( windowWidth - 180, 340 );

  emojiSelect = createSelect();
  emojiSelect.position ( windowWidth - 180, 380 );
  emojiSelect.option ( 'flower', 0 );
  emojiSelect.option ( 'heart', 1 );
  emojiSelect.option ( 'butterfly', 2 );
  emojiSelect.option ( 'sun', 3 );
  emojiSelect.option ( 'unicorn', 4 );
  emojiSelect.option ( 'candy', 5 );

  line4 = createElement('hr');
  line4.addClass ( 'lineClass' );
  line4.position ( windowWidth - 180, 400 );

  clearLabel = createElement ( 'h5', 'Delete everything:' );
  clearLabel.addClass ( 'labelClass' );
  clearLabel.position ( windowWidth - 180, 410 );

  deleteBtn = createButton ( "Clear" );
  deleteBtn.addClass ( 'btnClass' );
  deleteBtn.position ( windowWidth - 180, 450 );
  deleteBtn.mousePressed ( clearWindow );

  dictionary = {
    0: flower,
    1: heart,
    2: butterfly,
    3: sun,
    4: unicorn,
    5: candy
  };
}

function newText ( data ) {

  fill ( data.color );

  textSize ( data.size );

  text ( data.text, data.x, data.y );
}

function addText () {

  fill ( colorPicker.color().levels );

  textSize ( slider.value() );

  var xCoord = random ( windowWidth - 300 ) + 50;
  var yCoord = random ( windowHeight - 100 ) + 50;

  text ( textInput.value(), xCoord, yCoord );

  var data = {
    text: textInput.value(),
    x: xCoord,
    y: yCoord,
    size: slider.value(),
    color: colorPicker.color().levels
  };

  socket.emit ( 'text', data );

}

function clearWindow() {

  background ( 254, 254, 254 );

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
  image ( dictionary[data.val], data.x, data.y, data.size, data.size );
}

function newDrawing ( data ) {

    fill ( data.color );
    noStroke();
    ellipse ( data.x, data.y, data.size, data.size );
}

function mouseClicked() {

  if ( drawing ) return;
  if ( slider.value() == 0 ) return;

  image ( dictionary[emojiSelect.value()], mouseX, mouseY, slider.value(), slider.value() );

  var data = {
    x: mouseX,
    y: mouseY,
    size: slider.value(),
    val: emojiSelect.value()
  };

  socket.emit ( 'emoji', data );
}

// will activate whenever you click and dragg
function mouseDragged() {

  if ( !drawing ) return;
  if ( slider.value() == 0 ) return;

  fill ( colorPicker.color().levels );
  noStroke();
  ellipse ( mouseX, mouseY, slider.value(), slider.value() );

  // data is what socket will send to other clinets
  // object literal notation
  var data = {
    x: mouseX,
    y: mouseY,
    size: slider.value(),
    color: colorPicker.color().levels
  };

  // mouse is a channel name
  socket.emit('mouse', data);

}
