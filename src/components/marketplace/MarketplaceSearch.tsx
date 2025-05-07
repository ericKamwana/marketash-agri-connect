
import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface MarketplaceSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const MarketplaceSearch = ({ onSearch, initialQuery = '' }: MarketplaceSearchProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  
  // Update the debounced value after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);
  
  // Call onSearch only when debounced value changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        placeholder="Search for products, farmers, or locations..."
        className="w-full pl-10 pr-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-marketash-green"
        value={searchQuery}
        onChange={handleSearch}
        aria-label="Search marketplace"
      />
    </div>
  );
};

export default MarketplaceSearch;
