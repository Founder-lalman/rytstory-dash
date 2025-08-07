import React, { useEffect, useState } from 'react'
import img from '../assets/satyam.jpg'
import { FaSortAmountUpAlt } from "react-icons/fa";

import Worddata from './Worddata';

const body = {
    "aggs": {
        "0": {
            "terms": {
                "field": "url.keyword",
                "order": {
                    "_key": "asc"
                },
                "size": 3000
            },
            "aggs": {
                "1": {
                    "terms": {
                        "field": "headline.keyword",
                        "order": {
                            "1-orderAgg": "desc"
                        },
                        "size": 1000
                    },
                    "aggs": {
                        "2": {
                            "cardinality": {
                                "field": "email.keyword"
                            }
                        },
                        "1-orderAgg": {
                            "cardinality": {
                                "field": "email.keyword"
                            }
                        }
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
            "filter": [
                {
                    "range": {
                        "dateCrawled": {
                            "gte": "now/d",
                            "lte": "now"
                        }
                    }
                }
            ],
            "should": [],
            "must_not": []
        }
    }
}

// const body= 
// {
//   "aggs": {
//     "0": {
//       "terms": {
//         "field": "url.keyword",
//         "order": {
//           "_key": "asc"
//         },
//         "size": 3000
//       },
//       "aggs": {
//         "1": {
//           "terms": {
//             "field": "headline.keyword",
//             "order": {
//               "1-orderAgg": "desc"
//             },
//             "size": 1000
//           },
//           "aggs": {
//             "2": {
//               "cardinality": {
//                 "field": "email.keyword"
//               }
//             },
//             "1-orderAgg": {
//               "cardinality": {
//                 "field": "email.keyword"
//               }
//             }
//           }
//         }
//       }
//     }
//   },
//   "size": 0,
//   "fields": [
//     {
//       "field": "dateCrawled",
//       "format": "date_time"
//     }
//   ],
//   "script_fields": {},
//   "stored_fields": [
//     "*"
//   ],
//   "runtime_mappings": {
//     "clickhere_url_link": {
//       "type": "keyword",
//       "script": {
//         "source":"if (!doc['url.keyword'].empty) {\n  emit(doc['url.keyword'].value);\n}"
//       }
//     }
//   },
//   "_source": {
//     "excludes": []
//   },
//   "query": {
//     "bool": {
//       "must": [],
//       "filter": [
//         {
//           "range": {
//            "dateCrawled": {
//                 "gte": "now/d",
//                 "lte": "now"
//             }
//           }
//         }
//       ],
//       "should": [], 
//       "must_not": []
//     }
//   }
// } 



const Topheadlines = () => {
    const [Headlines, setHeadlines] = useState([])

    useEffect(() => {
        const fetchheadline = async () => {
            try {
                const response = await fetch('https://43.205.65.179:8000/elastic_data/discover_feed_data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic bmltYTppbWFnZQ=='
                    },
                    body: JSON.stringify(body)
                })
                const data = await response.json()
                const aggBuckets = data?.aggregations?.["0"]?.buckets || [];
                console.log("aggBuckets", aggBuckets)
                const parsedHeadlines = aggBuckets.map(urlBucket => {
                    const headlineBucket = urlBucket["1"]?.buckets?.[0];
                    return {
                        url: urlBucket.key,
                        headline: headlineBucket?.key || "Untitled",
                        score: headlineBucket?.["1-orderAgg"]?.value || 0,
                        docCount: urlBucket.doc_count,


                    };
                });
                console.log("parseheadline", parsedHeadlines)
                setHeadlines(parsedHeadlines);


            }
            catch (error) {
                console.log('error', error)
            }
        };
        fetchheadline();

    }, [])
    return (
        <>
            <div className='max-w-full mx-auto'>

                <div className='max-w-full px-25 grid grid-cols-[55%_auto] mt-8 gap-6 '>
                    <div>
                        <div className='max-w-full h-[20px] flex justify-between  items-center'>
                            <h1 className='text-md font-bold text-gray-500 '>Top Headlines</h1>
                            <div className='flex gap-0.5  items-center'>
                                <h1 className='text-md font-bold text-gray-500'>Popularity</h1>
                                <FaSortAmountUpAlt className="text-[#7E3AF2] w-5 h-5" />
                            </div>
                        </div>
                        <div className='h-[600px] scrollbar scrollbar-thumb-[#7E3AF2] scrollbar-sky-300  overflow-y-scroll'>
                            {Headlines.map((item, index) => (

                                <div key={index} className=' max-w-full h-[120px] p-5 mt-8 rounded-[8px] flex justify-between bg-[#FFFFFF] shadow-inner shadow-gray-200'>
                                    <div className='w-[454px]  h-[80px] grid grid-cols-[15%_auto] items-center gap-8'>
                                        <div><img src={img} alt="not found" className='w-20 h-20 rounded-xl' /></div>
                                        <div>
                                            <h1 className='text-md text-gray-500'>Entertainment Desk</h1>
                                            <a className='text-md font-semibold  break-words line-clamp-2' href={item.url}>{item.headline}</a>
                                            <p className='text-md text-gray-500'>{item.docCount}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-2xl font-bold text-[#7E3AF2]'>{item.score}</h1>
                                    </div>
                                </div>
                            ))}
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

