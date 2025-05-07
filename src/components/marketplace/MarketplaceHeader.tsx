
import React from 'react';
import MarketplaceSearch from './MarketplaceSearch';

interface MarketplaceHeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const MarketplaceHeader = ({ onSearch, searchQuery }: MarketplaceHeaderProps) => {
  return (
    <div className="bg-marketash-blue rounded-lg p-6 md:p-10 mb-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Marketplace</h1>
          <p className="text-blue-100 mb-6">
            Browse fresh produce directly from African farmers. 
            Place bids, negotiate prices, and build lasting relationships.
          </p>
          
          {/* Search Bar */}
          <MarketplaceSearch onSearch={onSearch} initialQuery={searchQuery} />
        </div>
        <div className="hidden md:block">
          <img 
            src="/lovable-uploads/41809536-e626-4f4b-9665-6898b6f4af3b.png" 
            alt="Marketplace" 
            className="rounded-lg h-48 w-full object-cover"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
