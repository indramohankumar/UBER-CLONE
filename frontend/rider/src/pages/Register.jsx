import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const { setUser } = useContext(AuthContext);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/register', {
                fullname: {
                    firstname,
                    lastname
                },
                email,
                password,
                role: 'rider' 
            });
            
            
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            
            
            navigate('/login');
            
        } catch (error) {
            console.log("Registration failed:", error.response?.data || error.message);
        }
    };

  return (
    <div className="min-h-screen bg-white">
        <div className="flex flex-col justify-between h-full pb-8">
            <div className="pt-8 pl-8">
                <h1 className="text-4xl font-bold">UBER</h1>
            </div>
            
            <div className="px-8 mt-12">
                <h2 className="text-3xl font-semibold mb-6">Create Account</h2> 
                
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="font-medium text-sm">First Name</label>
                            <input
                                type="text"
                                placeholder="John"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="w-full bg-gray-100 rounded-lg px-4 py-3 mt-1"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="font-medium text-sm">Last Name</label>
                            <input
                                type="text"
                                placeholder="Doe"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                className="w-full bg-gray-100 rounded-lg px-4 py-3 mt-1"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="font-medium text-sm">Email</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg px-4 py-3 mt-1"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="font-medium text-sm">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg px-4 py-3 mt-1"
                            required
                        />
                    </div>  

                    <button
                        type="submit"
                        className="w-full bg-black text-white rounded-lg py-3 mt-8 hover:bg-gray-900 transition font-semibold"
                    >
                        Sign Up
                    </button> 
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>  
    </div>
  )
}

export default Register;
