
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/marketplace/ProductCard';
import { Search, Filter, Map, Clock, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayProducts, setDisplayProducts] = useState(products);
  
  // Simulate loading data from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setDisplayProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.farmer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayProducts(filtered);
    }
  }, [searchQuery]);
  
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
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for products, farmers, or locations..."
                    className="w-full pl-10 pr-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-marketash-green"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search marketplace"
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
                aria-expanded={showFilters}
                aria-controls="filters-panel"
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                <span>Filters</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                aria-label="View marketplace map"
              >
                <Map className="h-4 w-4" aria-hidden="true" />
                <span>Map View</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Recently Added</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-1"
                aria-label="Sort products"
              >
                <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
                <span>Sort</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <div 
                id="filters-panel" 
                className="col-span-1 bg-white p-5 rounded-lg shadow-sm"
              >
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
                    <Button 
                      variant="outline" 
                      className="flex-1 text-sm"
                      aria-label="Reset all filters"
                    >
                      Reset
                    </Button>
                    <Button 
                      className="flex-1 text-sm bg-marketash-blue hover:bg-marketash-blue/90 text-white"
                      aria-label="Apply selected filters"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Product Grid */}
            <div 
              className={`${showFilters ? 'col-span-1 lg:col-span-3' : 'col-span-1 lg:col-span-4'} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}
              aria-live="polite"
              aria-busy={isLoading}
            >
              {isLoading ? (
                // Show skeleton loaders while loading
                [...Array(6)].map((_, index) => (
                  <ProductCard
                    key={`skeleton-${index}`}
                    id={`skeleton-${index}`}
                    isLoading={true}
                    image=""
                    title=""
                    description=""
                    basePrice={0}
                    unit=""
                    quantity={0}
                    location=""
                    harvestDate=""
                    farmer={{name: "", image: "", rating: 0}}
                  />
                ))
              ) : (
                // Show actual products when loaded
                displayProducts.map(product => (
                  <ProductCard key={product.id} {...product} isLoading={false} />
                ))
              )}
              
              {/* Show message when no products match search */}
              {!isLoading && displayProducts.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 text-lg">No products found matching your search.</p>
                  <Button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 bg-marketash-blue hover:bg-marketash-blue/90 text-white"
                    aria-label="Clear search and show all products"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
