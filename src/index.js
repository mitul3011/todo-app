const express = require('express');
require('./db/mongoose');
// const User = require('./models/user');
// const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const auth = require('./middleware/auth');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.use(userRouter);
app.use('/task', taskRouter);

app.get('/*', (req, res) => {
    res.render('404');
});

app.listen(port, () => {
    console.log('Server is up on port', port);
});