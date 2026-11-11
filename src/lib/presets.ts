import { Preset } from '@/types/converter';

export const PRESETS: Preset[] = [
  {
    id: 'user-profile',
    name: 'User Profile',
    data: {
      id: "usr_9921a",
      name: "Alex Rivera",
      email: "alex.rivera@example.com",
      website: "https://alexrivera.dev",
      is_active: true,
      role: "admin",
      created_at: "2026-03-15T08:30:00Z",
      socials: ["github", "twitter"],
      metadata: {
        login_count: 42,
        last_ip: "192.168.1.1"
      }
    }
  },
  {
    id: 'ecommerce-order',
    name: 'E-Commerce Order',
    data: {
      order_id: "ord_88301",
      total_amount: 149.99,
      status: "shipped",
      items: [
        { product_id: "prod_1", qty: 2, price: 49.99 },
        { product_id: "prod_2", qty: 1, price: 50.00 }
      ],
      shipping_address: {
        street: "Jl. Sudirman No. 45",
        city: "Jakarta",
        postal_code: "10220"
      }
    }
  }
];