import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineSearch } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { usefilter } from '../context/Filtercontext';

const animatedComponents = makeAnimated();

const customStyles = {
  dropdownIndicator: (base, state) => ({
    ...base,
    color: '#7E3AF2',
    transition: '0.2s',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
    ':hover': { color: '#7E3AF2' },
  }),
};

const dateOptions = [
  { value: { gte: 'now-15m', lte: 'now' }, label: 'Last 15 min' },
  { value: { gte: 'now-30m', lte: 'now' }, label: 'Last 30 min' },
  { value: { gte: 'now-60m', lte: 'now' }, label: 'Last 1 hours' },
  { value: { gte: 'now-1d/d', lte: 'now' }, label: 'Last 1 days' },
  { value: { gte: 'now-7d/d', lte: 'now/d' }, label: 'Last 7 days' },
  { value: { gte: 'now-30d/d', lte: 'now/d' }, label: 'Last 1 Months' },
];

const Filter = () => {
  const { filters, setFilters } = usefilter();
  const [publisherOptions, setPublisherOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [formatOptions, setFormatOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const commitSearch = () => {
    setFilters((prev) => ({ ...prev, search: inputValue }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitSearch();
  };

  const fetchData = async () => {
    try {
      const res = await fetch('https://www.rytstory.com/api/data/discover-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Basic bmltYTppbWFnZQ==' },
        body: JSON.stringify({
          size: 0,
          aggs: {
            categories: { terms: { field: 'category.keyword', size: 1000 } },
            publishers: { terms: { field: 'url_publishername.keyword', size: 1000 } },
            formats: { terms: { field: 'mainEntityOfPage.keyword', size: 1000 } },
            countries: { terms: { field: 'location.keyword', size: 1000 } },
          },
        }),
      });
      const data = await res.json();
      if (data.aggregations) {
        setCategoryOptions(data.aggregations.categories.buckets.map((b) => ({ value: b.key, label: b.key })));
        setPublisherOptions(data.aggregations.publishers.buckets.map((b) => ({ value: b.key, label: b.key })));
        setFormatOptions(data.aggregations.formats.buckets.map((b) => ({ value: b.key, label: b.key })));
        setCountryOptions(data.aggregations.countries.buckets.map((b) => ({ value: b.key, label: b.key })));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetAll = () => {
    setFilters({
      Words: [],
      publishers: [],
      categories: [],
      formats: [],
      countries: [],
      Date: [],
      search: '',
    });
    setInputValue('');
  };

  const customSelectStyles = {
    ...customStyles, // your existing customStyles
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.isFocused ? '0 1px 2px rgba(0, 0, 0, 0.05)' : '0 1px 2px rgba(0, 0, 0, 0.05)', // Tailwind shadow-sm equivalent
      borderColor: state.isFocused ? '#7E3AF2' : provided.borderColor,
      '&:hover': {
        borderColor: '#7E3AF2',
      },
    }),
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Reset Button */}
      <div className="max-w-full mx-auto px-25 mb-2">
        {filters.Words.length > 0 && (
          <button
            className="cursor-pointer justify-center items-center flex gap-4 border border-gray-400 rounded-[4px] py-1 px-2 text-gray-500"
            onClick={resetAll}
          >
            {filters.Words[0].value} <RxCross2 />
          </button>
        )}
      </div>

      <div className="max-w-full mx-auto flex flex-col-2 px-25 gap-10 justify-between items-center ">
        <div className="flex gap-5">
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={filters.publishers}
            onChange={(selected) => setFilters((prev) => ({ ...prev, publishers: selected }))}
            isMulti
            options={publisherOptions}
            placeholder="Publisher"
            styles={customSelectStyles}
            className="min-w-50"
            shadow-sm
          />
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={filters.categories}
            onChange={(selected) => setFilters((prev) => ({ ...prev, categories: selected }))}
            isMulti
            options={categoryOptions}
            placeholder="Categories"
            styles={customSelectStyles}
            className="min-w-50"
          />
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={filters.formats}
            onChange={(selected) => setFilters((prev) => ({ ...prev, formats: selected }))}
            isMulti
            options={formatOptions}
            placeholder="Format"
            styles={customSelectStyles}
            className="min-w-50"
          />
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={filters.countries}
            onChange={(selected) => setFilters((prev) => ({ ...prev, countries: selected }))}
            isMulti
            options={countryOptions}
            placeholder="Country"
            styles={customSelectStyles}
            className="min-w-50"
          />
        </div>

        <div className="relative flex gap-2 shadow-sm items-center">
          <FaCalendarAlt className="absolute left-3 text-[#7E3AF2] text-xl" />
          <Select
            value={filters.Date.length > 0 ? filters.Date[0] : null}
            onChange={(selected) => setFilters((prev) => ({ ...prev, Date: selected ? [selected] : [] }))}
            options={dateOptions}
            placeholder="Select date"
            styles={customStyles}
            components={animatedComponents}
            className="min-w-40"
          />
        </div>
      </div>

      <div className="px-25 mt-5">
        <div className="relative w-full flex items-center shadow-sm  overflow-hidden border border-gray-200">
          {/* Search Icon */}
          <MdOutlineSearch className="ml-4 text-[#7E3AF2] text-2xl" />

          {/* Input Field */}
          <input
            type="search"
            placeholder="Search for headlines..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 text-md outline-none rounded-l-full"
          />

          {/* Search Button */}
          <button onClick={commitSearch} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 font-semibold  transition duration-200">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
