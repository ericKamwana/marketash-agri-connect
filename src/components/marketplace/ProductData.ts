
// Mock data for product listings
const products = [
  {
    id: '1',
    image: '/public/lovable-uploads/8c84fdc3-7333-4cca-8c21-a1c14689e8e5.png', // Organic Tomatoes
    title: 'Organic Tomatoes',
    description: 'Fresh, pesticide-free tomatoes grown using organic farming methods. Perfect for salads and cooking.',
    basePrice: 2.50,
    unit: 'kg',
    quantity: 500,
    location: 'Nairobi, Kenya',
    harvestDate: '2 days ago',
    farmer: {
      name: 'Sarah Mwangi',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&auto=format&fit=crop',
      rating: 4
    }
  },
  {
    id: '2',
    image: '/public/lovable-uploads/ba229909-bc77-4575-b1d1-273245dd7769.png', // Premium Cassava
    title: 'Premium Cassava',
    description: 'High-yield cassava variety with excellent starch content. Ideal for flour and industrial processing.',
    basePrice: 1.20,
    unit: 'kg',
    quantity: 1200,
    location: 'Accra, Ghana',
    harvestDate: '1 week ago',
    farmer: {
      name: 'John Okafor',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      rating: 5
    }
  },
  {
    id: '3',
    image: '/public/lovable-uploads/6be60b20-7ca8-4e86-a444-9eef79152848.png', // Red Onions
    title: 'Red Onions',
    description: 'Sweet red onions grown in volcanic soil. Perfect for salads and cooking with extended shelf life.',
    basePrice: 1.80,
    unit: 'kg',
    quantity: 800,
    location: 'Kigali, Rwanda',
    harvestDate: '3 days ago',
    farmer: {
      name: 'Amina Diop',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&auto=format&fit=crop',
      rating: 4
    }
  },
  {
    id: '4',
    image: '/public/lovable-uploads/e684f887-1849-4787-8da2-6f47b9ff81c1.png', // Green Peppers
    title: 'Green Peppers',
    description: 'Fresh, crispy green peppers with excellent flavor. Great for salads, stir-fries, and stuffed peppers.',
    basePrice: 3.00,
    unit: 'kg',
    quantity: 300,
    location: 'Lagos, Nigeria',
    harvestDate: '1 day ago',
    farmer: {
      name: 'Kwame Adjei',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      rating: 3
    }
  },
  {
    id: '5',
    image: '/public/lovable-uploads/6e635c75-6b2f-4f00-97b1-1b72a2a6d8ca.png', // Sweet Corn
    title: 'Sweet Corn',
    description: 'Non-GMO sweet corn with excellent sugar content. Perfect for grilling, boiling, or adding to salads.',
    basePrice: 1.50,
    unit: 'kg',
    quantity: 750,
    location: 'Kampala, Uganda',
    harvestDate: '4 days ago',
    farmer: {
      name: 'Daniel Mensah',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
      rating: 5
    }
  },
  {
    id: '6',
    image: '/public/lovable-uploads/4f9557f6-fe5d-468c-9617-3795c3273de8.png', // Green Bananas
    title: 'Green Bananas',
    description: 'Organic green bananas, perfect for cooking traditional African dishes or for ripening at home.',
    basePrice: 1.20,
    unit: 'kg',
    quantity: 1000,
    location: 'Dar es Salaam, Tanzania',
    harvestDate: '2 days ago',
    farmer: {
      name: 'Grace Okonkwo',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      rating: 4
    }
  },
  {
    id: '7',
    image: '/public/lovable-uploads/0265b81e-2b35-46e9-917a-54611c5eac68.png', // Avocado
    title: 'Organic Avocados',
    description: 'Creamy, nutrient-rich avocados grown in the highlands. Perfect for salads, smoothies, and spreads.',
    basePrice: 3.80,
    unit: 'kg',
    quantity: 600,
    location: 'Meru, Kenya',
    harvestDate: '1 day ago',
    farmer: {
      name: 'Elizabeth Njeri',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
      rating: 5
    }
  },
  {
    id: '8',
    image: '/public/lovable-uploads/2273f442-e68e-486c-b902-6e858c97ff33.png', // Macadamia
    title: 'Macadamia Nuts',
    description: 'Premium grade macadamia nuts with high oil content. Perfect for snacking and gourmet food production.',
    basePrice: 12.50,
    unit: 'kg',
    quantity: 300,
    location: 'Embu, Kenya',
    harvestDate: '1 week ago',
    farmer: {
      name: 'Thomas Mutua',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
      rating: 4
    }
  },
  {
    id: '9',
    image: '/public/lovable-uploads/a10005da-4901-4d00-b3dc-a0a2bafebc74.png', // Miraa (Khat)
    title: 'Fresh Miraa (Khat)',
    description: 'High-quality miraa leaves, carefully harvested and packaged for maximum freshness and potency.',
    basePrice: 8.00,
    unit: 'bundle',
    quantity: 450,
    location: 'Meru, Kenya',
    harvestDate: 'Today',
    farmer: {
      name: 'Hassan Omar',
      image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=150&auto=format&fit=crop',
      rating: 5
    }
  },
  {
    id: '10',
    image: '/public/lovable-uploads/5f123a7f-a6d7-4f54-97ac-a732016d7187.png', // Coffee
    title: 'Premium Coffee Beans',
    description: 'Specialty grade Arabica coffee beans grown at high altitude. Rich flavor profile with notes of chocolate and citrus.',
    basePrice: 15.20,
    unit: 'kg',
    quantity: 800,
    location: 'Nyeri, Kenya',
    harvestDate: '3 days ago',
    farmer: {
      name: 'James Maina',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      rating: 5
    }
  }
];

const categories = [
  { name: 'Vegetables', count: 124 },
  { name: 'Fruits', count: 86 },
  { name: 'Grains', count: 53 },
  { name: 'Tubers', count: 42 },
  { name: 'Herbs', count: 21 },
  { name: 'Nuts', count: 18 }, 
  { name: 'Stimulants', count: 12 }, 
  { name: 'Beverages', count: 24 },
];

const locations = [
  { name: 'Kenya', count: 78 },
  { name: 'Nigeria', count: 65 },
  { name: 'Ghana', count: 43 },
  { name: 'Rwanda', count: 31 },
  { name: 'Tanzania', count: 28 },
];

export { products, categories, locations };
