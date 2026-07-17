import React from 'react'
import { useState, useContext } from 'react';
import DriverAuthContext from '../context/DriverAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function DriverRegister() {
  const { setDriver } = useContext(DriverAuthContext);
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await api.post('/drivers/register', {
        fullname: {
          firstname,
          lastname
        },
        email,
        password,
        vehicle: {
          model: vehicleModel,
          color: vehicleColor,
          plateNumber: plateNumber,
          capacity: Number(capacity)
        }
      });
      localStorage.setItem('token', response.data.token);
      setDriver(response.data.driver);
      navigate('/driverhome');
    }
    catch (error) {
      const message = error.response?.data?.message || "Registration failed. Try again.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">

      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight">UBER</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create driver account</h2>
        <p className="text-gray-500 text-sm mt-1">Start earning with Uber</p>
      </div>
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Full name</label>
          <div className="flex gap-3">
            <input
              type="text"
              required
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-1/2 bg-gray-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-1/2 bg-gray-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
          <input
            type="email"
            required
            placeholder="driver@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
          <input
            type="password"
            required
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium">VEHICLE INFO</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Vehicle model</label>
          <input
            type="text"
            required
            placeholder="e.g. Toyota Innova, Honda City"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

      
        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="text-sm font-semibold text-gray-700 block mb-1">Color</label>
            <input
              type="text"
              required
              placeholder="e.g. Black"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm font-semibold text-gray-700 block mb-1">Plate number</label>
            <input
              type="text"
              required
              placeholder="e.g. MH 12 AB 1234"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

      
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Seating capacity</label>
          <select
            required
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select capacity</option>
            <option value="2">2 seats (Motorcycle)</option>
            <option value="3">3 seats (Auto)</option>
            <option value="4">4 seats (Car)</option>
            <option value="6">6 seats (SUV)</option>
          </select>
        </div>

        
        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-3 rounded-lg mt-2 hover:bg-gray-900 transition active:scale-95"
        >
          Create Account
        </button>

      </form>

      
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/driverlogin" className="font-semibold text-black underline">
          Sign in
        </Link>
      </p>

    </div>
  )
}

export default DriverRegister
