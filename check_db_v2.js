const mongoose = require('mongoose');

const uri = "mongodb+srv://mohmadshiple_db_user:W8JeyvIxscVhabIe@menu1.bljvxzp.mongodb.net/";

async function check() {
  try {
    const conn = await mongoose.connect(uri);
    console.log("Connected to:", conn.connection.name);
    
    const admin = conn.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));

    // Check 'test' db (default)
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collections in", conn.connection.name, ":", collections.map(c => c.name));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
