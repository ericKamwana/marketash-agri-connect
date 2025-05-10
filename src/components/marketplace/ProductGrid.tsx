
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Array<{
    id: string;
    image: string;
    title: string;
    description: string;
    basePrice: number;
    unit: string;
    quantity: number;
    location: string;
    harvestDate: string;
    farmer: {
      name: string;
      image: string;
      rating: number;
      id?: string;
    };
  }>;
  isLoading: boolean;
  showFilters: boolean;
  clearSearch: () => void;
}

const ProductGrid = ({ products, isLoading, showFilters, clearSearch }: ProductGridProps) => {
  // For lazy loading
  const [visibleItems, setVisibleItems] = useState(6); // Initial number of items to show
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && products.length > visibleItems) {
          // Load more products when the user scrolls to the observer target
          setVisibleItems(prevVisibleItems => Math.min(prevVisibleItems + 3, products.length));
        }
      },
      {
        rootMargin: '100px'
      }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoading, products.length, visibleItems]);
  
  // Reset visible items when products change
  useEffect(() => {
    setVisibleItems(6);
  }, [products]);
  
  const visibleProducts = products.slice(0, visibleItems);
  
  return (
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
        // Show visible products when loaded with lazy loading
        visibleProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            isLoading={false} 
            // Add lazy loading for images below the fold
            imageLazyLoad={index >= 3}
          />
        ))
      )}
      
      {/* Target element for the Intersection Observer */}
      {!isLoading && products.length > visibleItems && (
        <div ref={observerTarget} className="col-span-full h-10 flex justify-center items-center">
          <Button
            onClick={() => setVisibleItems(prev => Math.min(prev + 3, products.length))}
            variant="outline"
            className="bg-marketash-blue/10 hover:bg-marketash-blue/20"
          >
            Load more
          </Button>
        </div>
      )}
      
      {/* Show message when no products match search */}
      {!isLoading && products.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500 text-lg">No products found matching your search.</p>
          <Button 
            onClick={clearSearch}
            className="mt-4 bg-marketash-blue hover:bg-marketash-blue/90 text-white"
            aria-label="Clear search and show all products"
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
