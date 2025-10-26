import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineSearch } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { usefilter } from '../context/Filtercontext';

const animatedComponents = makeAnimated();

// Custom Checkbox Option
const CheckboxOption = (props) => {
  const { label, isSelected } = props;
  return (
    <components.Option {...props}>
      <div
        className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-all duration-150 ${props.isFocused ? 'bg-purple-50' : ''}`}
      >
        <input type="checkbox" checked={isSelected} readOnly className="accent-purple-600 w-4 h-4 rounded cursor-pointer" />
        <label className="text-gray-700 text-sm cursor-pointer">{label}</label>
      </div>
    </components.Option>
  );
};

const customStyles = {
  dropdownIndicator: (base, state) => ({
    ...base,
    color: '#7E3AF2',
    transition: '0.2s',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
    ':hover': { color: '#7E3AF2' },
  }),
  control: (provided, state) => ({
    ...provided,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    borderColor: state.isFocused ? '#7E3AF2' : provided.borderColor,
    '&:hover': { borderColor: '#7E3AF2' },
    borderRadius: 6,
    minHeight: '40px',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: 8,
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  }),
  option: (base) => ({
    ...base,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: 'white',
    color: '#333',
    ':hover': { backgroundColor: 'white' },
  }),
  multiValue: (base) => ({
    ...base,
    color: '#7E3AF2',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#7E3AF2',
  }),
};

const dateOptions = [
  { value: { gte: 'now-60m', lte: 'now' }, label: 'Last 1 hour' },
  { value: { gte: 'now-1d/d', lte: 'now' }, label: 'Last 1 day' },
  { value: { gte: 'now-7d/d', lte: 'now/d' }, label: 'Last 7 days' },
  { value: { gte: 'now-15d/d', lte: 'now/d' }, label: 'Last 15 days' },
  { value: { gte: 'now-30d/d', lte: 'now/d' }, label: 'Last 1 month' },
];

const Filter = () => {
  const { filters, setFilters } = usefilter();
  const [publisherOptions, setPublisherOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [formatOptions, setFormatOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // State for controlling search input values in each select
  const [publisherInputValue, setPublisherInputValue] = useState('');
  const [categoryInputValue, setCategoryInputValue] = useState('');
  const [formatInputValue, setFormatInputValue] = useState('');
  const [countryInputValue, setCountryInputValue] = useState('');
  const [languageInputValue, setLanguageInputValue] = useState('');

  const commitSearch = () => {
    setFilters((prev) => ({ ...prev, search: inputValue }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitSearch();
  };

  const fetchData = async () => {
    try {
      // Build optional date filter for aggregations so options reflect selected date range
      const aggsBody = {
        size: 0,
        aggs: {
          categories: { terms: { field: 'category.keyword', size: 1000 } },
          publishers: {
            terms: {
              field: 'url_publishername.keyword',
              size: 1000,
            },
          },
          formats: {
            terms: {
              field: 'mainEntityOfPage.keyword',
              size: 1000,
            },
          },
          countries: {
            terms: { field: 'location.keyword', size: 1000 },
          },
          languages: {
            terms: { field: 'language.keyword', size: 1000 },
          },
        },
      };

      if (filters.Date && filters.Date.length > 0) {
        aggsBody.query = {
          bool: {
            filter: [{ range: { dateCrawled: filters.Date[0].value } }],
          },
        };
      }

      const res = await fetch('https://www.rytstory.com/api/data/discover-feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic bmltYTppbWFnZQ==',
        },
        body: JSON.stringify(aggsBody),
      });
      const data = await res.json();
      if (data.aggregations) {
        setCategoryOptions(
          data.aggregations.categories.buckets.map((b) => ({
            value: b.key,
            label: b.key,
          })),
        );
        setPublisherOptions(
          data.aggregations.publishers.buckets.map((b) => ({
            value: b.key,
            label: b.key,
          })),
        );
        setFormatOptions(
          data.aggregations.formats.buckets.map((b) => ({
            value: b.key,
            label: b.key,
          })),
        );
        setCountryOptions(
          data.aggregations.countries.buckets.map((b) => ({
            value: b.key,
            label: b.key,
          })),
        );
        setLanguageOptions(
          data.aggregations.languages.buckets.map((b) => ({
            value: b.key,
            label: b.key,
          })),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Re-fetch aggregation options when the selected date changes so
    // publisher/category/format/country/language option lists reflect the date scope.
    fetchData();
  }, [filters.Date]);

  const resetAll = () => {
    setFilters({
      Words: [],
      publishers: [],
      categories: [],
      formats: [],
      countries: [],
      languages: [],
      Date: [{ value: { gte: 'now-1d/d', lte: 'now' }, label: 'Last 1 day' }],
      search: '',
    });
    setInputValue('');
    // Reset all search input values
    setPublisherInputValue('');
    setCategoryInputValue('');
    setFormatInputValue('');
    setCountryInputValue('');
    setLanguageInputValue('');
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="px-25 mb-2">
        {filters.Words.length > 0 && (
          <button onClick={resetAll} className="flex items-center gap-2 border border-gray-400 rounded px-2 py-1 text-gray-500">
            {filters.Words[0].value} <RxCross2 />
          </button>
        )}
      </div>

      {/* Single row for all filters - no flex-wrap */}
      <div className="max-w-full mx-auto flex gap-5 px-25 items-center justify-between">
        <div className="flex gap-5 items-center flex-1">
          {/* Common react-select styles for consistent height */}
          {[
            {
              placeholder: 'Publisher',
              value: filters.publishers,
              onChange: (selected) => setFilters((p) => ({ ...p, publishers: selected })),
              inputValue: publisherInputValue,
              onInputChange: setPublisherInputValue,
              options: publisherOptions,
            },
            {
              placeholder: 'Categories',
              value: filters.categories,
              onChange: (selected) => setFilters((p) => ({ ...p, categories: selected })),
              inputValue: categoryInputValue,
              onInputChange: setCategoryInputValue,
              options: categoryOptions,
            },
            {
              placeholder: 'Format',
              value: filters.formats,
              onChange: (selected) => setFilters((p) => ({ ...p, formats: selected })),
              inputValue: formatInputValue,
              onInputChange: setFormatInputValue,
              options: formatOptions,
            },
            {
              placeholder: 'Country',
              value: filters.countries,
              onChange: (selected) => setFilters((p) => ({ ...p, countries: selected })),
              inputValue: countryInputValue,
              onInputChange: setCountryInputValue,
              options: countryOptions,
            },
            {
              placeholder: 'Language',
              value: filters.languages,
              onChange: (selected) => setFilters((p) => ({ ...p, languages: selected })),
              inputValue: languageInputValue,
              onInputChange: setLanguageInputValue,
              options: languageOptions,
            },
          ].map((item, index) => (
            <Select
              key={index}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              menuShouldCloseOnSelect={false}
              components={{ ...animatedComponents, Option: CheckboxOption }}
              value={item.value}
              onChange={item.onChange}
              inputValue={item.inputValue}
              onInputChange={(val, { action }) => {
                if (action === 'input-change') item.onInputChange(val);
              }}
              isMulti
              options={item.options}
              placeholder={item.placeholder}
              styles={{
                ...customStyles,
                control: (base, state) => ({
                  ...base,
                  minHeight: '36px',
                  borderColor: state.isFocused ? '#7E3AF2' : base.borderColor,
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#7E3AF2' },
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 8px',
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: '36px',
                }),
              }}
              className="min-w-50"
            />
          ))}
        </div>

        {/* Date selector on the right */}
        <div className="relative flex items-center min-w-[140px]">
          <Select
            value={filters.Date.length > 0 ? filters.Date[0] : null}
            onChange={(selected) =>
              setFilters((prev) => ({
                ...prev,
                Date: selected ? [selected] : [],
              }))
            }
            options={dateOptions}
            placeholder="Last 1 Day"
            styles={{
              ...customStyles,
              control: (base, state) => ({
                ...base,
                paddingLeft: '1rem', // make space for icon
                borderColor: state.isFocused ? '#7E3AF2' : base.borderColor,
                boxShadow: 'none',
                '&:hover': { borderColor: '#7E3AF2' },
              }),
            }}
            components={{
              ...animatedComponents,
              Control: (props) => (
                <components.Control {...props}>
                  <FaCalendarAlt className="text-[#7E3AF2]" />
                  {props.children}
                </components.Control>
              ),
            }}
            className="min-w-full"
          />
        </div>
      </div>

      <div className="px-25 mt-5">
        <div className="relative flex items-center shadow-sm border border-gray-200 rounded-b-sm overflow-hidden">
          <MdOutlineSearch className="ml-4 text-[#7E3AF2] text-2xl" />
          <input
            type="search"
            placeholder="Search for headlines..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 text-md outline-none"
          />
          <button
            onClick={commitSearch}
            disabled={!inputValue.trim()} // ✅ Disable when input is empty
            className={`px-6 py-3 font-semibold transition duration-200 ${
              inputValue.trim() ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
