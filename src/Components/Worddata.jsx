import React from 'react'
import { useState, useEffect } from 'react';
import WordCloud from './WordCloud';
import { usefilter } from '../context/Filtercontext';




const Worddata = () => {
    const { filters } = usefilter();

    const [clouddata, setclouddata] = useState();

    useEffect(() => {

        const worddata = async () => {
            try {
                const filtereddata = [];

                if (filters.publishers.length > 0) {
                    filtereddata.push({
                        terms: {
                            "url_publishername.keyword": filters.publishers.map(p => p.value)
                        }
                    });
                }
                if (filters.categories.length > 0) {
                    filtereddata.push({
                        terms: {
                            "category.keyword": filters.categories.map(c => c.value)
                        }
                    });
                }
                if (filters.formats.length > 0) {
                    filtereddata.push({
                        terms: {
                            "mainEntityOfPage.keyword": filters.formats.map(f => f.value)
                        }
                    });
                }
                if (filters.countries.length > 0) {
                    filtereddata.push({
                        terms: {
                            "location.keyword": filters.countries.map(co => co.value)
                        }
                    });
                }
                filtereddata.push({
                    range: { dateCrawled: { gte: "now/d", lte: "now" } }
                });
                
                const response = await fetch('https://www.rytstory.com/api/data/discover-feed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic bmltYTppbWFnZQ=='
                    },
                    body: JSON.stringify(
                        {
                            "aggs": {
                                "2": {
                                    "terms": {
                                        "field": "wiki_ents.keyword",
                                        "order": {
                                            "1": "desc"
                                        },
                                        "size": 50
                                    },
                                    "aggs": {
                                        "1": {
                                            "cardinality": {
                                                "field": "email.keyword"
                                            }
                                        }
                                    }
                                }
                            },
                            "size": 0,
                            "fields": [
                                {
                                    "field": "dateCrawled",
                                    "format": "date_time"
                                }
                            ],
                            "script_fields": {},
                            "stored_fields": [
                                "*"
                            ],
                            "runtime_mappings": {
                                "clickhere_url_link": {
                                    "type": "keyword",
                                    "script": {
                                        "source": "if (!doc['url.keyword'].empty) {\n  emit(doc['url.keyword'].value);\n}"
                                    }
                                }
                            },
                            "_source": {
                                "excludes": []
                            },
                            "query": {
                                "bool": {
                                    "must": [],
                                    "filter": filtereddata
                                }
                            }
                        }
                    ),
                });
                const data = await response.json();
                const buckets = data?.aggregations[2].buckets || [];
                const formattedData = buckets.map(bucket => ({
                    text: bucket.key,
                    value: bucket[1].value
                }));
                const cloudtext = formattedData.filter(item =>item.text !== "no value");
                setclouddata(cloudtext);
                console.log("formatted data", formattedData)
            }

            catch (error) {
                console.log("error", error);
            }
        }

        worddata()

    }, [filters])

    return (
        <>
            <div><h1 className='h-[20px] text-md font-bold text-gray-500  '>Top Trends</h1></div>
            <div className='max-w-full mx-auto rounded-md mt-8 p-4 shadow-inner '>
                <WordCloud words={clouddata} />
            </div>
        </>
    )
}

export default Worddata;