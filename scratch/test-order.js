async function testOrder() {
  const payload = {
    customer: {
      name: "Test User",
      phone: "1234567890",
      type: "takeaway"
    },
    items: [
      { itemId: "item1", title: "Test Product", price: "10", quantity: 2 }
    ],
    totalAmount: 20
  };

  try {
    const res = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testOrder();
