import http from 'http';
import { Server } from 'socket.io';
import { app, sessionMiddleWare } from "./app.js";
import chatSocket from "./Socket/chatSocket.js"
import { log } from 'console';

const server = http.createServer(app);

const io = new Server(server,
    {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
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
    console.log("User connected:", user.username);

    socket.on("joinMatch", () => {
        console.log("Match request from:", user.username);
    });
    
    console.log("Socket connected:", user.username);
    chatSocket(io, socket);
});

const port = 3000;
server.listen(port, () =>
    console.log(`Server running at port ${port}`)
);


