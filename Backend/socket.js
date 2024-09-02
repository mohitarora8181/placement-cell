// import http from 'http';
// import { Server as SocketIoServer } from 'socket.io';

// function setupSocketIO(app) {
//     const server = http.createServer(app);
//     const io = new SocketIoServer(server, {
//         cors: {
//             origin: 'https://placement-cell-iczn.onrender.com', // Frontend URL
//             methods: ['GET', 'POST'],
//         },
//     });

//     io.on('connection', (socket) => {
//         console.log('A user connected:', socket.id);

//         // Handle events from the client here
//         socket.on('disconnect', () => {
//             console.log('User disconnected:', socket.id);
//         });
//     });

//     return { server, io };
// }

// export default setupSocketIO;
