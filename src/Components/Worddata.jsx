import React from 'react'
import { useState, useEffect } from 'react';
import WordCloud from './WordCloud';


const body =
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
            "filter": [
                {
                    "range": {
                        "dateCrawled": {
                            "format": "strict_date_optional_time",
                            "gte": "2025-07-14T19:35:25.739Z",
                            "lte": "2025-07-15T19:35:25.739Z"
                        }
                    }
                }
            ],
            "should": [],
            "must_not": []
        }
    }
}

const Worddata = () => {

    const [clouddata, setclouddata] = useState([]);

    useEffect(() => {

        const worddata = async () => {
            try {
                const response = await fetch('https://www.rytstory.com/api/data/discover-feed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic bmltYTppbWFnZQ=='
                    },
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                const buckets = data?.aggregations[2].buckets || [];
                const formattedData = buckets.map(bucket => ({
                    text: bucket.key,
                    value: bucket[1].value
                }));
                setclouddata(formattedData);
            }

            catch (error) {
                console.log("error", error);
            }
        }

        worddata()

    }, [])

    useEffect(() => {
        console.log("Updated clouddata:", clouddata);
    }, [clouddata]);


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