
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';

interface Category {
  name: string;
  count: number;
}

interface Location {
  name: string;
  count: number;
}

interface MarketplaceFiltersProps {
  categories: Category[];
  locations: Location[];
  onApplyFilters: (filters: { category: string; location: string }) => void;
  onResetFilters: () => void;
  selectedCategory?: string;
  selectedLocation?: string;
}

const MarketplaceFilters = ({ 
  categories, 
  locations,
  onApplyFilters,
  onResetFilters,
  selectedCategory = '',
  selectedLocation = ''
}: MarketplaceFiltersProps) => {
  const [category, setCategory] = useState(selectedCategory);
  const [location, setLocation] = useState(selectedLocation);

  const handleApply = () => {
    onApplyFilters({ category, location });
  };

  return (
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
            {categories.map((cat, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${index}`}
                  className="h-4 w-4 text-marketash-blue focus:ring-marketash-blue"
                  checked={category === cat.name}
                  onChange={() => setCategory(category === cat.name ? '' : cat.name)}
                />
                <label htmlFor={`category-${index}`} className="ml-2 text-sm text-gray-700 flex-1">
                  {cat.name}
                </label>
                <span className="text-xs text-gray-500">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Locations */}
        <div>
          <h4 className="font-medium text-sm mb-2">Locations</h4>
          <div className="space-y-2">
            {locations.map((loc, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`location-${index}`}
                  className="h-4 w-4 text-marketash-blue focus:ring-marketash-blue"
                  checked={location === loc.name}
                  onChange={() => setLocation(location === loc.name ? '' : loc.name)}
                />
                <label htmlFor={`location-${index}`} className="ml-2 text-sm text-gray-700 flex-1">
                  {loc.name}
                </label>
                <span className="text-xs text-gray-500">{loc.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Apply/Reset Buttons */}
        <div className="pt-2 flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 text-sm"
            onClick={onResetFilters}
            aria-label="Reset all filters"
          >
            Reset
          </Button>
          <Button 
            className="flex-1 text-sm bg-marketash-blue hover:bg-marketash-blue/90 text-white"
            onClick={handleApply}
            aria-label="Apply selected filters"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
