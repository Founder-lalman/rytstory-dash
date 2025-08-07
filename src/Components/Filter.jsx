import React from 'react'
import { useState, useEffect } from 'react';
import Select from 'react-select'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();


const customStyles = {
    dropdownIndicator: (base, state) => ({
        ...base,
        color: '#7E3AF2',
        transition: '0.2s',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
        ':hover': {
            color: '#7E3AF2',
        },
    }),
};

const Filter = () => {

    const [publisherOptions, setPublisherOptions] = useState([]);
    const [selectedPublishers, setSelectedPublishers] = useState([]);

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [formatOptions, setFormatOptions] = useState([]);
    const [selectedFormats, setSelectedFormats] = useState([]);

    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);


    const fetchdata = async () => {
        try {
            const response = await fetch('https://43.205.65.179:8000/elastic_data/discover_feed_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic bmltYTppbWFnZQ=='
                },
                body: JSON.stringify({
                    aggs: {
                        "0": {
                            terms: {
                                field: "category.keyword",
                                order: { _count: "desc" },
                                size: 100
                            }
                        }
                    },
                    size: 100,
                    fields: [{ field: "dateCrawled", format: "date_time" }],
                    script_fields: {},
                    stored_fields: ["*"],
                    runtime_mappings: {
                        clickhere_url_link: {
                            type: "keyword",
                            script: {
                                source: "if (!doc['url.keyword'].empty) { emit(doc['url.keyword'].value); }"
                            }
                        }
                    },
                    _source: { excludes: [] },
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
            // console.log(">>>>>>", data)

            if (data.aggregations && data.aggregations["0"] && data.aggregations["0"].buckets) {
                // If you're getting categories from aggregations
                const categoryBuckets = data.aggregations["0"].buckets;
                const categories = categoryBuckets.map(bucket => ({
                    value: bucket.key,
                    label: bucket.key
                }));
                setCategoryOptions(categories);
            }

            if (data.hits && data.hits.hits) {
                const hits = data.hits.hits;

                const publisherSet = new Set();
                const categorySet = new Set();
                const formatSet = new Set();
                const countrySet = new Set();

                hits.forEach(hit => {
                    const src = hit._source;
                    if (src.url_publishername) publisherSet.add(src.url_publishername);
                    if (src.category) categorySet.add(src.category);
                    if (src.mainEntityOfPage) formatSet.add(src.mainEntityOfPage);
                    if (src.location) countrySet.add(src.location);
                });



                setPublisherOptions([...publisherSet].map(item => ({ value: item, label: item })));
                setCategoryOptions([...categorySet].map(item => ({ value: item, label: item })));
                setFormatOptions([...formatSet].map(item => ({ value: item, label: item })));
                setCountryOptions([...countrySet].map(item => ({ value: item, label: item })));

            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <>
            <div className="max-w-full mx-auto  ">
                <div className="max-w-full mx-auto flex flex-col-2 px-25 gap-10 justify-between items-center ">
                    <div className='flex gap-5'>
                        <div>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                value={selectedPublishers}
                                onChange={setSelectedPublishers}
                                isMulti
                                options={publisherOptions}
                                placeholder="Publisher"
                                styles={customStyles}
                            />
                        </div>
                        <div>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                value={selectedCategories}
                                onChange={setSelectedCategories}
                                isMulti
                                options={categoryOptions}
                                placeholder="Categories"
                                styles={customStyles}
                            />
                        </div>
                        <div>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                value={selectedFormats}
                                onChange={setSelectedFormats}
                                isMulti
                                options={formatOptions}
                                placeholder="Format"
                                styles={customStyles}
                            />
                        </div>
                        <div>
                            <Select
                                closeMenuOnSelect={false}
                                options={countryOptions}
                                isMulti
                                value={selectedCountries}
                                onChange={setSelectedCountries}
                                placeholder="Country"
                                styles={customStyles}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative flex gap-2 items-center">
                            <FaCalendarAlt className="absolute left-3 text-[#7E3AF2] text-xl" />
                            <DatePicker
                                // selected={selectedDate}
                                onChange={(selected) => setSelectedDate(selected)}
                                placeholderText="select date"
                                className="border border-gray-400 rounded px-4 pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]"
                                dateFormat="dd-MM-yyyy"
                            //  styles={customStyles}
                            />
                        </div>
                    </div>
                </div>
                <div className='px-25 mt-5 relative'>
                    <MdOutlineSearch className="absolute  left-26 top-1  text-[#7E3AF2] text-2xl" />
                    <input
                        type='search'
                        placeholder='Search'
                        className='border-1 border-gray-400 rounded-sm px-4 pl-8 py-1 w-full outline-none  '
                    />
                </div>
            </div>
        </>
    )
}

export default Filter;