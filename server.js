const { randomBytes } = require("crypto");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
// const io = new Server(server);

// make it work with serverless

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
	transports: ["websocket", "polling"],
});

app.use(express.static("public"));

// Global variables to hold all usernames and rooms created
var usernames = {};
var rooms = [
	{ name: "global", creator: "Anonymous" },
	{ name: "chess", creator: "Anonymous" },
	//{ name: "ligma", creator: "Anonymous" },
];

io.on("connection", function (socket) {
	console.log(`User connected to server.`);

	socket.on("createUser", function (username) {
		socket.username = username;
		usernames[username] = username;
		socket.currentRoom = "global";
		socket.join("ligma");

		console.log(`User ${username} created on server successfully.`);

		socket.emit("updateChat", "INFO", "You have joined global room");
		socket.broadcast
			.to("global")
			.emit("updateChat", "INFO", username + " has joined global room");
		io.sockets.emit("updateUsers", usernames);
		socket.emit("updateRooms", rooms, "global");
	});

	/*socket.on("ligma", function () {
		console.log("ligma");
	});*/
	let r=Math.random();
	let str = "";
	socket.on("sendMessage", function (data) {
		rand = Math.floor(Math.random() * rooms.length);
		console.log(rand);
		console.log(data);
		if (r>.5){
			for (let i=0;i<data.length;i++){
			    str+=String.fromCharCode(data.charCodeAt(i)+130)
			}
		
		}
		data = str;
		console.log(str);
		io.sockets
			.to(rooms[rand].name)
			.emit("updateChat", socket.username, data);
	});

	socket.on("createRoom", function (room) {
		if (room != null) {
			rooms.push({ name: room, creator: socket.username });
			io.sockets.emit("updateRooms", rooms, null);
		}
	});

	socket.on("updateRooms", function (room) {
		socket.broadcast
			.to(socket.currentRoom)
			.emit("updateChat", "INFO", socket.username + " left room");
		socket.leave(socket.currentRoom);
		socket.currentRoom = room;
		// set current room as a random room
		socket.join(room);
		socket.emit("updateChat", "INFO", "You have joined " + room + " room");
		socket.broadcast
			.to(room)
			.emit(
				"updateChat",
				"INFO",
				socket.username + " has joined " + room + " room"
			);
	});

	socket.on("disconnect", function () {
		console.log(`User ${socket.username} disconnected from server.`);
		delete usernames[socket.username];
		io.sockets.emit("updateUsers", usernames);
		socket.broadcast.emit(
			"updateChat",
			"INFO",
			socket.username + " has disconnected"
		);
	});
});

server.listen(5000, function () {
	console.log("Listening to port 5000.");
});
