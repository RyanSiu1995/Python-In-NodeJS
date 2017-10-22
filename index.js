var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

var pythonPending = false;

var uint8arrayToString = function(data){
	return String.fromCharCode.apply(null, data);
};

io.sockets.on('connection', function(socket) {
	console.log("connected");
	// Send any error to client
	socket.on('error', function (data) {
		console.log(data || 'error');
	});

	// Kill the process
	socket.on('python/kill', function(data) {
		shell.kill('SIGINT');
	})

	socket.on('python/arg', function(data) {
		console.log(data);
		shell.stdin.write(data + '\n');
	})

	// Execute the python programs
	socket.on('python/execute', function(data, callback) {
		if (!pythonPending) {
			shell = spawn('python', ['-u', 'python/' + data.name]);
			
			// callback({msg: 'success', state: true});
			
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

			pythonPending = true;
		} else {
			// callback({msg: 'There is a program running in server. If you want to kill it, please tell the maintainer<br>', state: false})
		}
	})
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(__dirname + '/client'))

// Start the server
server.listen(8080, function() {
	console.log('Server in port 413 is ready');
});