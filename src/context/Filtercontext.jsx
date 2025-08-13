import React from 'react'
import { createContext, useState, useContext } from 'react'

const Filtercontext = createContext();
const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        publishers: [],
        categories: [],
        formats: [],
        countries: [],
        Words : []
    });
    return (
        <>
            <Filtercontext.Provider value={{ filters, setFilters }}>
                {children}
            </Filtercontext.Provider>
        </>
    )
}

export default FilterProvider;

export const usefilter = ()=> useContext(Filtercontext);