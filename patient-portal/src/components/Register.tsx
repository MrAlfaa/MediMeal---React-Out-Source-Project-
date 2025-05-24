import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    wardNumber: '',
    bedNumber: '',
    patientId: '',
    contactNumber: '',
    dietaryRestrictions: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    wardNumber: '',
    bedNumber: '',
    patientId: '',
    contactNumber: '',
    dietaryRestrictions: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, error } = useContext(AuthContext);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user types
    setFormErrors({
      ...formErrors,
      [e.target.name]: ''
    });
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    // Validate ward number
    if (!formData.wardNumber) {
      newErrors.wardNumber = 'Ward number is required';
      valid = false;
    }
    
    // Validate bed number
    if (!formData.bedNumber) {
      newErrors.bedNumber = 'Bed number is required';
      valid = false;
    }
    
    // Validate patient ID
    if (!formData.patientId) {
      newErrors.patientId = 'Patient ID is required';
      valid = false;
    }
    
    // Validate contact number
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Convert dietary restrictions to array
        const dietaryRestrictionsArray = formData.dietaryRestrictions
          ? formData.dietaryRestrictions.split(',').map(item => item.trim())
          : [];
        
        // Remove confirmPassword from data sent to server
        const { confirmPassword, ...registrationData } = formData;
        
        const response = await register({
          ...registrationData,
          dietaryRestrictions: dietaryRestrictionsArray
        });
        
        // Show success message
        setSuccessMessage('Registration successful! Redirecting to login...');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err) {
        console.error('Registration error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="lg:flex">
          <div className="hidden lg:block lg:w-1/3 bg-indigo-600 p-8 xl:p-10 text-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl xl:text-2xl font-bold mb-4 xl:mb-6">MediMeal Connect</h2>
                <p className="text-sm xl:text-base mb-6 xl:mb-8">Join our hospital food ordering system for a convenient and personalized meal experience during your stay.</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Already have an account?</p>
                <Link to="/login" className="block mt-2 text-white font-semibold hover:underline">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 p-6 sm:p-8">
            <div className="lg:hidden text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">MediMeal Connect</h2>
              <p className="mt-2 text-sm text-gray-600">Create your patient account</p>
            </div>
            
            {successMessage && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-md" role="alert">
                <p className="font-medium text-sm">Success</p>
                <p className="text-sm">{successMessage}</p>
              </div>
            )}
            
            {error && !successMessage && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-md" role="alert">
                <p className="font-medium text-sm">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-1">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    className={`appearance-none relative block w-full px-3 py-2.5 sm:py-2 border ${formErrors.fullName ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base`}
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                </div>
                
                <div className="sm:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none relative block w-full px-3 py-2.5 sm:py-2 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base`}
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border ${formErrors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <input
                    id="patientId"
                    name="patientId"
                    type="text"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border ${formErrors.patientId ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Patient ID"
                    value={formData.patientId}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.patientId && <p className="text-red-500 text-xs mt-1">{formErrors.patientId}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:col-span-2">
                  <div>
                    <label htmlFor="wardNumber" className="block text-sm font-medium text-gray-700 mb-1">Ward Number</label>
                    <input
                      id="wardNumber"
                      name="wardNumber"
                      type="text"
                      required
                      className={`appearance-none relative block w-full px-3 py-2.5 sm:py-2 border ${formErrors.wardNumber ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base`}
                      placeholder="Ward Number"
                      value={formData.wardNumber}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {formErrors.wardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.wardNumber}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="bedNumber" className="block text-sm font-medium text-gray-700 mb-1">Bed Number</label>
                    <input
                      id="bedNumber"
                      name="bedNumber"
                      type="text"
                      required
                      className={`appearance-none relative block w-full px-3 py-2.5 sm:py-2 border ${formErrors.bedNumber ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base`}
                      placeholder="Bed Number"
                      value={formData.bedNumber}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {formErrors.bedNumber && <p className="text-red-500 text-xs mt-1">{formErrors.bedNumber}</p>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border ${formErrors.contactNumber ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.contactNumber && <p className="text-red-500 text-xs mt-1">{formErrors.contactNumber}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions (comma separated)</label>
                  <textarea
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    className={`appearance-none relative block w-full px-3 py-2 border ${formErrors.dietaryRestrictions ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="e.g., Gluten-free, Dairy-free, Vegetarian"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    rows={3}
                    disabled={isSubmitting}
                  />
                  {formErrors.dietaryRestrictions && <p className="text-red-500 text-xs mt-1">{formErrors.dietaryRestrictions}</p>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : "Register"}
                </button>
              </div>
              
              <div className="text-sm text-center lg:hidden">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>© 2023 MediMeal Connect. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Register;
