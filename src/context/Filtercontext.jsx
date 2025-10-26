import React from 'react';
import { createContext, useState, useContext } from 'react';

const Filtercontext = createContext();
const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    publishers: [],
    categories: [],
    formats: [],
    countries: [],
    // Default to "Last 1 day" so the UI shows the day filter on first load
    Date: [{ value: { gte: 'now-1d/d', lte: 'now' }, label: 'Last 1 day' }],
    // keep search as a string (Filter component expects a string)
    search: '',
    Words: [],
  });
  return (
    <>
      <Filtercontext.Provider value={{ filters, setFilters }}>{children}</Filtercontext.Provider>
    </>
  );
};
export default FilterProvider;

export const usefilter = () => useContext(Filtercontext);
