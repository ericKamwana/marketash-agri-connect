import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/marketplace/ProductCard';
import { Search, Filter, Map, Clock, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Mock data for product listings
const products = [
  {
    id: '1',
    image: '/public/lovable-uploads/55587f5d-7386-498b-a425-ec93225e0e71.png', // Organic Tomatoes
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
    image: '/public/lovable-uploads/0076b5bb-3acc-465e-8d3a-1b27fbd365da.png', // Premium Cassava
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
    image: '/public/lovable-uploads/a85c7d3f-47a9-42f4-975f-7e3d3f9540d9.png', // Red Onions
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
    image: '/public/lovable-uploads/f0275f1c-dbc0-40d6-94cc-d67a5af5cbdb.png', // Green Peppers
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
    image: '/public/lovable-uploads/d4202ea3-1fcb-40ba-b1d9-1ae138496655.png', // Sweet Corn
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
    image: '/public/lovable-uploads/bc94cc4f-3991-4a72-bdf2-8c9e5dfeea6a.png', // Green Bananas
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
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800&auto=format&fit=crop', // Avocado
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
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800&auto=format&fit=crop', // Macadamia
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
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop', // Miraa (Khat)
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
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800&auto=format&fit=crop', // Coffee
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

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-marketash-gray py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="bg-marketash-blue rounded-lg p-6 md:p-10 mb-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Marketplace</h1>
                <p className="text-blue-100 mb-6">
                  Browse fresh produce directly from African farmers. 
                  Place bids, negotiate prices, and build lasting relationships.
                </p>
                
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for products, farmers, or locations..."
                    className="w-full pl-10 pr-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-marketash-green"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1493962853295-0fd70327578a?q=80&w=800&auto=format&fit=crop" 
                  alt="Marketplace" 
                  className="rounded-lg h-48 w-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Filter and Sort Options */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Map className="h-4 w-4" />
                <span>Map View</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>Recently Added</span>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="col-span-1 bg-white p-5 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Filter Products</h3>
                
                <div className="space-y-5">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Price Range (USD)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="min-price" className="sr-only">Minimum Price</label>
                        <input
                          type="number"
                          id="min-price"
                          placeholder="Min"
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="max-price" className="sr-only">Maximum Price</label>
                        <input
                          type="number"
                          id="max-price"
                          placeholder="Max"
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${index}`}
                            className="h-4 w-4 text-marketash-blue focus:ring-marketash-blue"
                          />
                          <label htmlFor={`category-${index}`} className="ml-2 text-sm text-gray-700 flex-1">
                            {category.name}
                          </label>
                          <span className="text-xs text-gray-500">{category.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Locations */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Locations</h4>
                    <div className="space-y-2">
                      {locations.map((location, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`location-${index}`}
                            className="h-4 w-4 text-marketash-blue focus:ring-marketash-blue"
                          />
                          <label htmlFor={`location-${index}`} className="ml-2 text-sm text-gray-700 flex-1">
                            {location.name}
                          </label>
                          <span className="text-xs text-gray-500">{location.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Apply/Reset Buttons */}
                  <div className="pt-2 flex space-x-3">
                    <Button variant="outline" className="flex-1 text-sm">
                      Reset
                    </Button>
                    <Button className="flex-1 text-sm bg-marketash-blue hover:bg-marketash-blue/90 text-white">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Product Grid */}
            <div className={`${showFilters ? 'col-span-1 lg:col-span-3' : 'col-span-1 lg:col-span-4'} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
              {products.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
