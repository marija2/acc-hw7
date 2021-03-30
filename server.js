
var express = require ( 'express' );

var app = express();

var port = process.env.PORT || 3000;
var server = app.listen ( port );

app.use ( express.static ( 'public' ) );            // use files in public folder

var socket = require ( 'socket.io' );

var io = socket ( server );                         // a variable that keeps track of inputs and outputs

io.sockets.on ( 'connection', newConnection );

function newConnection ( socket ) {

    socket.on ( 'mouse', function ( data ) { socket.broadcast.emit ( 'mouse', data ); } );

    socket.on ( 'emoji', function ( data ) { socket.broadcast.emit ( 'emoji', data ); } );

    socket.on ( 'clear', function () { socket.broadcast.emit ( 'clear' ); } );

    socket.on ( 'text', function ( data ) { socket.broadcast.emit ( 'text', data ); } );
}


