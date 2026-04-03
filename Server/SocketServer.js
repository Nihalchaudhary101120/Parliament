import http from 'http';
import { Server } from 'socket.io';
import { app, sessionMiddleWare } from "./app.js";
import chatSocket from "./Socket/chatSocket.js"
import gameSocket from "./Socket/gameSocket.js"

const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:5173',
    'https://parliamentbattle.aalsicoders.in',
    'https://parliamentbattle.vercel.app'
];

const io = new Server(server,
    {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    console.warn(`Socket CORS blocked for origin: ${origin}`);
                    callback(new Error(`CORS blocked for origin: ${origin}`));
                }
            },
            credentials: true,
            methods: ["GET", "POST"]
        },
        transports: ['websocket', 'polling']
    }
)
io.use((socket, next) => {
    sessionMiddleWare(socket.request, {}, next);
});

io.on("connection", (socket) => {
    console.log("Socket session:", socket.request.session);
    const user = socket.request.session.user;
    console.log("User: ", user);

    if (!user || !user.username) {
        console.log("Unauthenticated socket");
        socket.disconnect();
        return;
    }

    socket.userId = user.id;
    socket.username = user.username;

    console.log("User connected:", user.username);

    // socket.on("joinMatch", () => {
    //     console.log("Match request from:", user.username);
    // });

    // console.log("Socket connected:", user.username);
    chatSocket(io, socket);
    gameSocket(io, socket);
});

const port = 3000;
server.listen(port, () =>
    console.log(`Server running at port ${port}`)
);


