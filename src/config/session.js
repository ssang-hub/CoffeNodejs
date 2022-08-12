import session from "express-session";
import MySQLStore from "express-mysql-session";
import dotenv from 'dotenv'

dotenv.config()

const sess = session({
    key:  process.env.key_session,
    secret:  process.env.secret_session,
    store: new MySQLStore({
        host: process.env.host_database,
        port: process.env.port_database, 
        user: process.env.user_database,
        password: process.env.password_database,
        database: process.env.database_database
    }),

    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000*60*60*24
    }
    
})

export default sess
