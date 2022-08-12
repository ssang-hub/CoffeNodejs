import connection from '../config/db.js';

class adminManager {
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
    async renderCreateProduct(req, res, next) {
        const productType = connection.promise().query(`SELECT * FROM ProductType`);
        const responseProduct = await productType;

        let link = 'createProduct';
        res.render('admin/site/manager', { data: responseProduct[0], link: link });
    }

    async createProduct(req, res, next) {
        let data = req.body;
        let image = '/' + req.file.path.split('/').slice(2).join('/');

        const product = connection.promise().query(`insert into Product (name, image, price, description, ptype)
        values('${data.name}', '${image}', ${data.price}, '${data.description}', ${data.type})`);
        const responseproduct = await product;
        res.redirect('/admin');
    }

    async createNews(req, res, next) {
        let data = req.body;
        let image = '/' + req.file.path.split('/').slice(2).join('/');
        connection.query(
            `insert into News (name, image, price, description, ptype)
        values('${data.name}', '${image}', '${data.price}', '${data.description}', '${data.type}')`,
            (error, results, fields) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Successfully');
                }
            },
        );
        res.redirect('/admin');
    }
    rendercreatePosts(req, res) {
        let link = 'createPosts';
        res.render('admin/site/manager', { link: link });
    }
    async createPosts(req, res, next) {
        let data = req.body;
        let image = '/' + req.file.path.split('/').slice(2).join('/');
        const posts = connection.promise().query(`insert into Posts (title, image, slogan, detail)
        values('${data.title}', '${image}', '${data.slogan}', '${data.detail}')`);
        await posts;
        res.redirect('/admin');
    }

    editProduct(req, res, next) {
        connection.query(`SELECT * FROM Product`, (error, results, fields) => {
            if (error) {
                console.log(error);
            } else {
                const data = results;
                let link = 'editProduct';
                console.log(data);
                res.render('admin/site/manager', { data: data, link: link });
            }
        });
    }

    // deleteOrder = async (req, res) => {
    //     const data = req.body;
    //     if (data.status == 'Chờ xác nhận') {
    //         try {
    //             res.json(data);
    //             const deleteProductAction = `delete from Order_Product where Orders = ${data.id};`;
    //             let query = connection.promise().query(deleteProductAction);
    //             await query;
    //             const deleteOrderAction = `delete from Orders where id = ${data.id}`;
    //             query = connection.promise().query(deleteOrderAction);
    //             await query;
    //             res.redirect('/order');
    //         } catch (error) {
    //             console.log('ERROR');
    //         }
    //     }
    // };

    // Orderdetail = async (req, res) => {
    //     const query = connection.promise().query(`select  o.id, o.OrderDate, o.OrderStatus, p.name, p.image, op.Size, op.Quantity, op.Price, op.Note
    //   FROM (((Orders as o inner join Order_Product as op on o.id = op.Orders ) inner join Product as p on op.Product = p.id))
    //   where o.uname = 108;`);
    //     const x = await query;
    //     const data = this.ListOrderForCustomer(x[0]);

    //     let order = [];
    //     for (let i = 0; i < data.length; i++) {
    //         let orderStatus = {
    //             id: data[i][0].id,
    //             date: data[i][0].OrderDate.toString().slice(0, 15),
    //             status: data[i][0].OrderStatus,
    //         };
    //         order.push(orderStatus);
    //     }
    //     console.log(order);
    //     res.render('main/order/order', { data: data, orders: order });
    // };
}

export default new adminManager();
