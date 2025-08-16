import React from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';

function ProductFilter({ 
  categories, 
  selectedCategory,
  priceRange,
  selectedBrands,
  stockFilter,
  onCategoryChange,
  onPriceRangeChange,
  onBrandChange,
  onStockFilterChange,
  onClearFilters,
  isOpen,
  onToggle
}) {
  return (
    <div className="relative">
      {/* Mobile filter dialog */}
      <div className="lg:hidden">
        <button
          type="button"
          className="flex items-center gap-x-2 text-sm font-medium text-accent"
          onClick={onToggle}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters */}
      <div className={`${
        isOpen ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : 'hidden lg:block'
      }`}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-25 lg:hidden" onClick={onToggle} />

        {/* Filter panel */}
        <div className="fixed inset-y-0 right-0 z-50 w-full bg-white px-4 py-4 sm:px-6 lg:relative lg:inset-auto lg:w-full lg:translate-x-0 lg:px-0">
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-medium text-primary">Filters</h2>
            <button
              type="button"
              className="text-accent hover:text-primary"
              onClick={onToggle}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 lg:mt-0">
            {/* Categories */}
            <div className="border-b border-accent/10 pb-6">
              <h3 className="text-sm font-medium text-primary mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center">
                    <input
                      type="radio"
                      id={category.slug}
                      name="category"
                      value={category._id}
                      checked={selectedCategory === category._id}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="h-4 w-4 rounded border-accent/30 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={category.slug}
                      className="ml-3 text-sm text-accent cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-b border-accent/10 py-6">
              <h3 className="text-sm font-medium text-primary mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div>
                    <label htmlFor="min-price" className="sr-only">
                      Minimum Price
                    </label>
                    <input
                      type="number"
                      id="min-price"
                      value={priceRange.min}
                      onChange={(e) => onPriceRangeChange({ 
                        ...priceRange, 
                        min: Number(e.target.value) 
                      })}
                      className="w-24 rounded-md border border-accent/30 px-3 py-1.5 text-sm"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price" className="sr-only">
                      Maximum Price
                    </label>
                    <input
                      type="number"
                      id="max-price"
                      value={priceRange.max}
                      onChange={(e) => onPriceRangeChange({ 
                        ...priceRange, 
                        max: Number(e.target.value) 
                      })}
                      className="w-24 rounded-md border border-accent/30 px-3 py-1.5 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="border-b border-accent/10 py-6">
              <h3 className="text-sm font-medium text-primary mb-4">Brands</h3>
              <div className="space-y-2">
                {Array.from(new Set(categories
                  .flatMap(cat => cat.products)
                  .map(product => product?.brand)))
                  .filter(Boolean)
                  .map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        id={brand}
                        value={brand}
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          const brand = e.target.value;
                          onBrandChange(
                            selectedBrands.includes(brand)
                              ? selectedBrands.filter(b => b !== brand)
                              : [...selectedBrands, brand]
                          );
                        }}
                        className="h-4 w-4 rounded border-accent/30 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor={brand}
                        className="ml-3 text-sm text-accent cursor-pointer"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="py-6">
              <h3 className="text-sm font-medium text-primary mb-4">Availability</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in-stock"
                    checked={stockFilter === 'in-stock'}
                    onChange={() => onStockFilterChange('in-stock')}
                    className="h-4 w-4 rounded border-accent/30 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="in-stock"
                    className="ml-3 text-sm text-accent cursor-pointer"
                  >
                    In Stock
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="out-of-stock"
                    checked={stockFilter === 'out-of-stock'}
                    onChange={() => onStockFilterChange('out-of-stock')}
                    className="h-4 w-4 rounded border-accent/30 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="out-of-stock"
                    className="ml-3 text-sm text-accent cursor-pointer"
                  >
                    Out of Stock
                  </label>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent focus:outline-none"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
