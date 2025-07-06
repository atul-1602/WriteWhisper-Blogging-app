import { useState } from "react";
import axios from "axios";
import { useNavigate  } from "react-router-dom";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can handle the form submission here
    axios.post("http://127.0.0.1:3001/signup", {name , email,password})
    .then((result)=>{
      console.log(result);
      navigate("/login")
    })
    .catch((err)=>console.log(err))
   
  };
  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-600"
                
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border p-2 rounded-md"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600"
               
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border p-2 rounded-md"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-600"
                
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border p-2 rounded-md"
                autoComplete="ON"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md w-full hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            <p>Already have an account?</p>
            <a href="#" className="text-blue-500 hover:underline">
              Log in
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
