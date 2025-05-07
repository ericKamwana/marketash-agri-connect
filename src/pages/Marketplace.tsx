
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { products, categories, locations } from '@/components/marketplace/ProductData';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import FilterSortBar from '@/components/marketplace/FilterSortBar';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
import ProductGrid from '@/components/marketplace/ProductGrid';

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
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const handleApplyFilters = () => {
    // This would be implemented when we connect to real backend
    console.log('Applying filters');
  };
  
  const handleResetFilters = () => {
    // This would be implemented when we connect to real backend
    console.log('Resetting filters');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-marketash-gray py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section with Search */}
          <MarketplaceHeader onSearch={handleSearch} searchQuery={searchQuery} />
          
          {/* Filter and Sort Options */}
          <FilterSortBar 
            showFilters={showFilters} 
            onToggleFilters={() => setShowFilters(!showFilters)} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <MarketplaceFilters 
                categories={categories}
                locations={locations}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            )}
            
            {/* Product Grid with Lazy Loading */}
            <ProductGrid 
              products={displayProducts} 
              isLoading={isLoading} 
              showFilters={showFilters}
              clearSearch={clearSearch}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
