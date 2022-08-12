import siteController from '../controllers/siteController.js';
import auth from '../controllers/auth.js';
import express from 'express';
const router = express.Router();

// router.get('/', auth.isAuth, siteController.loggedInPage)
router.get('/page/:page', siteController.home);
router.get('/product/:productId', siteController.prducts);
router.get('/menu/:menu', siteController.menu);
router.get('/:menu/search', siteController.search);
router.get('/:index', siteController.index);
router.get('/', siteController.index);

export default router;
