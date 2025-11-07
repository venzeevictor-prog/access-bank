import DBconnection from './Dbconnection.js';
import bcrypt from'bcrypt'
const user_profile = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_profile (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(255),
      lastname VARCHAR(255),
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255),
      pin VARCHAR(255),
     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      profile_photo BYTEA,
      kyc_level VARCHAR(100) )`;

    try {
    await DBconnection.query(query);
    console.log('✅ Table created successfully');
  } catch (err) {
    console.error('❌ Error creating table', err);
  } finally {
    DBconnection.end();
  }

}
  const admin = async () =>{

    const query = `
       CREATE TABLE IF NOT EXISTS wallet(
          id SERIAL PRIMARY KEY,
          owner VARCHAR(100),
          account_number VARCHAR(255),
          account_name VARCHAR(100),
          account_balance VARCHAR(100),
          transaction_count INT
       )`;

      try {
    await DBconnection.query(query);
    console.log('✅ Table created successfully');
  } catch (err) {
    console.error('❌ Error creating table', err);
  } finally {
    DBconnection.end();
  }

  }

   
  const transactions = async ()=>{

    const query = `
        CREATE TABLE IF NOT EXISTS transactions (
           transactionID VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
           seassionID VARCHAR(255) UNIQUE NOT NULL,
           transaction_details JSONB,
           date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, 
           initiated_by VARCHAR(100),
           current_balance VARCHAR(100),
           status VARCHAR(50)
        )`
      try {
   
    await DBconnection.query(query);
    console.log('✅ Table created successfully');
  } catch (err) {
    console.error('❌ Error creating table', err);
  } finally {
    DBconnection.end();
  }

  }

  const kyc_level = async ()=>{

    const query = `
        account VARCHAR(100),

    
    `
  }
  const login_verification =  async () =>{
        const query= `
      CREATE TABLE IF NOT EXISTS admin (
        username VARCHAR(100) UNIQUE,
        password VARCHAR(100)
    
      )`
        try {
   
    await DBconnection.query(query);
    console.log('✅ Table created successfully');
  } catch (err) {
    console.error('❌ Error creating table', err);
  } finally {
    DBconnection.end();
  }
      
  } 
  const temp_user = async () =>{
     const query = `
      CREATE TABLE IF NOT EXISTS userx (
         email VARCHAR(255)   NOT NULL,
         complaint VARCHAR(2555),
         pin VARCHAR(255),
         password VARCHAR(255) ,
         verification_code VARCHAR(255),
         date VARCHAR(255)
         )`;
        try {
   
    await DBconnection.query(query);
    console.log('✅ Table created successfully');
  } catch (err) {
    console.error('❌ Error creating table', err);
  } finally {
    DBconnection.end();
  }
  
  }

  
  async function addColumnToTable(tableName, columnName, dataType, constraints = '') {
    const query = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${dataType} ${constraints};`;
  
    try {
      await DBconnection.query(query);
      console.log(`Column '${columnName}' added to table '${tableName}' successfully.`);
    } catch (err) {
      console.error('Error adding column:', err);
    } finally {
      // Optional: End the pool if this is a one-time operation,
      // otherwise, keep it open for future queries.
      // await pool.end(); 
    }
  }
  
  // Example usage:
  async function getTableColumns(tableName) {
    const client = DBconnection
    try {
      const queryText = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `;
      const res = await client.query(queryText, [tableName]);
      console.log(`Columns for table '${tableName}':`);
      console.table(res.rows); // console.table provides a clean, readable output in the terminal
    } catch (err) {
      console.error('Error viewing table columns', err);
    } finally {
      client.end();
    }
  }
  


const getTablesNative = async () => {
  const getTablesQuery = `
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `;

  try {
    console.log('Fetching list of tables using pg_tables...');
    const result = await DBconnection.query(getTablesQuery);
    
    console.log('Tables found:', result.rows.map(row => row.tablename));

  } catch (err) {
    console.error('Error fetching tables', err);
  }
};

async function removeUniqueConstraint( constraintName) {
  const client =  DBconnection;
  try {
      const query = `ALTER TABLE temp_user DROP CONSTRAINT  IF EXISTS ${constraintName};`;
      await client.query(query);
      console.log(`Unique constraint '${constraintName}' removed from table 'temp_user}'.`);
  } catch (err) {
      console.error('Error removing unique constraint:', err);
  } finally {
      client.end();
  }
}

// Example usage:
//removeUniqueConstraint('phone_number'); 
// Replace with your table and constraint names
//user_profile()
//user_account_detail()
//transactions()
//login_verification()
//addColumnToTable('victims', 'date', 'VARCHAR(255)', '');
getTableColumns('userx');
//temp_user('userx')
// getTableColumns('admin');

// const pss = await bcrypt.hash('F7b4ebeekgy2&&', 10)
// const add_user = await DBconnection.query(
//   `INSERT INTO admin ( username, password)
//    VALUES ($1, $2) RETURNING  *`,[
//   'venzee', pss]
// ).then(val =>{
//   console.log(val.rows[0])
// })
//getTablesNative();
