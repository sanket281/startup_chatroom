//Node server which will handle socket io connections

// const io = require('socket.io')(4000)
const express = require("express")
var app = express();
var server = app.listen(4000);
var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});







const users = {};

io.on('connection',socket=>{
    // If any new user joins, let other users connected to the server know 
    socket.on('new-user-joined',name=>{
        // console.log("New user",name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send',message =>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]});
    });

    // if someone leaves the chat, let othes know
    socket.on('disconnect',message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})