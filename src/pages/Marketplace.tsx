
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { categories, locations } from '@/components/marketplace/ProductData';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import FilterSortBar from '@/components/marketplace/FilterSortBar';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
import ProductGrid from '@/components/marketplace/ProductGrid';
import { useProducts, Product } from '@/lib/supabase/useProducts';
import { useToast } from "@/components/ui/use-toast";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();
  
  // Fetch products using the custom hook
  const { useProductsQuery } = useProducts();
  const { 
    data: products = [], 
    isLoading, 
    error 
  } = useProductsQuery({
    category: selectedCategory,
    location: selectedLocation,
    search: searchQuery,
    sortBy,
    sortOrder,
  });
  
  // Format products for the ProductGrid component
  const formatProductsForGrid = (products: Product[]) => {
    return products.map(product => ({
      id: product.id,
      image: product.image,
      title: product.title,
      description: product.description,
      basePrice: Number(product.base_price),
      unit: product.unit,
      quantity: product.quantity,
      location: product.location,
      harvestDate: new Date(product.harvest_date).toLocaleDateString(),
      farmer: {
        name: product.profiles.display_name || 'Unknown Farmer',
        image: product.profiles.avatar_url || '/placeholder.svg',
        rating: product.profiles.rating || 0,
        id: product.user_id
      }
    }));
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const handleApplyFilters = (filters: { category: string; location: string; }) => {
    setSelectedCategory(filters.category);
    setSelectedLocation(filters.location);
  };
  
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedLocation('');
  };
  
  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  
  // Show error if there was a problem loading products
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading products",
        description: "There was a problem loading the products. Please try again.",
      });
    }
  }, [error, toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-marketash-gray py-8 pt-24">
        <div className="container mx-auto px-4">
          {/* Hero Section with Search */}
          <MarketplaceHeader onSearch={handleSearch} searchQuery={searchQuery} />
          
          {/* Filter and Sort Options */}
          <FilterSortBar 
            showFilters={showFilters} 
            onToggleFilters={() => setShowFilters(!showFilters)} 
            onSortChange={handleSortChange}
            currentSort={sortBy}
            currentOrder={sortOrder}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <MarketplaceFilters 
                categories={categories}
                locations={locations}
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            )}
            
            {/* Product Grid with Lazy Loading */}
            <ProductGrid 
              products={formatProductsForGrid(products)} 
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
