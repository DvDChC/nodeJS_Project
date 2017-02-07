var express = require('express');
var sockets = require('socket.io');
var server = express();
var users = [];
var params = [];


server.get('/', function(req, res) {
	res.render('index.ejs');
})
.get('/question', function(req, res){
	res.render('pageQuestion.ejs');
})
.get('/user', function(req, res){
	res.render('user.ejs');
})
.get('/admin', function(req, res) {
	params['users'] = users;
	res.render("admin.ejs", params);
})

.use(express.static(__dirname+'/public'))

var io = sockets.listen(server.listen(8080));


io.sockets.on('connection',function(socket) {
	// console.log("a user logged in");
	// socket.emit('info', 'Vous êtes connecté');

	socket.on('request', function(message) {
		//console.log(socket);
		if(message.command == 'identify') {
			var login = message.data.login;
			var user = {};
			console.log('L\'utilisateur veut s\'identifier avec ' + message.data.login);
			user.id = socket.id;
			user.login = login;
			users.push(user);
		}
		if(message.command == 'text') {
			socket.broadcast.emit('text', message.data.text);
		}	
		console.log(users);
	})
	socket.on('reponse', function(message) {
		if(message.command == 'rep') {
			console.log(message.data.rep);
		}
	});
	socket.on('disconnect', function() {
		console.log(socket.id);
	})

	socket.on('kick' function(userId) {
		//TODO 
		// get the user from socket and array and remove them
	})
});