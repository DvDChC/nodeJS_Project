var express = require('express');
var sockets = require('socket.io');
var mysql = require('mysql');
var server = express();
var users_MIAW = [];
var users_SIMO = [];
var users_ASSR = [];

// routing for the index
server.get('/', function(req, res) {
	res.render('index.ejs');
})
//routing for the students
.get('/user', function(req, res){
	res.render('user.ejs');
})
//rooting for the teacher
.get('/admin', function(req, res) {
	res.render("admin.ejs");
})

.use(express.static(__dirname+'/public'))

var io = sockets.listen(server.listen(8080))

//mysql connection
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'megapoll',
	password: ''
});

io.sockets.on('connection',function(socket) {
	// Called when a user log in
	socket.on('request', function(message) {
		if(message.command == 'identify') {
			var login = message.data.login;
			var user = {};
			console.log('L\'utilisateur veut s\'identifier avec ' + message.data.login +' dans le salon '+message.data.salon);
			user.id = socket.id;
			user.login = login;
			user.salon = message.data.salon;
			users_MIAW.push(user);
			socket.broadcast.emit("users", users_MIAW);
			/*if(message.data.salon == "MIAW") {
				users_MIAW.push(user);
				socket.broadcast.emit("users", users_MIAW);
			} else if(message.data.salon == "ASSR") {
				users_ASSR.push(user);
				socket.broadcast.emit("users", users_ASSR);

			} else if(message.data.salon == "SIMO") {
				users_SIMO.push(user);
				socket.broadcast.emit("users", users_SIMO);
			}*/
		}
		console.log(users_MIAW);
		console.log(users_ASSR);
		console.log(users_SIMO);
	});
	// Called when a user logout
	socket.on('disconnect', function() {
		console.log(socket.id + " DECONNECTE");
		for (var i=0; i<users_MIAW.length; i++) {
			if (socket.id === users_MIAW[i].id) {
				users_MIAW.splice(i, 1);
				console.log(users_MIAW);
				socket.broadcast.emit("users", users_MIAW);
			}
		}
	});

	// NOT USED (sends the list of users from the selected room)
	socket.on("loadRoom", function(room) {
		console.log(room);
		if (room == "MIAW") {
			socket.broadcast.emit("users", users_MIAW);
		} else if(room == "ASSR") {
				socket.broadcast.emit("users", users_ASSR);
		} else if(room == "SIMO") {
				socket.broadcast.emit("users", users_SIMO);
		}
	});

	// Called when a user is kicked by a teacher
	socket.on('kick', function(userId) {
		console.log("userId on kick: "+userId);
		user = io.sockets.connected[userId];
		for (var i =0; i<users_MIAW.length; i++) {
			if (users_MIAW[i].id == userId) {
				users_MIAW.splice(i, 1);
				user.emit("kicked", users_MIAW);
				user.disconnect();
				console.log("user kicked");
			}/* else if (users_ASSR[i].id == userId) {
				users_ASSR.splice(i, 1);
				user.emit("kicked", users_ASSR);
				user.disconnect();
				console.log("user kicked");
			} else if(users_SIMO[i].id == userId) {
				users_SIMO.splice(i,1);
				user.emit("kicked", users_SIMO);
				user.disconnect();
				console.log("user kicked");
			}*/
		}
	});

	var data = [];
	// Called when the teacher start, everything is sent to the students
	socket.on("start", function() {
		connection.connect(function(err) {
			data = [];
			// Gets the questions
			connection.query("SELECT * FROM question", function(err, ques) {
				if (err) throw err;
				data.push(ques);
				// Gets the possible answers
				connection.query("SELECT * FROM reponse", function(err, ans) {
					if (err) throw err;
					data.push(ans);
					// Gets all the right answers to all questions
					connection.query("SELECT * FROM question_reponse", function(err, ques_ans) {
						if(err) throw err;
						data.push(ques_ans);
						// Sends everything above
						console.log(data);
						socket.broadcast.emit("starting", data);
					});
				});
			});

		});
	});

	// Loads the next question
	socket.on("next", function() {
		socket.broadcast.emit("next");
	});

	// Reload the same question
	socket.on("repeat", function() {
		socket.broadcast.emit("repeat");
	});

	// Called when a student answer a question
	socket.on("answer", function(data) {
		socket.broadcast.emit("hasAnswered", data);
	});
});