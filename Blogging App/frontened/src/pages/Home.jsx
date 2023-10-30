// import React from 'react'
import { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:3001/getAllData", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, []);
  return (
    <div className="bg-slate-400  text-white p-5 flex items-center flex-col justify-center shadow-slate-200">
      {data.map((i) => {
        return (
          <>
            <div className=" text-black bg-slate-300 rounded-lg  m-3 p-3 w-90 pb-px  border-black shadow-2xl  shadow-black-600 lg:w-3/5">
              <div className="flex flex-row  shadow-slate-200 items-start  p-2">
                <div className="rounded-full  h-12 w-12 my-2">
                  <img
                    className="w-10 h-10  rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                    src="https://img.freepik.com/premium-vector/man-character_665280-46970.jpg?w=740"
                    alt="Bordered avatar"
                  />
                </div>
                <div className="mx-3 text-lg font-bold ">
                  <div key={i}>{i.name}</div>
                  <div key={i} className="font-medium text-sm text-blue-700">
                    {i.about}
                  </div>
                </div>
              </div>
              <hr />
              {/* <div key={i}>{i.email}</div> */}
           
              <div key={i} className="my-2">
                Topic Keywords:
                {i.keywords.split(",").map((word, index) => (
                  <button
                    key={index}
                    type="button"
                    className=" text-white bg-pink-700   font-small rounded-lg text-sm px-3 py-1 my-2 mx-2 "
                  >
                    {word}
                  </button>
                ))}
              </div>

              <div className="bottom mx-2 my-2">
                <div key={i} className="font-extrabold text-lg my-2">
                  {i.question}
                </div>
                <div key={i} className="text-slate-900 overflow-y-scroll h-60">{i.blog}</div>
              </div>
              {/* <div key={i} className="m-2">{i.blogdate.toString()}</div> */}

              <hr className="text-black-700" />
              <div className="flex flex-row">
                <button
                  type="button"
                  className="m-2 bg-slate-200 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
                  </svg>
                  <span className="sr-only">Icon description</span>
                </button>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default Home;
