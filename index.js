var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

var uint8arrayToString = function(data){
	return String.fromCharCode.apply(null, data);
};

io.sockets.on('connection', function(socket) {
	// Send any error to client
	socket.on('error', function (data) {
		console.log(data || 'error');
	});

	// Kill the process
	socket.on('python/kill', function(data) {
		shell.kill('SIGINT');
	})

	// Execute the python programs
	socket.on('python/execute', function(data, callback) {
		if (!pythonPending) {
			shell = spawn('python', ['-u', 'python/' + data.name]);
			
			callback({msg: 'success', state: true});
			
			pending = true;

			shell.stdout.on('data', (msg) => {
				msg = uint8arrayToString(msg);	
				socket.emit('python/msg', {msg: msg});
			})

			shell.stderr.on('data', (msg) => {
				msg = uint8arrayToString(msg);
				socket.emit('python/msg', {msg: msg})
			})

			shell.on('exit', (code) => {
				socket.emit('python/msg', {msg: 'Program ended with code ' + code + '<br>', ended: true})
				pythonPending = false;
			})

			socket.on('python/arg', function(data) {
				shell.stdin.write(data + '\n');
			})

			pythonPending = true;
		} else {
			callback({msg: 'There is a program running in server. If you want to kill it, please tell the maintainer<br>', state: false})
		}
	})
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(__dirname + '/client'))

// Start the server
server.listen(413, function() {
	console.log('Server in port 413 is ready');
});