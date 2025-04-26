const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
require("dotenv").config();


app.use(cors());

app.options('*', cors());

const io = socketio(server, {
    cors: ({})
});

io.on("connection", (socket) => {

    socket.on("joinRoom", ({ room, userId }) => {
        socket.join(room);
        socket.emit("joinedRoom", userId);

        // Handle location sharing
        socket.on("send-location", (Data) => {
            if (Data) {
                console.log(Data)
                // Broadcasting location to the room
                io.to(Data.RoomId).emit("receive-location", {
                    userPosition: Data.userPosition,
                    mistriPosition: Data.mistriPosition,
                });
            }
        });
        socket.on("disconnect", () => {
            if (room) {
                socket.leave(room);
            }
        });

    });
});

// MongoDB configuration and other routes
const DB = require("./config/mongodb.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load routes
const userHomeRoute = require("./routes/user.home.route.js");
const mistriHomeRoute = require("./routes/mistri.home.route.js");
const userAuthRoute = require("./routes/user.auth.route.js");
const mistriAuthRoute = require("./routes/mistri.auth.route.js");
const mistriProfileRoute = require("./routes/mistri.profile.route.js");
const userProfileRoute = require("./routes/user.profile.route.js");
const userFavouriteRoute = require("./routes/user.favourite.route.js");
const userBookingRoute = require("./routes/user.booking.route.js");
const userFetchBookingMistriRoute = require("./routes/user.mistri.booking.fetch.route.js");
const MistriOrderRoute = require("./routes/mistri.order.route.js");
const userSearchRoute = require("./routes/user.search.route")
app.get("/keep-alive",(req,res)=>{
    res.send("Keep alive")
})
app.use("/user", userHomeRoute);
app.use("/mistri", mistriHomeRoute);
app.use("/user/booking", userBookingRoute);
app.use("/user/profile", userProfileRoute);
app.use("/auth/user", userAuthRoute);
app.use("/user/favourite", userFavouriteRoute);
app.use("/user/book/fetch/mistri", userFetchBookingMistriRoute);
app.use("/mistri/profile", mistriProfileRoute);
app.use("/api/mistri", mistriAuthRoute);
app.use("/mistri/orders", MistriOrderRoute);
app.use("/", userSearchRoute);
// Start the server
server.listen(PORT, () => {

});

const autocannon = require('autocannon');

// async function runTest() {
//   const result = await autocannon({
//     url: 'http://localhost:3000', // Change this to your server URL
//     connections: 100,  // Number of concurrent users
//     duration: 10,      // Duration in seconds
//   });

//   console.log(result);
// }

// runTest();

