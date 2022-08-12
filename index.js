import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import route from './src/routes/index.js';
import createError from 'http-errors';
import passport from './src/controllers/passportAuth.js';
import googleAuth from './src/controllers/socialAuth/google.js';
import facebookAuth from './src/controllers/socialAuth/facebook.js';
import sess from './src/config/session.js';
import methodOverride from 'method-override';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(sess);
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(passport.initialize());
app.use(passport.session());

app.use(facebookAuth.initialize());
app.use(facebookAuth.session());

app.use(googleAuth.initialize());
app.use(googleAuth.session());

// app.use(morgan('dev'))
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    }),
);
app.use(express.static(path.join(path.resolve(), 'src/public')));
app.use(methodOverride('_method'));

app.use(route);
// export default app
app.listen(process.env.PORT);
