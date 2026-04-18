const mongoose = require('mongoose');

const uri = "mongodb+srv://mohmadshiple_db_user:W8JeyvIxscVhabIe@menu1.bljvxzp.mongodb.net/";

async function check() {
  const dbs = ['test', 'menu1'];
  for (const dbName of dbs) {
    try {
      const conn = await mongoose.createConnection(`${uri}${dbName}?retryWrites=true&w=majority`).asPromise();
      console.log(`Checking DB: ${dbName}`);
      const collections = await conn.db.listCollections().toArray();
      for (const col of collections) {
         const count = await conn.collection(col.name).countDocuments();
         if (count > 0) console.log(`  - ${col.name}: ${count}`);
      }
      await conn.close();
    } catch (err) {
      console.log(`Error checking ${dbName}: ${err.message}`);
    }
  }
  process.exit(0);
}

check();
