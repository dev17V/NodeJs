const prompt = require("prompt-sync")();

function addStuff() {
    var num1 = parseFloat(prompt("Enter the first number: "));
    var num2 = parseFloat(prompt("Enter the second number: "));
    var z = num1 + num2;
    console.log("Your Sum Is: " + z);
}

function subtractStuff() {
    var num1 = parseFloat(prompt("Enter the first number: "));
    var num2 = parseFloat(prompt("Enter the second number: "));
    var z = num1 - num2;
    console.log("Your Difference Is: " + z);
}

function devideStuff() {
    var num1 = parseFloat(prompt("Enter the first number: "));
    var num2 = parseFloat(prompt("Enter the second number: "));
    if (num2 === 0) {
        console.log("Cannot divide by zero.");
    } else {
        var z = num1 / num2;
        console.log("Your Quotient Is: " + z);
    }
}

function multiplyStuff() {
    var num1 = parseFloat(prompt("Enter the first number: "));
    var num2 = parseFloat(prompt("Enter the second number: "));
    var z = num1 * num2;
    console.log("Your Product Is: " + z);
}

function findDivisor() {
    var num = parseFloat(prompt("Enter the number to find divisors: "));
    console.log("Divisors of " + num + " are: ");
    for (let i = 1; i <= num; i++) {
        if (num % i === 0) {
            console.log(i);
        }
    }
}

function main() {
    console.clear();

    console.log("                      Calculator Made In Js By Furher Acker                       \n");

    console.log("           ║ 1 | add\n           ║ 2 | subtract\n           ║ 3 | divide\n           ║ 4 | multiply\n           ║ 5 | find divisor\n");

    const calculate_option = prompt("Enter your choice (1-5): ");

    if (calculate_option === "1") {
        addStuff();
    } else if (calculate_option === "2") {
        subtractStuff();
    } else if (calculate_option === "3") {
        devideStuff();
    } else if (calculate_option === "4") {
        multiplyStuff();
    } else if (calculate_option === "5") {
        findDivisor();
    } else {
        console.log("\n[x] { " + calculate_option + " } is not a valid number");
    }
}

main();
