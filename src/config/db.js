import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const connect = mysql.createConnection( {
    host: process.env.host_database,
    port: process.env.port_database, 
    user: process.env.user_database,
    password: process.env.password_database,
    database: process.env.database_database
}
)
connect.connect((err)=>{
    if(!err){
        console.log('Connected');

    }
    else{
        console.log('Connection Failed');
    }
})

export default connect
