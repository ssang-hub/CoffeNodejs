import { Strategy } from 'passport-facebook';
import passport from 'passport';
import connection from '../../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const err = null;
const facebookAuth = new Strategy(
    {
        clientID: process.env.clientIDFacebook,
        clientSecret: process.env.clientSecretFacebook,
        callbackURL: process.env.callbackURLFacebook,
        profileFields: ['id', 'displayName', 'picture.type(large)', 'email'],
    },

    async function (req, accessToken, refreshToken, profile, done) {
        const profileJson = profile._json;
        const checkUser = connection.promise().query(`SELECT * FROM User where authFacebook = '${profileJson.id}' ;`);
        const check = await checkUser;
        console.log(profile);
        if (!check[0][0]) {
            const addUser = connection
                .promise()
                .query(
                    `insert into User(name, fullName, authFacebook, image, email, isAdmin) values('${profileJson.id}', '${profileJson.name}', '${profileJson.id}', '${profileJson.picture.data.url}', '${profileJson.email}', 0)`,
                );
            await addUser;
        }
        return done(err, profile);
    },
);

passport.use(facebookAuth);

passport.serializeUser((user, done) => {
    console.log('inside serialize');
    done(null, user);
});

passport.deserializeUser((userId, done) => {
    connection.query('SELECT * FROM User where authFacebook = ?', [userId], (error, results) => {
        done(null, results[0]);
    });
});

export default passport;
