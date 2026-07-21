import React,{ useState,useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
function Login() {
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            toast.success("Login successful!");
            navigate('/');
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            console.log("Login failed:", message);
        }
    };
  return (
    <div className="h-screen bg-white">
    <div className="flex flex-col justify-between h-full">
        <div className="pt-8 pl-8">
            <h1 className="text-4xl font-bold">
                UBER
            </h1>
        </div>
        <div className="px-8">
            <h2 className="text-3xl font-semibold mb-6">
                Welcome Back
                 </h2> 
            <form onSubmit={handleSubmit}>
                <label className="font-medium">
                    Email
                </label>
                <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-4 py-3 mt-2"
                />
             <div className="mt-4">
    <label className="font-medium">
        Password
    </label>

    <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-gray-100 rounded-lg px-4 py-3 mt-2"
    />
</div>  
<button
    type="submit"
    className="w-full bg-black text-white rounded-lg py-3 mt-6 hover:bg-gray-900 transition"
>
    Login
</button> 
            </form>
            

        </div>
    </div>  
    </div>
  )
}

export default Login
