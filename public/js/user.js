
var user;
var socket = io.connect('http://localhost:8080');
$('#btnConnexion').click(function() {
	socket.emit('request', {command : 'identify', data: {login: $('#login').val()}
	});
	user = $('#login').val();
})