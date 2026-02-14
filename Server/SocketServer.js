import http from 'http';
import { Server } from 'socket.io';
import { app, sessionMiddleWare } from "./app.js";
import chatSocket from "./Socket/chatSocket.js"

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
    const user = socket.request.session.user;
    

    if (!user) {
        console.log("Unauthenticated socket");
        socket.disconnect();
        return;
    }
    console.log("User connected:", user);


    socket.on("joinMatch", () => {
        console.log("Match request from:", user);
    });

    console.log("Socket connected:", user.name);
    chatSocket(io, socket);
});

const port = 3000;
server.listen(port, () =>
    console.log(`Server running at port ${port}`)
);


