import React, { useEffect, useState } from 'react'
import img from '../assets/satyam.jpg'
import { FaSortAmountUpAlt } from "react-icons/fa";
import { usefilter } from '../context/Filtercontext';

import Worddata from './Worddata';

const Topheadlines = () => {
    const { filters } = usefilter();
    const [Headlines, setHeadlines] = useState([])
    const [order, setOrder] = useState('desc')

    useEffect(() => {
        const fetchheadline = async () => {
            try {
                const filterConditions = [];
                if (filters.publishers.length > 0) {
                    filterConditions.push({
                        terms: {
                            "url_publishername.keyword": filters.publishers.map(p => p.value)
                        }
                    });
                }

                if (filters.categories.length > 0) {
                    filterConditions.push({
                        terms: {
                            "category.keyword": filters.categories.map(c => c.value)
                        }
                    });
                }

                if (filters.formats.length > 0) {
                    filterConditions.push({
                        terms: {
                            "mainEntityOfPage.keyword": filters.formats.map(f => f.value)
                        }
                    });
                }

                if (filters.countries.length > 0) {
                    filterConditions.push({
                        terms: {
                            "location.keyword": filters.countries.map(co => co.value)
                        }
                    });
                }
                if (filters.Words.length > 0) {
                    filterConditions.push({
                        terms: {
                            "wiki_ents.keyword": filters.Words.map(ma => ma.value)
                        }
                    })
                }
                filterConditions.push({
                    range: { dateCrawled: { gte: "now-7d/d", lte: "now/d" } }
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
                                "0": {
                                    "terms": {
                                        "field": "headline.keyword",
                                        "order": {
                                            "0-orderAgg": order
                                        },
                                        "size": 1000
                                    },
                                    "aggs": {
                                        "1": {
                                            "terms": {
                                                "field": "url.keyword",
                                                "order": {
                                                    "_key": order
                                                },
                                                "size": 3,
                                                "shard_size": 25
                                            },
                                            "aggs": {
                                                "2": {
                                                    "terms": {
                                                        "field": "author_name.keyword",
                                                        "order": {
                                                            "_key": order
                                                        },
                                                        "size": 3,
                                                        "shard_size": 25
                                                    },
                                                    "aggs": {
                                                        "3": {
                                                            "date_histogram": {
                                                                "field": "dateCrawled",
                                                                "calendar_interval": "1d",
                                                                "time_zone": "Asia/Calcutta",
                                                                "min_doc_count": 1,
                                                                "extended_bounds": {
                                                                    "min": "now-7d/d",
                                                                    "max": "now/d"
                                                                }
                                                            }
                                                            ,
                                                            "aggs": {
                                                                "4": {
                                                                    "cardinality": {
                                                                        "field": "email.keyword"
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        "0-orderAgg": {
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
                                    "filter": filterConditions,
                                    "should": [],
                                    "must_not": [
                                        {
                                            "match_phrase": {
                                                "wiki_ents.keyword": "no value"
                                            }
                                        },
                                        {
                                            "bool": {
                                                "should": [
                                                    {
                                                        "match_phrase": {
                                                            "Entity_type.keyword": "Location"
                                                        }
                                                    }
                                                ],
                                                "minimum_should_match": 1
                                            }
                                        }
                                    ]
                                }
                            }
                        }

                    )
                })
                const data = await response.json();
                const headlineBuckets = data?.aggregations?.["0"]?.buckets || [];

                const parsedHeadlines = headlineBuckets.map(headBucket => {
                    const urlBucket = headBucket["1"]?.buckets?.[0] || {};
                    const authorBucket = urlBucket["2"]?.buckets?.[0] || {};
                    const dateBucket = authorBucket["3"]?.buckets?.[0] || {};

                    return {
                        headline: headBucket.key, // headline.keyword
                        url: urlBucket.key || "Untitled", // url.keyword
                        author: authorBucket.key || "Unknown", // author_name.keyword
                        dateCrawled: dateBucket.key_as_string || null, // formatted timestamp
                        docCount: headBucket.doc_count ?? 0, // number of documents per headline
                        score: headBucket["0-orderAgg"]?.value ?? 0 // cardinality score
                    };
                });

                setHeadlines(parsedHeadlines);


            }
            catch (error) {
                console.log('error', error)
            }
        };

        fetchheadline();

    }, [filters, order])


    const renderCard = (item, isLoading, key) => (
        <div
            key={key}
            className="p-5 mt-8 rounded-lg bg-white shadow-inner shadow-gray-200 flex items-start gap-4"
        >
            <div className="relative overflow-hidden rounded-xl" style={{ width: 80, height: 80 }}>
                <div className="absolute inset-0 bg-slate-200">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] animate-shimmer" />
                </div>
            </div>
            <div className="flex-1 space-y-2">
                <>
                    <div className="relative overflow-hidden h-4 w-1/3 bg-slate-200 rounded">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] animate-shimmer" />
                    </div>
                    <div className="relative overflow-hidden h-5 w-full bg-slate-200 rounded">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] animate-shimmer" />
                    </div>
                    <div className="relative overflow-hidden h-3 w-2/3 bg-slate-200 rounded">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] animate-shimmer" />
                    </div>
                </>
            </div>
        </div>
    );

    return (
        <>
            <div className='max-w-full mx-auto'>

                <div className='max-w-full px-25 grid grid-cols-[55%_auto] mt-8 gap-6 '>
                    <div>
                        <div className='max-w-full h-[20px] flex justify-between  items-center'>
                            <h1 className='text-md font-bold text-gray-500 '>Top Headlines</h1>
                            <div className='flex gap-0.5  items-center'>
                                <h1 className='text-md font-bold text-gray-500'>Popularity</h1>
                                <h1
                                    onClick={() => setOrder(order === "desc" ? "asc" : "desc")}
                                    className={`transition-transform duration-100 cursor-pointer 
                                    ${order === "desc" ? "rotate-0" : "rotate-180"}`}
                                ><FaSortAmountUpAlt className="text-[#7E3AF2] w-5 h-5 " /></h1>
                            </div>
                        </div>
                        <div className='h-[600px] scrollbar scrollbar-thumb-[#7E3AF2] scrollbar-sky-300  overflow-y-scroll'>
                            {Headlines.length > 0 ? (
                                Headlines.map((item, index) => (

                                    <div key={index} className=' max-w-full h-[120px] p-5 mt-8 rounded-[8px] flex justify-between bg-[#FFFFFF] shadow-inner shadow-gray-200'>
                                        <div className='w-[454px]  h-[80px] grid grid-cols-[15%_auto] items-center gap-8'>
                                            <div><img src={img} alt="not found" className='w-20 h-20 rounded-xl' /></div>
                                            <div>
                                                <h1 className='text-md text-gray-500'>{item.author}</h1>
                                                <a className='text-md font-semibold  break-words line-clamp-2' href={item.url} target="_blank"
                                                >{item.headline}</a>
                                                <p className='text-md text-gray-500'>{item.dateCrawled}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h1 className='text-2xl font-bold text-[#7E3AF2]'>{item.docCount}</h1>
                                        </div>
                                    </div>
                                ))
                            ) :
                                (Array.from({ length: 50 }).map((_, i) => renderCard({}, true, i)))
                            }
                        </div>
                    </div>
                    <div className='max-w-full  '>
                        <Worddata />
                    </div>
                </div>

            </div>


        </>
    )
}

export default Topheadlines;

