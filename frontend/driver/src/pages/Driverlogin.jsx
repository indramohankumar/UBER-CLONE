import React from 'react'
import DriverAuthContext from '../context/DriverAuthContext'
import {useState,useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
function DriverLogin() {
    const{setDriver}=useContext(DriverAuthContext);
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
        const [errorMsg, setErrorMsg] = useState('');
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await api.post('/drivers/login',{
                email,
                password
            });
            localStorage.setItem('token',response.data.token);
            setDriver(response.data.driver);
            toast.success("Login successful!");
            navigate('/driverhome');
        }
        catch(error){
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            console.log("Login failed:", message);
        }
    }
  return (
    <div className="h-screen bg-white flex flex-col p-8">
        <div>
            <h1 className="text-4xl font-bold mb-10">UBER</h1>
        </div>
       
        <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-6">Welcome Back, Driver</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="font-medium text-lg mb-2 block">Email</label>
                    <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="w-full bg-gray-100 rounded-lg px-4 py-3 border border-transparent focus:border-black focus:outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label className="font-medium text-lg mb-2 block">Password</label>
                    <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="w-full bg-gray-100 rounded-lg px-4 py-3 border border-transparent focus:border-black focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold rounded-lg px-4 py-3 mt-2 hover:bg-gray-800 transition"
                >
                    LOGIN
                </button>
            </form>
        </div>
    </div>
  )
}

export default DriverLogin
