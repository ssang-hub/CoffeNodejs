import { Strategy } from 'passport-google-oauth20';
import passport from 'passport';
import connection from '../../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const err = null;
const googleAuth = new Strategy(
    {
        clientID: process.env.clientIDGoogle,
        clientSecret: process.env.clientSecretGoogle,
        callbackURL: process.env.callbackURLGoogle,
        passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
        const profileJson = profile._json;
        const checkUser = connection.promise().query(`SELECT * FROM User where authGoogle = '${profileJson.sub}' ;`);
        const check = await checkUser;

        if (!check[0][0]) {
            const addUser = connection
                .promise()
                .query(
                    `insert into User(name, fullName, authGoogle, image, email, isAdmin) values('${profileJson.email}', '${profileJson.name}', '${profileJson.sub}', '${profileJson.picture}', '${profileJson.email}', 0)`,
                );
            await addUser;
        }

        return done(err, profile);
    },
);

passport.use(googleAuth);

passport.serializeUser((user, done) => {
    console.log('inside serialize');
    done(null, user);
});

passport.deserializeUser((userId, done) => {
    connection.query('SELECT * FROM User where authGoogle = ?', [userId], (error, results) => {
        done(null, results[0]);
    });
});

export default passport;
