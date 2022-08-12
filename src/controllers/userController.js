import connection from '../config/db.js';
// import aes from 'crypto-js/aes.js';
import auth from './auth.js';

class userController {
    getDate() {
        // date format
        let d = new Date();
        let day = d.getDate() > 10 ? d.getDate() : '0' + d.getDate();
        let month = d.getMonth() > 10 ? d.getMonth() : '0' + (d.getMonth() + 1);
        let date = `${d.getFullYear()}-${month}-${day}`;
        return date;
    }
    ListOrderForCustomer(items) {
        let results = items.reduce((map, val) => {
            if (!map[val.id]) {
                map[val.id] = [];
            }
            map[val.id].push(val);
            return map;
        }, {});
        results = Object.values(results);
        return results;
    }

    async deleteProductSelected(deletePorduct) {
        let sql = 'Delete FROM cart where id in (';
        for (let val of deletePorduct) {
            sql += `${val}, `;
        }
        sql = sql.slice(0, sql.length - 2) + ')';
        const deleteFromCart = connection.promise().query(sql);
        await deleteFromCart;
    }

    async index(req, res) {
        const product = connection.promise().query('SELECT * FROM Product');
        const posts = connection.promise().query('SELECT * FROM Posts');

        res.locals.currentUser = req.user;
        const responseProduct = await product;
        const responsePost = await posts;
        res.render('main/home/home', {
            data: responseProduct[0],
            postdata: responsePost[0],
            page: parseInt('1'),
        });
    }
    async information(req, res) {
        let name = req.user.name;
        try {
            const infor = connection.promise().query(`SELECT * FROM User where name = '${name}'`);
            const result = await infor;
            const data = result[0][0];
            if (data.hash) {
                data.hash = auth.decryptPassword(data.hash);
            }
            res.render('main/information/information', { data: data });
        } catch (error) {
            console.log('ERROR');
        }
    }

    async updateInformation(req, res) {
        let id = req.user.id;
        let data = req.body;
        let image = req.user.image;
        if (req.file) {
            image = '/' + req.file.path.split('/').slice(2).join('/');
        }
        if (data.hash) {
            data.hash = auth.encryptPassword(data.hash);
        }

        try {
            const update = connection.promise().query(
                `UPDATE User SET image = '${image}', fullName= '${data.fullName}', hash = '${data.hash}'
              , email = '${data.email}',  address = '${data.address}',  numberPhone = '${data.phoneNumber}' WHERE id = ${id}`,
            );
            await update;
            res.redirect(`/information`);
        } catch (error) {
            console.log('UPDATE ERROR');
        }
    }
    async addProduct(req, res) {
        const data = req.body;
        const addProduct = connection.promise().query(`insert into cart (username, productname, size, number, note)
        values('${req.user.id}', '${data.productid}', '${data.size}', '${data.quantity}', '${data.note}')`);
        const responseMenu = await addProduct;

        res.redirect('/cart');
    }
    async cart(req, res) {
        const cart = connection.promise().query(`
        SELECT cart.id, Product.name,Product.id as idp, cart.size, cart.number, cart.note, Product.image, Product.price
        FROM ((cart
        INNER JOIN User ON cart.username = User.id)
        INNER JOIN Product ON cart.productname = Product.id)
        where User.id = ${req.user.id}`);
        const responseCart = await cart;
        res.render('main/cart/cart', { data: responseCart[0], user: req.user });
    }
    async deleteProductInCart(req, res) {
        const deleteProduct = connection.promise().query(`delete from cart where cart.id = ${req.body.productId}`);
        res.redirect('/cart');
    }

    createOrder = async (req, res) => {
        if (req.body.address && req.body.phone) {
            let date = this.getDate();
            const data = req.body['productdata[]'];

            //query
            const createOrders = connection
                .promise()
                .query(`insert into Orders(OrderDate, OrderStatus, Uname, confirmDelivered) values('${date}', 'Chờ xác nhận', ${req.user.id}, 0)`);
            const maxid = connection.promise().query(`SELECT MAX(id) FROM Orders`);

            await createOrders;
            const max = await maxid;

            //array product delete after create order

            let deletePorduct = [];
            // order one product or multi product

            if (typeof data == 'string') {
                const dataDetail = data.split('-');
                let price = parseInt(dataDetail[2]) * parseInt(dataDetail[5]);
                console.log(price);
                const addProductToOrder = connection
                    .promise()
                    .query(
                        `insert into Order_Product(Orders, Product, Size, Quantity, Price, Note)` +
                            `values(${max[0][0]['MAX(id)']}, ${dataDetail[0]}, '${dataDetail[1]}', ${dataDetail[2]}, ${price},'${dataDetail[3]}')`,
                    );
                await addProductToOrder;
                deletePorduct.push(dataDetail[4]);
            } else {
                let sql = `insert into Order_Product(Orders, Product, Size, Quantity, Price, Note) values`;
                for (let arrayData of data) {
                    let dataDetail = arrayData.split('-');
                    let price = parseInt(dataDetail[2]) * parseInt(dataDetail[5]);
                    sql += `(${max[0][0]['MAX(id)']}, ${dataDetail[0]}, '${dataDetail[1]}', ${dataDetail[2]}, ${price},'${dataDetail[3]}'),`;
                    deletePorduct.push(dataDetail[4]);
                }
                sql = sql.slice(0, sql.length - 1);
                const addProductToOrder = connection.promise().query(sql);
                await addProductToOrder;
            }

            this.deleteProductSelected(deletePorduct);
            res.redirect('/order');
        } else {
            res.redirect('/cart');
        }
    };

    // [POST] /deleteOrder: delete order preset
    deleteOrder = async (req, res) => {
        const data = req.body;
        if (data.status == 'Chờ xác nhận') {
            try {
                res.json(data);
                const deleteProductAction = `delete from Order_Product where Orders = ${data.id};`;
                let query = connection.promise().query(deleteProductAction);
                await query;
                const deleteOrderAction = `delete from Orders where id = ${data.id}`;
                query = connection.promise().query(deleteOrderAction);
                await query;
                res.redirect('/order');
            } catch (error) {
                console.log('ERROR');
            }
        }
    };

    Orderdetail = async (req, res) => {
        try {
            const query = connection.promise().query(`select  o.id, o.OrderDate, o.OrderStatus, p.name, p.image, op.Size, op.Quantity, op.Price, op.Note
        FROM (((Orders as o inner join Order_Product as op on o.id = op.Orders ) inner join Product as p on op.Product = p.id))
        where o.uname = ${req.user.id} and o.confirmDelivered = 0;`);
            const x = await query;
            const data = this.ListOrderForCustomer(x[0]);

            let order = [];
            for (let i = 0; i < data.length; i++) {
                let orderStatus = {
                    id: data[i][0].id,
                    date: data[i][0].OrderDate.toString().slice(0, 15),
                    status: data[i][0].OrderStatus,
                };
                order.push(orderStatus);
            }
            console.log(order);
            res.render('main/order/order', { data: data, orders: order });
        } catch (error) {}
    };

    confirmDelivered = async (req, res) => {
        const data = req.body;

        try {
            const query = connection.promise().query(`UPDATE Orders set confirmDelivered = 1 where id = ${data.id}`);
            await query;
            res.redirect('/order');
        } catch (error) {
            console.log('ERROR');
        }
    };

    // [GET] /shoppingHistory
    OrderDelivered = async (req, res) => {
        const data = req.body;

        try {
            const query = connection.promise().query(`select  o.id, o.OrderDate, o.OrderStatus, p.name, p.image, op.Size, op.Quantity, op.Price, op.Note
          FROM (((Orders as o inner join Order_Product as op on o.id = op.Orders ) inner join Product as p on op.Product = p.id))
          where o.uname = ${req.user.id} and o.confirmDelivered = 1;`);
            const x = await query;
            const data = this.ListOrderForCustomer(x[0]);

            let order = [];
            for (let i = 0; i < data.length; i++) {
                let orderStatus = {
                    id: data[i][0].id,
                    date: data[i][0].OrderDate.toString().slice(0, 15),
                    status: data[i][0].OrderStatus,
                };
                order.push(orderStatus);
            }
            console.log(order);
            res.render('main/shoppingHistory/order', { data: data, order: order });

            // const query2 = connection.promise().query(`select from Orders where id = ${data.id}`);
        } catch (error) {
            console.log('ERROR');
        }
    };
}

export default new userController();
