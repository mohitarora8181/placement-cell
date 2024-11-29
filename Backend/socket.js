import http from 'http';
import { Server as SocketIoServer } from 'socket.io';

function setupSocketIO(app) {
    const server = http.createServer(app);
    const io = new SocketIoServer(server,{
        cors: {
      origin: ['https://pcmsit.vercel.app','http://localhost:3000'], // Frontend URL
      methods: ['GET', 'POST'],
    },
    }); // Use 'new' keyword to instantiate the server

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected:');
        });
    });

    return { server, io };
}

export default setupSocketIO;
