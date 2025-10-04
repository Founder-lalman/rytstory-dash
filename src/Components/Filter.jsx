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

      <div className="max-w-full mx-auto flex flex-col-2 px-25 gap-10 justify-between items-center">
        <div className="flex gap-5">
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={filters.publishers}
            onChange={(selected) => setFilters((prev) => ({ ...prev, publishers: selected }))}
            isMulti
            options={publisherOptions}
            placeholder="Publisher"
            styles={customStyles}
            className="min-w-50"
          />
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={filters.categories}
            onChange={(selected) => setFilters((prev) => ({ ...prev, categories: selected }))}
            isMulti
            options={categoryOptions}
            placeholder="Categories"
            styles={customStyles}
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
            styles={customStyles}
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
            styles={customStyles}
            className="min-w-50"
          />
        </div>

        <div className="relative flex gap-2 items-center">
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

      <div className="px-25 mt-5 relative">
        <MdOutlineSearch className="absolute left-26 top-[6px] text-[#7E3AF2] text-3xl" />
        <input
          type="search"
          placeholder="Search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-400 rounded px-4 pl-10 py-2 w-full outline-none"
        />
      </div>
    </div>
  );
};

export default Filter;
