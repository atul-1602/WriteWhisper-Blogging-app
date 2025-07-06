import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const NewBlog = () => {
  const navigate=useNavigate()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [blog, setBlog] = useState("");
  const [keywords, setKeywords]=useState("");
  const [about, setAbout]=useState("");
  const [question, setQuestion]=useState("");
 
 

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can handle the form submission here
    axios.post("http://127.0.0.1:3001/blogs", {name ,about, email, keywords, question,blog,})
    .then((result)=>{
      console.log(result);
      navigate('/')
    })
    .catch((err)=>console.log(err))
    
    
  };
  return (
  <>
    <div className="w-4/6 mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="name"
            name="name"
            // value={formData.name}
            onChange={(e)=>{setName(e.target.value)}}
            placeholder="Your Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            About YourSelf
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="about"
            name="about"
            // value={formData.name}
            onChange={(e)=>{setAbout(e.target.value)}}
            placeholder="Tell us who r u"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            id="email"
            name="email"
            // value={formData.email}
            onChange={(e)=>{setEmail(e.target.value)}}
            placeholder="Email Address"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Keywords
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="keywords"
            name="keywords"
            // value={formData.email}
            onChange={(e)=>{setKeywords(e.target.value)}}
            placeholder="eg: news, cricket, education, space"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Question
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="question"
            name="question"
            // value={formData.email}
            onChange={(e)=>{setQuestion(e.target.value)}}
            placeholder="write ur question"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="blogText">
            Write Your Blog/Opinion
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="blogText"
            name="blogText"
            // value={formData.blogText}
            onChange={(e)=>{setBlog(e.target.value)}}
            placeholder="Write your blog here"
            rows="5"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </>
  )
}

export default NewBlog
