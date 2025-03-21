import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function SearchFilters({ categories, tags, filters }) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchForm, setSearchForm] = useState({
    search: filters.search || '',
    category: filters.category || '',
    tag: filters.tag || '',
    sort: filters.sort || 'created_at',
    direction: filters.direction || 'desc',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('projects.index'), searchForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setSearchForm({
      search: '',
      category: '',
      tag: '',
      sort: 'created_at',
      direction: 'desc',
    });
    router.get(route('projects.index'));
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
        <button
          type="button"
          className="md:hidden bg-white dark:bg-gray-800 p-2 rounded-md text-gray-400 hover:text-gray-500"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <span className="sr-only">Toggle filters</span>
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      {/* Mobile filters */}
      <Transition
        show={showMobileFilters}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
        className="md:hidden"
      >
        <div className="mt-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
          <form onSubmit={handleSearch}>
            <div className="space-y-4">
              <div>
                <label htmlFor="mobile-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                <input
                  type="text"
                  id="mobile-search"
                  name="search"
                  value={searchForm.search}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="Search projects..."
                />
              </div>
            
              <div>
                <label htmlFor="mobile-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  id="mobile-category"
                  name="category"
                  value={searchForm.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            
              <div>
                <label htmlFor="mobile-tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tag</label>
                <select
                  id="mobile-tag"
                  name="tag"
                  value={searchForm.tag}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="">All Tags</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                  ))}
                </select>
              </div>
            
              <div>
                <label htmlFor="mobile-sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort by</label>
                <select
                  id="mobile-sort"
                  name="sort"
                  value={searchForm.sort}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="created_at">Newest</option>
                  <option value="name">Name</option>
                  <option value="stars_count">Most Stars</option>
                  <option value="views_count">Most Views</option>
                </select>
              </div>
            
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </form>
        </div>
      </Transition>

      {/* Desktop filters */}
      <div className="hidden md:block mt-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              value={searchForm.search}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Search projects..."
            />
          </div>
            
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              id="category"
              name="category"
              value={searchForm.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
            
          <div>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tag</label>
            <select
              id="tag"
              name="tag"
              value={searchForm.tag}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </div>
            
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort by</label>
            <select
              id="sort"
              name="sort"
              value={searchForm.sort}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="created_at">Newest</option>
              <option value="name">Name</option>
              <option value="stars_count">Most Stars</option>
              <option value="views_count">Most Views</option>
            </select>
          </div>
            
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
