import pkg, { Connection } from 'pg';
import dotenv from 'dotenv';

const pss = dotenv.configDotenv({ path: '', encoding: 'latin1', quiet: false, debug: true, override: false })

let db = {
PGUSER: process.env.PGUSER,
PGHOST: process.env.PGHOST,
PGDATABASE:process.env.PGDATABASE,
PGPASSWORD: process.env.PGPASSWORD,
PGPORT: process.env.PGPORT

}


const { Pool } = pkg;

// Connection pool
 const DBconnection = new Pool({
  user: db.PGUSER, 
  host: db.PGHOST,
  database: db.PGDATABASE,
  password: db.PGPASSWORD,
  port: db.PGPORT,
  ssl: {  // for deployment
    require: true,
    rejectUnauthorized: false // Use this only for development if you have certificate issues
  }
});

export const check_connection = async  ()  =>{
  try {
 DBconnection.connect()
   .then(()=>{
console.log('Database connected')
return 'Database Connected'
   })
  } catch (error) {
    console.log(error)
  }
  
}   
 
await check_connection()
export default DBconnection
