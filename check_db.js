const mongoose = require('mongoose');

const uri = "mongodb+srv://mohmadshiple_db_user:W8JeyvIxscVhabIe@menu1.bljvxzp.mongodb.net/";

async function check() {
  try {
    await mongoose.connect(uri);
    console.log("Connected");
    
    const OrderSchema = new mongoose.Schema({
      id: String,
      status: String,
      customer: Object
    }, { strict: false });
    
    const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders');
    
    const orders = await Order.find();
    console.log("Found orders count:", orders.length);
    console.log("Latest orders:", JSON.stringify(orders.slice(-3), null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
