const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting End-to-End API and Flow Verification for Dabba...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${API_URL}/health`);
    const health = await healthRes.json();
    assert(health.status === 'online', 'Health endpoint responds online');

    // 2. Fetch Menu Items (Public)
    const menuRes = await fetch(`${API_URL}/menu-items`);
    const menuData = await menuRes.json();
    assert(menuData.success && menuData.items.length >= 15, `Public Menu Items retrieved (${menuData.count} items)`);
    const sampleItem = menuData.items[0];

    // 3. Fetch Single Menu Item Details (Public)
    const singleRes = await fetch(`${API_URL}/menu-items/${sampleItem._id || sampleItem.id}`);
    const singleData = await singleRes.json();
    assert(singleData.success && singleData.item.name === sampleItem.name, `Public Menu Item details retrieved for "${sampleItem.name}"`);

    // 4. User Registration (Public)
    const testEmail = `testuser_${Date.now()}@dabba.com`;
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Customer',
        email: testEmail,
        password: 'password123',
        confirmPassword: 'password123'
      })
    });
    const regData = await regRes.json();
    assert(regData.success && regData.user.role === 'User' && !!regData.token, 'Customer Registration creates User role and returns JWT');
    const customerToken = regData.token;

    // 5. User Login
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@dabba.com',
        password: 'user123'
      })
    });
    const loginData = await loginRes.json();
    assert(loginData.success && loginData.user.email === 'user@dabba.com', 'Demo Customer Login succeeds');

    // 6. Admin Login
    const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@dabba.com',
        password: 'admin123'
      })
    });
    const adminData = await adminLoginRes.json();
    assert(adminData.success && adminData.user.role === 'Admin', 'Admin Login succeeds with Admin role');
    const adminToken = adminData.token;

    // 7. Place Order (Cart & Billing flow)
    const orderPayload = {
      customerDetails: {
        fullName: 'Test Customer',
        email: testEmail,
        phone: '+1 555-4321',
        address: '100 Broadway St, Apt 2',
        city: 'New York',
        postalCode: '10001',
        notes: 'Ring doorbell twice please'
      },
      items: [
        {
          menuItem: sampleItem._id || sampleItem.id,
          name: sampleItem.name,
          price: sampleItem.price,
          quantity: 2,
          image: sampleItem.image,
          category: sampleItem.category
        }
      ],
      subtotal: sampleItem.price * 2,
      tax: Number(((sampleItem.price * 2) * 0.05).toFixed(2)),
      deliveryFee: 0,
      totalAmount: Number(((sampleItem.price * 2) * 1.05).toFixed(2)),
      paymentMethod: 'Card'
    };

    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify(orderPayload)
    });
    const orderResult = await orderRes.json();
    assert(orderResult.success && !!orderResult.order.orderNumber, `Order placed successfully (Order Ref: ${orderResult.order?.orderNumber})`);
    const createdOrderId = orderResult.order._id || orderResult.order.id;

    // 8. Fetch Order Details (Invoice / Receipt)
    const invoiceRes = await fetch(`${API_URL}/orders/${createdOrderId}`);
    const invoiceData = await invoiceRes.json();
    assert(invoiceData.success && invoiceData.order.customerDetails.fullName === 'Test Customer', 'Order Invoice/Receipt retrieved successfully');

    // 9. Customer Order History (My Orders)
    const userOrdersRes = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const userOrdersData = await userOrdersRes.json();
    assert(userOrdersData.success && userOrdersData.orders.length >= 1, 'Customer can fetch their own order history');

    // 10. Admin Update Order Status (Pending -> Preparing)
    const updateOrderRes = await fetch(`${API_URL}/orders/${createdOrderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Preparing' })
    });
    const updateOrderData = await updateOrderRes.json();
    assert(updateOrderData.success && updateOrderData.order.status === 'Preparing', 'Admin successfully updated order status to "Preparing"');

    // 11. Admin Add New Menu Item
    const addMenuRes = await fetch(`${API_URL}/menu-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Smoked Salmon Caviar Toast',
        description: 'Crispy brioche topped with cold-smoked salmon and Oscietra caviar.',
        category: 'Starter',
        price: 21.00,
        availability: true,
        imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270'
      })
    });
    const addMenuData = await addMenuRes.json();
    assert(addMenuData.success && addMenuData.item.name === 'Smoked Salmon Caviar Toast', 'Admin can add new menu item');
    const newDishId = addMenuData.item._id || addMenuData.item.id;

    // 12. Admin Update Menu Item
    const editMenuRes = await fetch(`${API_URL}/menu-items/${newDishId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        price: 22.50,
        availability: false
      })
    });
    const editMenuData = await editMenuRes.json();
    assert(editMenuData.success && editMenuData.item.price === 22.50 && editMenuData.item.availability === false, 'Admin can update menu item price and stock availability');

    // 13. Admin Dashboard Statistics (Slide 3: Total Menu Items, Users, Orders)
    const statsRes = await fetch(`${API_URL}/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    assert(
      statsData.success &&
      statsData.stats.totalMenuItems > 0 &&
      statsData.stats.totalUsers > 0 &&
      statsData.stats.totalOrders > 0,
      `Admin Dashboard stats computed: ${statsData.stats?.totalMenuItems} items, ${statsData.stats?.totalUsers} users, ${statsData.stats?.totalOrders} orders, $${statsData.stats?.totalRevenue} revenue`
    );

    // 14. Admin User Management: List Users
    const usersRes = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const usersData = await usersRes.json();
    assert(usersData.success && usersData.users.length >= 2, `Admin retrieved all users (${usersData.users.length} registered users)`);

    // 15. Admin Delete Menu Item
    const delMenuRes = await fetch(`${API_URL}/menu-items/${newDishId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const delMenuData = await delMenuRes.json();
    assert(delMenuData.success, 'Admin can delete menu item');

    console.log(`\n================================`);
    console.log(`🎉 Total Tests Run: ${passed + failed}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`================================\n`);

  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
