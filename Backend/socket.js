import http from 'http';
import { Server as SocketIoServer } from 'socket.io';

function setupSocketIO(app) {
    const server = http.createServer(app);
    const io = new SocketIoServer(server,{
        cors: {
      origin: 'https://placement-cell-iczn.onrender.com/', // Frontend URL
      methods: ['GET', 'POST'],
    },
    }); // Use 'new' keyword to instantiate the server

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return { server, io };
}

export default setupSocketIO;
