import express from 'express';
import passport from '../controllers/passportAuth.js';
import googleAuth from '../controllers/socialAuth/google.js';
import facebookAuth from '../controllers/socialAuth/facebook.js';
import auth from '../controllers/auth.js';
import adminManager from '../controllers/adminManager.js';
import exception from '../controllers/exception.js';
import multer from 'multer';
const upload = multer({ dest: 'src/public/images/' });
const route = express.Router();

// local login

route.get('/login', auth.renderLogin);
route.get('/logout', auth.logOut);

route.get('/login-success', auth.logInSuccess);
route.get('/login-failure', auth.logInFail);
route.get('/register', auth.renderRegister);
route.post('/register', auth.register);

route.get('/admin', auth.isAdmin, auth.admin_route);

route.get('/userAlreadyExists', auth.userAlreadyExists);

route.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login-failure',
        successRedirect: '/login-success',
    }),
);

// google login
route.get('/login/google', googleAuth.authenticate('google', { scope: ['email', 'profile'] }));
route.get('/oauth2/redirect/google', googleAuth.authenticate('google', { failureRedirect: '/login', successRedirect: '/user' }));

// facebook login
route.get('/login/facebook', facebookAuth.authenticate('facebook', { scope: ['email'] }));
route.get('/oauth2/redirect/facebook', facebookAuth.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/user' }));

// admin route
// route.get('/admin/order', auth.isAdmin, adminManager.Order);
route.get('/admin/createProduct', auth.isAdmin, adminManager.renderCreateProduct);
route.post('/admin/createProduct', auth.isAdmin, upload.single('image'), adminManager.createProduct);
route.get('/admin/editProduct', auth.isAdmin, adminManager.editProduct);
route.get('/admin/createNews', auth.isAdmin, upload.single('image'), adminManager.createNews);
// route.get('/admin/editNews', auth.isAdmin, adminManager.editNews);

route.get('/admin/createposts', auth.isAdmin, adminManager.rendercreatePosts);
route.post('/admin/createposts', auth.isAdmin, upload.single('image'), adminManager.createPosts);

// route.get('/admin/editPosts', auth.isAdmin, adminManager.editPosts);
// route.get('/admin/statistical', auth.isAdmin, adminManager.statistical);

export default route;
