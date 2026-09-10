import bcrypt from 'bcryptjs';
import UserModel from '../models/User.js';
import MenuItemModel from '../models/MenuItem.js';

export const seedDatabase = async () => {
  try {
    const existingUsers = await UserModel.countDocuments();
    if (existingUsers === 0) {
      console.log('🌱 [Seeder] Seeding default Admin and Demo User...');
      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('user123', 10);

      await UserModel.create({
        name: 'Dabba Admin',
        email: 'admin@dabba.com',
        password: adminPassword,
        role: 'Admin'
      });

      await UserModel.create({
        name: 'Sarah Jenkins',
        email: 'user@dabba.com',
        password: userPassword,
        role: 'User'
      });
      console.log('✅ [Seeder] Seeded Admin (admin@dabba.com / admin123) and User (user@dabba.com / user123)');
    }

    const existingMenu = await MenuItemModel.countDocuments();
    if (existingMenu === 0) {
      console.log('🌱 [Seeder] Seeding default restaurant menu items...');
      const sampleItems = [
        // Starters
        {
          name: 'Crispy Truffle Arancini',
          description: 'Golden fried arborio risotto spheres infused with black truffle oil, stuffed with melted fior di latte mozzarella and served with basil marinara dip.',
          category: 'Starter',
          price: 12.99,
          availability: true,
          image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Fire-Roasted Garlic Bruschetta',
          description: 'Toasted sourdough baguette slices rubbed with roasted garlic, topped with vine-ripened heirloom tomatoes, aged balsamic glaze, and fresh garden basil.',
          category: 'Starter',
          price: 9.50,
          availability: true,
          image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Spicy Buffalo Cauliflower Bites',
          description: 'Crispy tempura florets tossed in zesty artisanal sriracha buffalo glaze, served with creamy blue cheese dip and crunchy celery curls.',
          category: 'Starter',
          price: 10.50,
          availability: true,
          image: 'https://images.unsplash.com/photo-1625938145744-e380515399b7?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Mediterranean Mezze Platter',
          description: 'Velvety house hummus, smoky baba ganoush, kalamata olives, marinated feta, and warm wood-fired za’atar pita bread triangles.',
          category: 'Starter',
          price: 14.00,
          availability: true,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
        },

        // Main Courses
        {
          name: 'Signature Wagyu Artisan Burger',
          description: 'Prime dry-aged Wagyu beef patty, melted smoked cheddar, caramelized shallot jam, crisp butter lettuce, and truffle garlic aioli on a toasted brioche bun.',
          category: 'Main Course',
          price: 18.99,
          availability: true,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Handcrafted Fettuccine Alfredo',
          description: 'Silky ribbons of freshly rolled pasta simmered in rich 24-month Parmigiano-Reggiano cream sauce, cracked peppercorns, and fresh herbs.',
          category: 'Main Course',
          price: 16.50,
          availability: true,
          image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Wood-Fired Margherita Napoletana',
          description: 'Slow-fermented Neapolitan dough baked at 900°F with San Marzano tomato coulis, buffalo mozzarella, virgin olive oil, and aromatic sweet basil.',
          category: 'Main Course',
          price: 15.00,
          availability: true,
          image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Pan-Seared Atlantic Salmon',
          description: 'Crispy skin wild Atlantic salmon fillet served over saffron asparagus risotto, glazed with Meyer lemon caper beurre blanc.',
          category: 'Main Course',
          price: 24.00,
          availability: true,
          image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Slow-Braised Moroccan Lamb Tagine',
          description: 'Tender grass-fed lamb shank gently braised for 6 hours with apricots, toasted almonds, and aromatic North African spices over fluffy couscous.',
          category: 'Main Course',
          price: 22.50,
          availability: true,
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
        },

        // Desserts
        {
          name: 'Decadent Molten Lava Cake',
          description: 'Rich Belgian dark chocolate sponge cake with an oozing warm chocolate ganache center, topped with Tahitian vanilla bean gelato.',
          category: 'Dessert',
          price: 8.99,
          availability: true,
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Classic Venetian Tiramisu',
          description: 'Delicate ladyfingers dipped in strong espresso and amaretto liqueur, layered with whipped mascarpone cream and dusted with raw cocoa.',
          category: 'Dessert',
          price: 9.50,
          availability: true,
          image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Madagascar Vanilla Creme Brulee',
          description: 'Silky baked vanilla bean custard crowned with an impeccably shattered layer of caramelized turbinado sugar and fresh raspberries.',
          category: 'Dessert',
          price: 8.50,
          availability: true,
          image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
        },

        // Beverages
        {
          name: 'Fresh Berry Hibiscus Cooler',
          description: 'Steeped ruby Egyptian hibiscus blossoms infused with crushed blackberries, fresh mint, and sparkling citrus soda.',
          category: 'Beverage',
          price: 5.50,
          availability: true,
          image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Artisanal Cold Brew Espresso',
          description: '18-hour single-origin Ethiopian cold brew served over a hand-carved ice sphere with sweet vanilla cream foam.',
          category: 'Beverage',
          price: 4.75,
          availability: true,
          image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Passionfruit Mint Mojito',
          description: 'Zesty tropical passionfruit pulp muddled with fresh mint leaves, lime wedges, cane sugar syrup, and crisp soda water.',
          category: 'Beverage',
          price: 6.50,
          availability: true,
          image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80'
        }
      ];

      for (const item of sampleItems) {
        await MenuItemModel.create(item);
      }
      console.log(`✅ [Seeder] Seeded ${sampleItems.length} menu items successfully.`);
    }
  } catch (error) {
    console.error('❌ [Seeder] Error during database seeding:', error.message);
  }
};
