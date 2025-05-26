
// Mock data for product listings
const products = [
  {
    id: '1',
    image: '/lovable-uploads/organic%20tomatoes.jpg',
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
    image: '/lovable-uploads/Premium%20Cassava.jpg',
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
    image: '/lovable-uploads/Red%20Onions.jpg',
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
    image: '/lovable-uploads/Green%20Peppers.jpg',
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
    image: '/lovable-uploads/e3f2019c-e264-493f-88f2-6762a660e345.png',
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
    image: '/lovable-uploads/Green%20Bananas.jpg',
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
    image: '/lovable-uploads/Organic%20Avocados.jpg',
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
    image: '/lovable-uploads/Macadamia%20Nuts.jpg',
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
    image: '/lovable-uploads/Fresh%20Miraa%20%28Khat%29.jpg',
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
    image: '/lovable-uploads/Premium%20Coffee%20Beans.jpg',
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
  { id: 'vegetables', name: 'Vegetables', count: 124 },
  { id: 'fruits', name: 'Fruits', count: 86 },
  { id: 'grains', name: 'Grains', count: 53 },
  { id: 'tubers', name: 'Tubers', count: 42 },
  { id: 'herbs', name: 'Herbs', count: 21 },
  { id: 'nuts', name: 'Nuts', count: 18 },
  { id: 'stimulants', name: 'Stimulants', count: 12 },
  { id: 'beverages', name: 'Beverages', count: 24 },
];

const locations = [
  { id: 'kenya', name: 'Kenya', count: 78 },
  { id: 'nigeria', name: 'Nigeria', count: 65 },
  { id: 'ghana', name: 'Ghana', count: 43 },
  { id: 'rwanda', name: 'Rwanda', count: 31 },
  { id: 'tanzania', name: 'Tanzania', count: 28 },
];

export { products, categories, locations };

