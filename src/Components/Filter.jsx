import React from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";


const publishers = [
    { value: '1', label: 'Publisher 1' },
    { value: '2', label: 'Publisher 2' },
    { value: '3', label: 'Publisher 3' },
];

const Category = [
    { value: '1', label: 'category 1' },
    { value: '2', label: 'category 2' },
    { value: '3', label: 'category 3' },
];

const Format = [
    { value: '1', label: 'category 1' },
    { value: '2', label: 'category 2' },
    { value: '3', label: 'category 3' },
];

const Country = [
    { value: '1', label: 'countyr 1' },
    { value: '2', label: 'country 2' },
    { value: '3', label: 'country 3' },
];
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
    const [publisher, setPublisher] = React.useState([])
    const [category, setCategory] = React.useState([])
    const [format , setFormat] = React.useState([])
    const [country , setCountry] = React.useState([])
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    return (
        <>
            <div className="max-w-full mx-auto  ">
                <div className="max-w-full mx-auto flex flex-col-2 px-25 gap-10 justify-between items-center ">
                    <div className='flex gap-5'>
                        <div>
                            <Select
                                options={publishers}
                                isMulti
                                value={publisher}
                                onChange={setPublisher}
                                placeholder="Publisher"                           
                                styles={customStyles}
                            />
                        </div>
                        <div>
                             <Select
                                options={Category}
                                isMulti
                                value={category}
                                onChange={setCategory}
                                placeholder="Category"                           
                                styles={customStyles}
                            />
                        </div>
                        <div>
                            <Select
                                options={Format}
                                isMulti
                                value={format}
                                onChange={setFormat}
                                placeholder="Format"                           
                                styles={customStyles}
                            />
                        </div>
                        <div>
                            <Select
                                options={Country}
                                isMulti
                                value={country}
                                onChange={setCountry}
                                placeholder="Format"                           
                                styles={customStyles}
                            />
                        </div>
                    </div>
                    <div>
                    <div className="relative flex gap-2 items-center">
                        <FaCalendarAlt className="absolute left-3 text-[#7E3AF2] text-xl" />
                       <DatePicker
                        selected={selectedDate}
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
                    <MdOutlineSearch  className="absolute  left-26 top-1  text-[#7E3AF2] text-2xl" />
                     <input
                        type='search'
                        placeholder='Search'
                        className='border-1 border-gray-500 rounded-sm px-4 pl-8 py-1 w-full outline-none  '
                    />
                </div>
            </div>
        </>
    )
}

export default Filter;