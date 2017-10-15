"use strict";

$(document).ready((e) => {
	/*
		Input Control
		Listen to the enter event and show the last command into
	*/
	var inputInstance = new Vue({
		el: '#shell-input',
		methods: {
			command: (event) => {
				let input = event.target.value;
				// Display Control
				outputArr.output.push({
					normal: input,
					error: null
				})
				event.target.value = "";
				// Function Control
				if (!defaultSet(input)) {
					socket.send("python/arg", input);
				}
			}
		}
	})

	/*
		Output Control in the pseudo-shell
		Output Array is used to store the log
		Whenever a new message is pushed into output array
		It need to scroll to the bottom of the
		pseudo-shell
	*/
	var outputMsgBox = new Vue({
		el: '#shell-output',
		data: outputArr
	})

	outputMsgBox.$watch('output', function(newMsg, oldMsg) {
		// Scroll down to the bottom of the shell
		$('#shell-output').scrollTop($('#shell-output')[0].scrollHeight)
	})
})