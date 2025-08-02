import React from 'react'
import img from '../assets/satyam.jpg'
import img5 from '../assets/image5.png'
import { FaSortAmountUpAlt } from "react-icons/fa";
import img6 from '../assets/image6.png'
import WordCloud from './WordCloud';

const wordData = [
    { text: 'Donald Trump', value: 50 },
    { text: 'Supreme Court of India', value: 40 },
    { text: 'Narendra Modi', value: 35 },
    { text: 'Apple Inc.', value: 30 },
    { text: 'Amazon Web Services', value: 27 },
    { text: 'Google', value: 26 },
    { text: 'Microsoft', value: 25 },
    { text: 'Infosys', value: 24 },
    { text: 'NASA', value: 23 },
    { text: 'Flipkart', value: 22 },
    { text: 'Tata Consultancy Services', value: 21 },
    { text: 'Reliance Industries', value: 20 },
    { text: 'Air India', value: 18 },
    { text: 'OpenAI', value: 17 },
    { text: 'Salil Parekh', value: 16 },
    { text: 'Amazon (company)', value: 15 },
    { text: 'National Stock Exchange of India', value: 14 },
    { text: 'Samsung', value: 13 },
    { text: 'Ajay Devgn', value: 12 },
    { text: 'Aamir Khan', value: 11 },
    // Add more to reach 25+
];


const Topheadlines = () => {
    return (
        <>
            <div className='max-w-full mx-auto'>
                <div className='w-[1440px] px-25 flex flex-col-2 mt-8 gap-8  justify-between '>
                    <div className=''>
                        <div className='w-[708px] h-[20px] flex justify-between  items-center'>
                            <h1 className='text-sm font-bold text-gray-500 '>Top Headlines</h1>
                            <div className='flex gap-0.5  items-center'>
                                <h1 className='text-sm font-bold text-gray-500'>Popularity</h1>
                                <FaSortAmountUpAlt className="text-[#7E3AF2] w-5 h-5" />
                            </div>
                        </div>
                        <div className='w-[708px] h-[120px] p-5 mt-8 rounded-[8px] flex justify-between bg-[#FFFFFF] shadow-inner shadow-gray-200 '>
                            <div className='w-[454px]  h-[80px] flex items-center gap-8'>
                                <div><img src={img} alt="not found" className='w-20 h-20 rounded-xl' /></div>
                                <div>
                                    <h1 className='text-md text-gray-500'>Entertainment Desk</h1>
                                    <a className='text-xl font-semibold ' href='#####'>Sanjay Dutt men 62/ year old</a>
                                    <p className='text-md text-gray-500'>11:02 am | 1 hour ago</p>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-[#7E3AF2]'>2.4</h1>
                            </div>
                        </div>
                        <div className='w-[708px] h-[120px] p-5 mt-4 rounded-[8px] flex justify-between bg-[#FFFFFF] shadow-inner shadow-gray-200 '>
                            <div className='w-[454px]  h-[80px] flex items-center gap-8'>
                                <div><img src={img5} alt="not found" className='w-20 h-20 rounded-xl' /></div>
                                <div>
                                    <h1 className='text-md text-gray-500'>Entertainment Desk</h1>
                                    <a className='text-xl font-semibold ' href='#####'>Sanjay Dutt men 62/ year old</a>
                                    <p className='text-md text-gray-500'>11:02 am | 1 hour ago</p>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-[#7E3AF2]'>4.4</h1>
                            </div>
                        </div>
                        <div className='w-[708px] h-[120px] p-5 mt-4 rounded-[8px] flex justify-between bg-[#FFFFFF] shadow-inner shadow-gray-200 '>
                            <div className='w-[454px]  h-[80px] flex items-center gap-8'>
                                <div><img src={img5} alt="not found" className='w-20 h-20 rounded-xl' /></div>
                                <div>
                                    <h1 className='text-md text-gray-500'>Entertainment Desk</h1>
                                    <a className='text-xl font-semibold ' href='#####'>Sanjay Dutt men 62/ year old</a>
                                    <p className='text-md text-gray-500'>11:02 am | 1 hour ago</p>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-[#7E3AF2]'>4.4</h1>
                            </div>
                        </div>
                        <div className='w-[708px] h-[120px] p-5 mt-4 rounded-[8px] flex justify-between bg-[#FFFFFF] shadow-inner shadow-gray-200 '>
                            <div className='w-[454px]  h-[80px] flex items-center gap-8'>
                                <div><img src={img5} alt="not found" className='w-20 h-20 rounded-xl' /></div>
                                <div className='p-5'>
                                    <h1 className='text-md text-gray-500'>Hilighited Desk</h1>
                                    <a className='text-xl font-semibold ' href='#####'>Sanjay Dutt men 62/ year old</a>
                                    <p className='text-md text-gray-500'>11:02 am | 1 hour ago</p>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-[#7E3AF2]'>4.4</h1>
                            </div>
                        </div>
                        <div className='w-[708px] h-[120px] p-5 mt-4 rounded-[8px] flex justify-between bg-[#FFFFFF] shadow-inner shadow-gray-200 '>
                            <div className='w-[454px]  h-[80px] flex items-center gap-8'>
                                <div><img src={img6} alt="not found" className='w-20 h-20 rounded-xl' /></div>
                                <div>
                                    <h1 className='text-md text-gray-500'>Weather Desk</h1>
                                    <a className='text-xl font-semibold ' href='#####'>Globel climate summit reach historic</a>
                                    <p className='text-md text-gray-500'>11:02 am | 1 hour ago</p>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-[#7E3AF2]'>4.4</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div><h1 className='h-[20px] text-gray-500 text-xl text-semibild  '>Top Trends</h1></div>
                        <div className='rounded-md mt-8  p-4 shadow-inner '>
                            <WordCloud words={wordData} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Topheadlines;

