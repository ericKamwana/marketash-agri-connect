
// Mock data for product listings
const products = [
  {
    id: '1',
    image: '/lovable-uploads/ad6a5c34-3177-4b2a-9825-d07f23d715a2.png', // Tomatoes
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
    image: '/lovable-uploads/fbc1f1ae-5857-43fd-8175-dd8b7f24d0d6.png', // Cassava
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
    image: '/lovable-uploads/a753c13b-7cdc-4f0d-bebb-87f838b3b5bf.png', // Onions
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
    image: '/lovable-uploads/57d669c0-056c-42e8-92fe-824bd8758bc3.png', // Green Peppers
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
    image: '/lovable-uploads/e3f2019c-e264-493f-88f2-6762a660e345.png', // Corn
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
    image: '/lovable-uploads/66db3fe9-4879-4bc3-82f2-507e5a52dde0.png', // Green Bananas
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
    image: '/lovable-uploads/275299a5-02d0-4ac2-9eee-6d79b4b16998.png', // Avocado
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
    image: '/lovable-uploads/0c302b22-0e10-4ad5-bdd0-baea0c2b458a.png', // Macadamia
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
    image: '/lovable-uploads/41734420-a271-4531-a16a-23c9b6b2db59.png', // Khat
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
    image: '/lovable-uploads/eb2637c3-73ea-433e-a226-9b23b73ab26e.png', // Coffee
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
