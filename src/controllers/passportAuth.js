import passport from "passport";
import connection from '../config/db.js'
import auth from "./auth.js";
import {Strategy} from 'passport-local'


const customFields = {
  usernameField: 'uname',
  passwordField: 'pw'
}


// authen.js
const verifyCallback = (name, pass, done) =>{
  connection.query('SELECT * FROM User WHERE name = ?', [name], (error, results, fields) =>{
      if (error)
          return done(error)
      if (results.length == 0){
          return done(null, false)
      }
      const isValid = auth.validPassword(pass, results[0].hash);
      const user = {id: results[0].id, name: results[0].name, hash: results[0].hash}
      if (isValid){
          return done(null, user)

      }
      else{
          return done(null, false)
      }
  })
}

const strategy = new Strategy(customFields, verifyCallback)
passport.use(strategy)

passport.serializeUser((user, done)=>{
  console.log('inside serialize');
  done(null, user.id)
})

passport.deserializeUser((userId, done)=>{
  connection.query('SELECT * FROM User where id = ?', [userId], (error, results)=>{
      done(null, results[0])
  })
})

export default passport
