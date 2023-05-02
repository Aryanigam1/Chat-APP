// Node Server which will handle Socket io Connections
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });

const users = {};

//io.on is an instance of socketio which listens different Socket connection
//socket.on what should happen with this particular connection that is handled by it.
io.on('connection', socket=>{
    socket.on('new-user-joined', name=>{
        //If any user joins. let other users connected to the server know!!
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //If someone sends a message, broadcats it to other people 
    socket.on('send', message =>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]});
    });

    //If someone leaves the chat let others know
    socket.on('disconnect',message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});