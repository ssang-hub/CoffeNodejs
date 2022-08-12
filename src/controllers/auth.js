import connection from '../config/db.js';
// import pbkdf2 from 'crypto-js/pbkdf2'
// import CryptoJS from "crypto-js"
import dotenv from 'dotenv';
import aes from 'crypto-js/aes.js';

dotenv.config();
class auth {
    encryptPassword(password) {
        console.log(password);
        return aes.encrypt(password, process.env.KEY_CRYPT).toString();
    }
    decryptPassword(password) {
        console.log(password);

        return aes.decrypt(password, process.env.KEY_CRYPT).toString();
    }
    renderLogin(req, res, next) {
        res.render('auth/login');
    }
    logOut(req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/login');
        });
    }
    logInSuccess(req, res, next) {
        res.redirect('/admin');
    }
    logInFail(req, res, next) {
        res.send('You entered the wrong password');
    }
    renderRegister(req, res, next) {
        console.log('Inside get');
        res.render('auth/register');
    }
    // typeProduct(){
    //     connection.query(`Select * from ProductType`, (error, results, fields)=>{
    //         if(error){
    //             console.log('ERROR');
    //             return false
    //         }
    //         console.log(results);
    //         return results
    //     })
    // }
    register(req, res, next) {
        console.log('Inside post');
        const data = req.body;
        // console.log(data.pw);

        const hash = aes.encrypt(data.pw, process.env.KEY_CRYPT).toString();

        console.log(hash);
        connection.query(
            `insert into User(name, fullName, hash, email, address, numberPhone, isAdmin) values('${data.uname}', '${data.fullname}', '${hash}', '${data.email}', '${data.address}', '${data.phone}',  0)`,
            (error, results, fields) => {
                if (error) {
                    console.log('ERROR');
                } else {
                    console.log('Successfully');
                }
            },
        );
        res.redirect('/login');
    }
    admin_route(req, res, next) {
        connection.query(`Select * from ProductType`, (error, results, fields) => {
            const data = results;
            if (error) {
                console.log('ERROR');
            }
            res.render('admin/site/manager', { data: data, link: '' });
        });
    }

    User(req, res) {
        connection.query(`SELECT * FROM Product`, (error, results, fields) => {
            if (error) {
                console.log('ERROR');
            } else {
                const data = results;
                res.json(results);
            }
        });
    }
    userAlreadyExists(req, res, next) {
        console.log('Inside get');
        res.send(`<h1>Sorry this username is taken</h1><p><a href="/register">Register with different username</a></p>`);
    }

    validPassword(password, hash) {
        const passVerify = aes.decrypt(hash, process.env.KEY_CRYPT).toString();
        const result = aes.decrypt(aes.encrypt(password, process.env.KEY_CRYPT).toString(), process.env.KEY_CRYPT).toString();
        return result === passVerify;
    }

    checkAuth(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
    }

    isAuth(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    isAdmin(req, res, next) {
        if (req.isAuthenticated() && req.user.isAdmin == 1) {
            next();
        } else {
            console.log(req.user);
            res.redirect('/user');
        }
    }

    userExists(req, res, next) {
        console.log(req.body);
        connection.query('SELECT * FROM users where username = ?', [req.body.uname], (error, results, fields) => {
            if (error) {
                console.log('ERROR');
            } else if (results.length > 0) {
                res.redirect('/userAlreadyExists');
            } else {
                next();
            }
        });
    }
}

export default new auth();
