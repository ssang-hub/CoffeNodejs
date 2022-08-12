import connection from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();
class siteController {
    loggedInPage(req, res) {
        let user = req.user.id;
        res.redirect(`/page/1`);
    }
    index(req, res) {
        res.redirect('/page/1');
    }
    async home(req, res) {
        const product = connection.promise().query('SELECT * FROM Product');
        const posts = connection.promise().query('SELECT * FROM Posts');

        res.locals.currentUser = req.user;
        const responseProduct = await product;
        const responsePost = await posts;
        res.render('main/home/home', { data: responseProduct[0], postdata: responsePost[0], page: parseInt(req.params.page) });
    }

    async prducts(req, res) {
        const product = connection.promise().query(`select * from Product where id = ${parseInt(req.params.productId)}`);
        const responsePost = await product;
        res.locals.currentUser = req.user;
        res.render('main/home/productdetail', { product: responsePost[0][0], name: 'cofe' });
    }

    // search(req, res){
    //     let
    // }
    async menu(req, res) {
        const menu_params = req.params.menu;
        let name = '';
        if (menu_params == 'cofe') {
            name = 'Ca phe';
        } else if (menu_params == 'food') {
            name = 'Do an nhanh';
        } else if (menu_params == 'tea') {
            name = 'Tra';
        }
        res.locals.currentUser = req.user;
        const menuProduct = connection.promise().query(`select * from Product inner join ProductType on Product.ptype = ProductType.idtype
        where ProductType.nametype = '${name}'`);
        const responseMenu = await menuProduct;
        res.render('main/menu/menudetail', { data: responseMenu[0], name: menu_params });
    }

    async search(req, res) {
        const name = req.query.name;
        res.locals.currentUser = req.user;
        try {
            const query = connection.promise().query(`select * from Product where name like '%${name}%'`);
            const responseMenu = await query;
            res.render('main/menu/menudetail', { data: responseMenu[0], name: req.params.menu });
        } catch (error) {
            console.log('ERROR');
        }
    }
}

export default new siteController();
