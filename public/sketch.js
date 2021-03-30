
var socket;

var sizeSlider;
var drawBtn;
var drawing = true;
var colorPicker;
var textInput;
var emojiSelect;

// images
var flower;
var sun;
var heart;
var butterfly;
var unicord;
var candy;

var dictionary;

function preload() {                                // get images for stamps
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

  // handle broadcast calls
  socket.on ( 'mouse', function ( data ) {

    fill ( data.color );
    noStroke();
    ellipse ( data.x, data.y, data.size, data.size );

  } );

  socket.on ( 'emoji', function ( data ) {

    imageMode ( CENTER );
    image ( dictionary [ data.val ], data.x, data.y, data.size, data.size );

  });

  socket.on ( 'text', function ( data ) {

    fill ( data.color );
    textSize ( data.size );
    text ( data.text, data.x, data.y );

  } );

  socket.on ( 'clear', function() { background ( 254, 254, 254 ); } );

  var left = windowWidth - 180;

  // create buttons, labels, lines, and other elements in the side bar
  var drawLabel = createElement ( 'h5', 'Choose drawing or stamping:' );
  drawLabel.addClass ( 'labelClass' );
  drawLabel.position ( left, 10 );

  drawBtn = createButton ( 'Stamp' );
  drawBtn.id ( 'drawBtn' );
  drawBtn.addClass ( 'btnClass' );
  drawBtn.position ( left, 50 );

  drawBtn.mousePressed ( function () {

    if ( drawing ) document.getElementById('drawBtn').innerHTML = "Draw";
    else document.getElementById('drawBtn').innerHTML = "Stamp";
  
    drawing = !drawing;
    
  } );

  var sizeLabel = createElement ( 'h5', 'Choose a size:' );
  sizeLabel.addClass ( 'labelClass' );
  sizeLabel.position ( left, 80 );

  sizeSlider = createSlider ( 0, 200, 20 );
  sizeSlider.addClass ( 'sliderClass' );
  sizeSlider.position ( left, 120 );

  var line1 = createElement('hr');
  line1.addClass ( 'lineClass' );
  line1.position ( left, 140 );

  var colorLabel = createElement ( 'h5', 'Choose a drawing color:' );
  colorLabel.addClass ( 'labelClass' );
  colorLabel.position ( left, 150 );

  colorPicker = createColorPicker ( "blue" );
  colorPicker.position ( left, 190 );

  var line2 = createElement('hr');
  line2.addClass ( 'lineClass' );
  line2.position ( left, 220 );

  var textLabel = createElement ( 'h5', 'Add text to canvas:' );
  textLabel.addClass ( 'labelClass' );
  textLabel.position ( left, 230 );

  textInput = createInput();
  textInput.position ( left, 270 );

  textBtn = createButton ( 'Add text' );
  textBtn.addClass ( 'btnClass' );
  textBtn.position ( left, 300 );
  textBtn.mousePressed ( addText );

  var line3 = createElement('hr');
  line3.addClass ( 'lineClass' );
  line3.position ( left, 330 );

  var emojiLabel = createElement ( 'h5', 'Choose stamp:' );
  emojiLabel.addClass ( 'labelClass' );
  emojiLabel.position ( left, 340 );

  emojiSelect = createSelect();
  emojiSelect.position ( left, 380 );
  emojiSelect.option ( 'flower', 0 );
  emojiSelect.option ( 'heart', 1 );
  emojiSelect.option ( 'butterfly', 2 );
  emojiSelect.option ( 'sun', 3 );
  emojiSelect.option ( 'unicorn', 4 );
  emojiSelect.option ( 'candy', 5 );

  var line4 = createElement('hr');
  line4.addClass ( 'lineClass' );
  line4.position ( left, 400 );

  var clearLabel = createElement ( 'h5', 'Delete everything:' );
  clearLabel.addClass ( 'labelClass' );
  clearLabel.position ( left, 410 );

  var deleteBtn = createButton ( "Clear" );
  deleteBtn.addClass ( 'btnClass' );
  deleteBtn.position ( left, 450 );

  deleteBtn.mousePressed ( function () {
    
      background ( 254, 254, 254 );
      socket.emit ( 'clear' );

    } );

  dictionary = {
    0: flower,
    1: heart,
    2: butterfly,
    3: sun,
    4: unicorn,
    5: candy
  };
}

function addText () {

  fill ( colorPicker.color().levels );

  textSize ( sizeSlider.value() );

  var xCoord = random ( windowWidth - 300 ) + 50;
  var yCoord = random ( windowHeight - 100 ) + 50;

  text ( textInput.value(), xCoord, yCoord );

  var data = {
    text: textInput.value(),
    x: xCoord,
    y: yCoord,
    size: sizeSlider.value(),
    color: colorPicker.color().levels
  };

  socket.emit ( 'text', data );
}

// will activate whenever mouse is clicked
function mouseClicked() {

  if ( drawing ) return;                    // if not in drawing "mode", don't do anything
  if ( sizeSlider.value() == 0 ) return;    // if size is 0, don't do anything

  imageMode ( CENTER );
  image ( dictionary[emojiSelect.value()], mouseX, mouseY, sizeSlider.value(), sizeSlider.value() );

  var data = {
    x: mouseX,
    y: mouseY,
    size: sizeSlider.value(),
    val: emojiSelect.value()
  };

  socket.emit ( 'emoji', data );
}

// will activate whenever mouse is clicked and dragged
function mouseDragged() {

  if ( !drawing ) return;                   // if not in drawing "mode", don't do anything
  if ( sizeSlider.value() == 0 ) return;    // if size is 0, don't do anything

  fill ( colorPicker.color().levels );
  noStroke();
  ellipse ( mouseX, mouseY, sizeSlider.value(), sizeSlider.value() );

  var data = {
    x: mouseX,
    y: mouseY,
    size: sizeSlider.value(),
    color: colorPicker.color().levels
  };

  socket.emit ( 'mouse', data );
}
