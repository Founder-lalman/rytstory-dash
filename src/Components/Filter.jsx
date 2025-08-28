import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineSearch, MdWidthFull } from "react-icons/md";
import makeAnimated from 'react-select/animated';
import { usefilter } from '../context/Filtercontext';
import { RxCross2 } from "react-icons/rx";

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
    { value: { gte: "now-30m", lte: "now" }, label: 'Last 30 min' },
    { value: { gte: "now-1d/d", lte: "now" }, label: 'Last 1 days' },
    { value: { gte: "now-8d/d", lte: "now/d" }, label: 'Last 7 days' },
    { value: { gte: "now-10d/d", lte: "now/d" }, label: 'Last 10 days' }
]

const Filter = () => {
    const { filters, setFilters } = usefilter();

    const [publisherOptions, setPublisherOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [formatOptions, setFormatOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const commitSearch = () => {
        setFilters(prev => ({ ...prev, search: inputValue }));
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitSearch();
        }
    };
    const fetchdata = async () => {
        try {
            const response = await fetch('https://www.rytstory.com/api/data/discover-feed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic bmltYTppbWFnZQ==' // your API key
                },
                body: JSON.stringify({
                    size: 0, // don't fetch docs, only aggregations
                    aggs: {
                        categories: {
                            terms: { field: "category.keyword", size: 1000, order: { _count: "desc" } }
                        },
                        publishers: {
                            terms: { field: "url_publishername.keyword", size: 1000, order: { _count: "desc" } }
                        },
                        formats: {
                            terms: { field: "mainEntityOfPage.keyword", size: 1000, order: { _count: "desc" } }
                        },
                        countries: {
                            terms: { field: "location.keyword", size: 1000, order: { _count: "desc" } }
                        }
                    },
                    query: {
                        bool: {
                            must: [],
                            filter: [
                                {
                                    range: {
                                        dateCrawled: {
                                            format: "strict_date_optional_time",
                                            gte: "2025-07-28T18:30:00.000Z",
                                            lte: "2025-08-05T16:45:29.469Z"
                                        }
                                    }
                                }
                            ],
                            should: [],
                            must_not: []
                        }
                    }
                })
            });

            const data = await response.json();

            if (data.aggregations) {
                setCategoryOptions(data.aggregations.categories.buckets.map(b => ({ value: b.key, label: b.key })));
                setPublisherOptions(data.aggregations.publishers.buckets.map(b => ({ value: b.key, label: b.key })));
                setFormatOptions(data.aggregations.formats.buckets.map(b => ({ value: b.key, label: b.key })));
                setCountryOptions(data.aggregations.countries.buckets.map(b => ({ value: b.key, label: b.key })));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

    const selectedWord =
        filters.Words && filters.Words.length > 0 ? filters.Words[0].value : null;

    const handleresetall = () => {
        window.location.reload();
    };

    return (
        <div className="max-w-full mx-auto">
            {/* Reset Button */}
            <div className="max-w-full mx-auto px-25 mb-2">
                {selectedWord && (
                    <button
                        className="cursor-pointer justify-center items-center flex gap-4 border border-gray-400 rounded-[4px] py-1 px-2 text-gray-500"
                        onClick={handleresetall}
                    >
                        {selectedWord} <RxCross2 />
                    </button>
                )}
            </div>

            {/* Dropdown Filters */}
            <div className="max-w-full mx-auto flex flex-col-2 px-25 gap-10 justify-between items-center">
                <div className="flex gap-5">
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={filters.publishers}
                        onChange={(selected) => setFilters(prev => ({ ...prev, publishers: selected }))}
                        isMulti
                        options={publisherOptions}
                        placeholder="Publisher"
                        styles={customStyles}
                        className='min-w-40'
                    />
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={filters.categories}
                        onChange={(selected) => setFilters(prev => ({ ...prev, categories: selected }))}
                        isMulti
                        options={categoryOptions}
                        placeholder="Categories"
                        styles={customStyles}
                        className='min-w-40'
                    />
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={filters.formats}
                        onChange={(selected) => setFilters(prev => ({...prev, formats: selected }))}
                        isMulti
                        options={formatOptions}
                        placeholder="Format"
                        styles={customStyles}
                        className='min-w-40'
                    />
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={filters.countries}
                        onChange={(selected) => setFilters(prev => ({ ...prev, countries: selected }))}
                        isMulti
                        options={countryOptions}
                        placeholder="Country"
                        styles={customStyles}
                        className='min-w-40'
                    />
                </div>

                {/* Date Picker */}
                <div>
                    <div className="relative flex gap-2 items-center">
                        <FaCalendarAlt className="absolute left-3 text-[#7E3AF2] text-xl" />
                        <Select
                            value={filters.Date && filters.Date.length > 0 ? filters.Date[0] : null}
                            onChange={(selected) => { setFilters(prev => ({ ...prev, Date: selected ? [selected] : [] })); }}
                            options={dateOptions}
                            placeholder="Select date"
                            styles={customStyles}
                            isMulti={false}
                            isClearable
                            components={animatedComponents}
                            className='min-w-40'
                        />
                    </div>
                </div>
            </div>
            {/* Search Bar */}
            <div className="px-25 mt-5 relative">
                <MdOutlineSearch className="absolute left-26 top-[6px] text-[#7E3AF2] text-3xl" />
                <input
                    type="search"
                    placeholder="Search"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onClick={commitSearch}
                    onKeyDown={handleKeyDown}
                    className="border border-gray-400 rounded px-4 pl-10 py-2 w-full outline-none"
                    isClearable
                    />
            </div>
        </div>
    );
};

export default Filter;
