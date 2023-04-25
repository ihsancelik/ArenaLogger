const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const auth = require('./auth');
const config = require('./config.json');

const { generateToken } = require('./token-generator')

app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(express.json({ charset: 'utf-8' }));

const { expressjwt } = require('express-jwt');
app.use(
    expressjwt({ secret: config.jwt['secret-key'], algorithms: ["HS256"] }).unless({ path: ["/token"] })
);

const { Log, User } = require('./db');

User.findOne({ username: 'admin', password: 'admin' })
    .then((user) => {
        if (user == null) {
            User.create({ username: 'admin', password: 'admin' });
        }
    });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.post('/token', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // User validation
    const user = await User.findOne({ username: username, password: password });
    if (user == null) {
        res.status(401).send('Kullanıcı adı veya şifre hatalı.');
        return;
    }

    // Parameters validation
    const identity = req.body.identity;
    const application = req.body.application;
    const version = req.body.version;
    const tag = req.body.tag;
    if (identity == null || application == null || version == null || tag == null) {
        res.status(400).send('Kimlik bilgileri eksik.');
        return;
    }

    const token = await generateToken(identity, application, version, tag);
    res.send(token);
});

app.post('/log', async (req, res) => {
    const identity = req.user.identity;
    const application = req.user.application;
    const version = req.user.version;
    const tag = req.user.tag;

    await Log.create({
        identity: identity,
        application: application,
        version: version,
        tag: tag,
        message: req.body.log.message,
        level: req.body.log.level,
    });

    res.send('Log kaydedildi.'); // Yanıt olarak basit bir mesaj gönder
});

app.post('/log-list', async (req, res) => {
    const identity = req.body.identity;
    const application = req.body.application;
    const version = req.body.version;
    const tag = req.body.tag;
    const minDate = req.body.minDate;
    const maxDate = req.body.maxDate;

    let query = {};
    if (identity) query.identity = identity;
    if (application) query.application = application;
    if (version) query.version = version;
    if (tag) query.tag = tag;
    if (minDate && maxDate) query.created_at = { $gte: minDate, $lte: maxDate };

    const logList = await Log.find(query);
    res.send(logList);
});

io.use(auth);
io.on('connection', (socket) => {

    const identity = socket.decoded.identity;
    const application = socket.decoded.application;
    const version = socket.decoded.version;
    const tag = socket.decoded.tag;

    socket.on('log', async (data) => {
        try {
            console.log(data.log);
            await Log.create({
                identity: identity,
                application: application,
                version: version,
                tag: tag,
                message: data.log.message,
                level: data.log.level,
            });
        } catch (error) {
            console.error(error);
        }
    })

});