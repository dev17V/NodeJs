const express       = require('express');
const bodyParser    = require('body-parser');
const db            = require('./modules/Db');
const AttackManager = require('./modules/AttackManager');

const app   = express();
const PORT  = process.argv[2] || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send(`<html>
    <head>
        <title>API</title>
    </head>
    <body>
        <h1>API</h1>
        <p>API is running</p>
    </body>
    </html>`);
});

// app.get('/auth', (req, res) => {
//     const query = req.query;
//     const ip    = req.ip;

//     const username = query.username;
//     const password = query.password;
//     const hwid     = query.hwid;

//     if (!query || Object.keys(query).length === 0) {
//         return res.status(400).send('{"error": "No data provided"}');
//     }

//     if (!username || !password || !hwid) {
//         return res.status(400).send('{"error": "Username and password and hwid are required"}');
//     }

//     const isAuthenticated = db.AuthUser(username, password, hwid, ip);

//     console.log(ip);
//     if (!isAuthenticated) {
//         return res.status(401).send('{"error": "Invalid username, password, hwid, or IP address"}');
//     } else if (isAuthenticated === true) {
//         console.log("YAYYY YOU DID IT!");
//     }

//     let user = db.GetUser(username);
//     let authToken = AttackManager.getAuthToken(username);

//     AttackManager.UpdateAuthToken(username, null, null, user.time);

//     if (authToken === undefined || authToken === null) {
//         AttackManager.addAuthToken(AttackManager.GenerateRandomString(15), username, password, hwid, ip, user.cons, user.time);
//         authToken = AttackManager.getAuthToken(username);
//     }

//     res.status(200).send(`{"success": \"${authToken.auth_token}\"}`);
// });

app.get('/auth', (req, res) => {
    const query = req.query;
    const ip = req.ip;

    const username = query.username;
    const password = query.password;
    const hwid = query.hwid;

    if (!username || !password || !hwid) {
        return res.status(400).json({ error: 'Username, password, and hwid are required' });
    }

    const isAuthenticated = db.AuthUser(username, password, hwid, ip);

    if (!isAuthenticated) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful authentication
    const user = db.GetUser(username);
    const authToken = AttackManager.getAuthToken(username);

    AttackManager.UpdateAuthToken(username, null, null, user.time);

    if (!authToken) {
        const newToken = AttackManager.GenerateRandomString(15);
        AttackManager.addAuthToken(newToken, username, password, hwid, ip, user.cons, user.time);
        return res.status(200).json({ success: newToken });
    }

    return res.status(200).json({ success: authToken.auth_token });
});

app.get('/api/fear', (req, res) => {
    const query  = req.query;
    const key    = query.key;
    const target = query.target;
    const port   = query.port;
    const time   = query.time;
    const method = query.method;

    if (!query || Object.keys(query).length === 0) {
        return res.status(400).send('{"error": "No data provided"}');
    }

    if (!key || !target || !port || !time || !method) {
        return res.status(400).send('{"error": "Key, Target, port, tine, method are required"}');
    }

    const authToken = AttackManager.getAuthToken(null, key);

    if (authToken === undefined || authToken === null) {
        return res.status(401).send('{"error": "Invalid key"}');
    }

    const result = AttackManager.Attack(key, target, port, time, method);

    res.status(200).send(`{"success": \"${result}\"}`);
});

app.get('/api/getuser', (req, res) => {
    const query = req.query;
    const key = query.key;

    if (!query || Object.keys(query).length === 0) {
        return res.status(400).json({ error: 'No data provided' });
    }

    if (!key) {
        return res.status(400).json({ error: 'Key is required' });
    }

    const authToken = AttackManager.getAuthToken(null, key);

    if (!authToken) {
        return res.status(401).json({ error: 'Invalid key' });
    }

    const user = db.GetUser(authToken.username);
    // Use user.password instead of passwordTemp
    res.status(200).json({ success: user.password });
});

app.get(`/api/adduser`, (req, res) => {
    const query = req.query;
    const ip    = req.ip;
    const username = query.username;
    const password = query.password;
    const hwid = query.hwid;
    const cons = query.cons;
    const time = query.time;
    const key = query.key;

    if (!query || Object.keys(query).length === 0) {
        return res.status(400).send('{"error": "No data provided"}');
    }

    if (!username || !password || !hwid || !cons || !time || !key) {
        return res.status(400).send('{"error": "Username, password, hwid, cons, time, and key are required"}');
    }

    if (!AttackManager.IsAdmin(key)) {
        return res.status(401).send('{"error": "Unauthorized key"}');
    }
    
    const result = db.AddUser(username, password, hwid, ip, cons, time);

    if (!result) {
        return res.status(400).send('{"error": "User already exists"}');
    }

    res.status(200).send('{"success": "User added"}');
});

app.get(`/api/removeuser`, (req, res) => {
    const query = req.query;
    const username = query.username;
    const key = query.key;

    if (!query || Object.keys(query).length === 0) {
        return res.status(400).send('{"error": "No data provided"}');
    }

    if (!username || !key) {
        return res.status(400).send('{"error": "Username and key are required"}');
    }

    if (!AttackManager.IsAdmin(key)) {
        return res.status(401).send('{"error": "Unauthorized key"}');
    }

    const result = db.RemoveUser(username);

    if (!result) {
        return res.status(400).send('{"error": "User does not exist"}');
    }

    res.status(200).send('{"success": "User removed"}');
});

app.use((req, res, next) => { res.status(404).redirect('/'); });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
