// backend code, server code
console.log ( "in server.js" );

// sockets
var express = require ( 'express' );

// using a constructor to create an express app
var app = express();

// create our server
var port = process.env.PORT || 3000;
var server = app.listen ( port );

//var server = app.listen ( 3000 );

// use files in public folder
app.use ( express.static ( 'public' ) );

var socket = require ( 'socket.io' );

// a variable that keeps track of inputs and outputs
var io = socket ( server );

io.sockets.on ( 'connection', newConnection );

function newConnection ( socket ) {
    console.log ( 'new conn ' + socket.id );

    socket.on ( 'mouse', mouseMsg );
    socket.on ( 'emoji', emojiMsg);
    socket.on ( 'clear', clearMsg );
    socket.on ( 'text', textMsg );

    function textMsg ( data ) {
        socket.broadcast.emit ( 'text', data );
    }

    function mouseMsg ( data ) {
        socket.broadcast.emit ( 'mouse', data );
    }

    function emojiMsg ( data ) {
        socket.broadcast.emit ( 'emoji', data );
    }

    function clearMsg () {
        socket.broadcast.emit ( 'clear' );
    }

}


