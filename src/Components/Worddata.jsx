import React, { useState, useEffect } from 'react';
import WordCloud from './WordCloud';
import { usefilter } from '../context/Filtercontext';

const Worddata = () => {
  const { filters } = usefilter();
  const [clouddata, setclouddata] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const filterQuery = [];

        if (filters.publishers.length > 0) {
          filterQuery.push({
            terms: { 'url_publishername.keyword': filters.publishers.map((p) => p.value) },
          });
        }
        if (filters.categories.length > 0) {
          filterQuery.push({
            terms: { 'category.keyword': filters.categories.map((c) => c.value) },
          });
        }
        if (filters.formats.length > 0) {
          filterQuery.push({
            terms: { 'mainEntityOfPage.keyword': filters.formats.map((f) => f.value) },
          });
        }
        if (filters.countries.length > 0) {
          filterQuery.push({
            terms: { 'location.keyword': filters.countries.map((co) => co.value) },
          });
        }
        if (filters.Date.length > 0) {
          filterQuery.push({
            range: { dateCrawled: filters.Date.map((d) => d.value) },
          });
        } else {
          filterQuery.push({
            range: { dateCrawled: { gte: 'now-7d/d', lte: 'now' } },
          });
        }
        if (filters.search.length > 3) {
          filterQuery.push({
            multi_match: { type: 'best_fields', query: filters.search, lenient: true },
          });
        }

        const response = await fetch('https://www.rytstory.com/api/data/discover-feed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic bmltYTppbWFnZQ==',
          },
          body: JSON.stringify({
            aggs: {
              2: {
                terms: { field: 'wiki_ents.keyword', size: 80, order: { 1: 'desc' } },
                aggs: { 1: { cardinality: { field: 'email.keyword' } } },
              },
            },
            size: 0,
            query: { bool: { filter: filterQuery } },
          }),
        });

        const data = await response.json();
        const buckets = data?.aggregations[2].buckets || [];
        const formattedData = buckets.map((bucket) => ({ text: bucket.key, value: bucket[1].value }));
        setclouddata(formattedData.filter((item) => item.text !== 'no value'));
      } catch (error) {
        console.error('WordCloud fetch error:', error);
      }
    };

    fetchWords();
  }, [filters]);

  return (
    <>
      <h1 className="h-[20px] text-md font-bold text-gray-500">Top Trends</h1>
      <div className="max-w-full mx-auto rounded-md mt-8 p-4 shadow-inner">
        <WordCloud words={clouddata} />
      </div>
    </>
  );
};

export default Worddata;
