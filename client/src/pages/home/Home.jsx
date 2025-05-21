import React from 'react'

const Home = () => {
  return (
    <div>
        <div className='w-3/4 h-50 bg-stone-500 mx-auto mt-20 p-3' >
            <h1 className='text-white text-center text-xl font-bold '>API TESTER ONLINE</h1>
            <div className='flex justify-evenly gap-2'>
                <select name="method" id="method" className=' border-1 rounded font-bold focus:outline-none'>
                    <option className='text-red-600 font-bold' value="get">GET</option>
                    <option className='text-green-600 font-bold' value="post">POST</option>
                    <option className='text-yellow-500 font-bold' value="put">PUT</option>
                    <option className='text-blue-600 font-bold' value="delete">DELETE</option>
                    <option className='text-purple-600 font-bold' value="patch">PATCH</option>
                </select>
                <input type="text" name="url" id="url" className='border-1 rounded h-6 p-2 w-1/1 focus:outline-none' placeholder='Enter URL or paste text'/>
                <button className='bg-blue-500 px-8 rounded text-white font-bold border-1 border-black '>Send</button>
            </div>
            <div className='bg-slate-300 text-black w-1/1 h-30 rounded border-1 p-2 overflow-scroll'>
                Hello World, <br /> I am Muhammed Raishan K S. Currently doing internship at Synnefo Solutions. <br /> I am coming from Muppathadam belongs to Aluva. i've skills in MongoDB, NodeJs, ExpressJs, and React. 
            </div>
        </div>
    </div>
  )
}

export default Home
