
import React from 'react';
import { Filter, Map, Clock, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FilterSortBarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

const FilterSortBar = ({ showFilters, onToggleFilters }: FilterSortBarProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          className="flex items-center space-x-2"
          onClick={onToggleFilters}
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
  );
};

export default FilterSortBar;
