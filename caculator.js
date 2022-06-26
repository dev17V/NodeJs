//goal: make a caculator in javascript <_<

///////////////////////////////

const prompt = require("prompt-sync");
const readline = require("readline");

///////////////////////////////


var sum; // addition answer

var difference; // subtraction answer

var quotient; // division answer

var product; // multiplication answer

main();

function addStuff() {

	var z;

	var num1 = 5; // wanna turn this into a user input
    var num2 = 5; // wanna turn this into a user input

    var z = num1 + num2;

    console.log("Your Sum Is: " + z);
}

function subtractStuff() {
	var z;

	var num1 = 5; // wanna turn this into a user input
    var num2 = 5; // wanna turn this into a user input

    var z = num1 - num2;

    console.log("Your Difference Is: " + z);
}

function devideStuff() {

	var z;

	var num1 = 5; // wanna turn this into a user input
    var num2 = 5; // wanna turn this into a user input

    var z = num1 / num2;

    console.log("Your Quotient Is: " + z);

}

function mutiplyStuff() {

	var z;

	var num1 = 5; // wanna turn this into a user input
    var num2 = 5; // wanna turn this into a user input

    var z = num1 * num2;

    console.log("Your Product Is: " + z);

}

function main() {

	console.clear();

	console.log("                      Caculator Made In Js By Furher Acker                       \n");

	console.log("           ║ 1 | add\n           ║ 2 | subtract\n           ║ 3 | devide\n           ║ 4 | multiply\n");

	const caculate_option = "4"; //just put a number between 1-4 in the "" to choose your problem type

	if (caculate_option == "1") {
		addStuff();
	} else if (caculate_option == "2") {
	       subtractStuff();
	} else if (caculate_option == "3") {
		devideStuff();
	} else if (caculate_option == "4") {
		mutiplyStuff();
	} else if (caculate_option == null || caculate_option == "" || caculate_option == "a", "b", "c", "d") {
		console.log("\n[x] { " +caculate_option + " } is not a valid number");
	} else {
		console.log("GoodBye <_<");
	}
}
