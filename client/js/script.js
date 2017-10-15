"use strict";

// Global Variable
// Output Message from python shell
var outputArr = {
	output: [
		{
			normal: "Welcom to the python shell",
			error: null
		}
	]
}
// Initialize the socket
var socket = io.connect('http://192.168.143.60:413');;
// The default command in shell
var defaultSet = function(value) {
	switch (value) {
		case "clear": 
			outputArr.output = [];
			return true;
		default:
			return false;
	}
}