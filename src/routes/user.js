import express from 'express';
import userController from '../controllers/userController.js';
import exception from '../controllers/exception.js';
import auth from '../controllers/auth.js';
import multer from 'multer';

const upload = multer({ dest: 'src/public/images/' });
const route = express.Router();

route.get('/user', auth.isAuth, userController.index);
route.put('/updateInformation', auth.isAuth, upload.single('image'), userController.updateInformation);
route.get('/information', auth.isAuth, userController.information);
route.post('/addproduct', auth.isAuth, userController.addProduct);
route.get('/cart', auth.isAuth, userController.cart);
route.post('/createOrder', auth.isAuth, userController.createOrder);
route.post('/deleteOrder', auth.isAuth, userController.deleteOrder);
route.get('/order', auth.isAuth, userController.Orderdetail);
route.put('/confirmDelivered', auth.isAuth, userController.confirmDelivered);
route.get('/shoppingHistory', auth.isAuth, userController.OrderDelivered);
route.delete('/deleteProductInCart', auth.isAuth, userController.deleteProductInCart);

// route.postost('/update-image-user',auth.isAdmin, upload.single('image'), userController.createProduct)

export default route;
