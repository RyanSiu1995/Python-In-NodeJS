"use strict";

// Define the socket interaction
$(document).ready((e) => {
	socket.emit('python/execute', {name: 'hello.py'})
	socket.on('python/msg', (data) => {
		// Handle the bug from stdout
		let msg = data.msg.replace(/\n|<br>/g, '').replace(/\(newLine\)/g, '<br>')
		// Carry out the url test for file sending
		let url = /(http:\/\/localhost:413\/).*/;
	    if (url.test(msg)) {
	    	// File Output
	    	/*
	    		Wait for implementation
	    	*/
	    } else { 
			outputArr.output.push({
				normal: msg,
				error: ""
			})
		}
	})
})