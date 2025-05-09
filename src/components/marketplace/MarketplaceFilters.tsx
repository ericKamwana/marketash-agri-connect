
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

interface MarketplaceFiltersProps {
  categories: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string }>;
  selectedCategory: string;
  selectedLocation: string;
  onApplyFilters: (filters: { category: string; location: string }) => void;
  onResetFilters: () => void;
}

const MarketplaceFilters = ({
  categories,
  locations,
  selectedCategory,
  selectedLocation,
  onApplyFilters,
  onResetFilters
}: MarketplaceFiltersProps) => {
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localLocation, setLocalLocation] = useState(selectedLocation);

  const handleApply = () => {
    onApplyFilters({
      category: localCategory,
      location: localLocation
    });
  };

  const handleReset = () => {
    setLocalCategory('');
    setLocalLocation('');
    onResetFilters();
  };

  return (
    <div 
      id="filters-panel"
      className="bg-white p-5 rounded-lg shadow-sm"
    >
      <h3 className="font-semibold text-lg mb-4">Filter Products</h3>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-sm text-gray-600 mb-3">Categories</h4>
        <div className="space-y-2">
          <div 
            className={`
              cursor-pointer rounded-md py-1 px-2 flex justify-between items-center
              ${localCategory === '' ? 'bg-marketash-lightBlue text-marketash-blue' : 'hover:bg-gray-50'}
            `}
            onClick={() => setLocalCategory('')}
          >
            <span>All Categories</span>
            {localCategory === '' && <Check className="h-4 w-4" />}
          </div>
          
          {categories.map(category => (
            <div 
              key={category.id}
              className={`
                cursor-pointer rounded-md py-1 px-2 flex justify-between items-center
                ${localCategory === category.id ? 'bg-marketash-lightBlue text-marketash-blue' : 'hover:bg-gray-50'}
              `}
              onClick={() => setLocalCategory(category.id)}
            >
              <span>{category.name}</span>
              {localCategory === category.id && <Check className="h-4 w-4" />}
            </div>
          ))}
        </div>
      </div>
      
      {/* Locations */}
      <div className="mb-6">
        <h4 className="font-medium text-sm text-gray-600 mb-3">Location</h4>
        <div className="space-y-2">
          <div 
            className={`
              cursor-pointer rounded-md py-1 px-2 flex justify-between items-center
              ${localLocation === '' ? 'bg-marketash-lightBlue text-marketash-blue' : 'hover:bg-gray-50'}
            `}
            onClick={() => setLocalLocation('')}
          >
            <span>All Locations</span>
            {localLocation === '' && <Check className="h-4 w-4" />}
          </div>
          
          {locations.map(location => (
            <div 
              key={location.id}
              className={`
                cursor-pointer rounded-md py-1 px-2 flex justify-between items-center
                ${localLocation === location.id ? 'bg-marketash-lightBlue text-marketash-blue' : 'hover:bg-gray-50'}
              `}
              onClick={() => setLocalLocation(location.id)}
            >
              <span>{location.name}</span>
              {localLocation === location.id && <Check className="h-4 w-4" />}
            </div>
          ))}
        </div>
      </div>
      
      {/* Apply & Reset Buttons */}
      <div className="flex space-x-2">
        <Button 
          variant="default" 
          className="flex-1"
          onClick={handleApply}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
