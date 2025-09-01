import React, { useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../Components/Title";
import { useAppContext } from "../../Components/Context/AppContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AddCar = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "2025",
    pricePerDay: "200",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "5",
    location: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      toast.success("Image selected successfully!");
      
      // Clear image error
      setErrors(prev => ({ ...prev, image: null }));
    }
  };

  const handleFieldChange = (field, value) => {
    setCar(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, car[field]);
  };

  const validateField = (field, value) => {
    let error = null;
    
    switch (field) {
      case 'brand':
        if (!value.trim()) {
          error = 'Brand is required';
        } else if (value.trim().length < 2) {
          error = 'Brand must be at least 2 characters';
        }
        break;
      case 'model':
        if (!value.trim()) {
          error = 'Model is required';
        } else if (value.trim().length < 2) {
          error = 'Model must be at least 2 characters';
        }
        break;
      case 'year':
        if (!value) {
          error = 'Year is required';
        } else if (value < 1900 || value > 2030) {
          error = 'Year must be between 1900 and 2030';
        }
        break;
      case 'pricePerDay':
        if (!value) {
          error = 'Daily price is required';
        } else if (value < 1) {
          error = 'Daily price must be at least 1';
        }
        break;
      case 'category':
        if (!value) {
          error = 'Category is required';
        }
        break;
      case 'transmission':
        if (!value) {
          error = 'Transmission is required';
        }
        break;
      case 'fuel_type':
        if (!value) {
          error = 'Fuel type is required';
        }
        break;
      case 'seating_capacity':
        if (!value) {
          error = 'Seating capacity is required';
        } else if (value < 1 || value > 12) {
          error = 'Seating capacity must be between 1 and 12';
        }
        break;
      case 'location':
        if (!value) {
          error = 'Location is required';
        }
        break;
      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
        } else if (value.trim().length < 20) {
          error = 'Description must be at least 20 characters';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate image
    if (!image) {
      newErrors.image = 'Car image is required';
      isValid = false;
    }
    
    // Validate all fields
    Object.keys(car).forEach(field => {
      const error = validateField(field, car[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    // Direct reset without confirmation
    setCar({
      brand: "",
      model: "",
      year: "2025",
      pricePerDay: "200",
      category: "",
      transmission: "",
      fuel_type: "",
      seating_capacity: "5",
      location: "",
      description: ""
    });
    setImage(null);
    setImagePreview(null);
    setErrors({});
    setTouched({});
    
    // Reset file input
    const fileInput = document.getElementById('car-image');
    if (fileInput) {
      fileInput.value = '';
    }
    
    toast.success("Form reset successfully!");
  };

  const deleteForm = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete all form data? This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete form data
    setCar({
      brand: "",
      model: "",
          year: "2025",
          pricePerDay: "200",
      category: "",
      transmission: "",
      fuel_type: "",
          seating_capacity: "5",
      location: "",
      description: ""
    });
    setImage(null);
    setImagePreview(null);
        setErrors({});
        setTouched({});
        
        // Reset file input
        const fileInput = document.getElementById('car-image');
        if (fileInput) {
          fileInput.value = '';
        }
        
        Swal.fire(
          'Deleted!',
          'Your form data has been deleted.',
          'success'
        );
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    // Mark all fields as touched
    setTouched({
      brand: true,
      model: true,
      year: true,
      pricePerDay: true,
      category: true,
      transmission: true,
      fuel_type: true,
      seating_capacity: true,
      location: true,
      description: true,
      image: true
    });
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify(car));
      
      const { data } = await axios.post('/api/owner/add-car', formData);
      
      if (data.success) {
        toast.success(data.message || "Car added successfully!");
        resetForm();
      } else {
        toast.error(data.message || "Failed to add car");
      }
    } catch (error) {
      console.error('Add car error:', error);
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field) => {
    return touched[field] && errors[field];
  };

  const getFieldClassName = (field) => {
    const hasError = getFieldError(field);
    const isTouched = touched[field];
    const hasValue = car[field] && car[field].toString().trim();
    
    let borderClass = 'border-gray-300';
    let focusClass = 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    
    if (hasError) {
      borderClass = 'border-red-500';
      focusClass = 'focus:ring-2 focus:ring-red-500 focus:border-red-500';
    } else if (isTouched && hasValue) {
      borderClass = 'border-green-500';
      focusClass = 'focus:ring-2 focus:ring-green-500 focus:border-green-500';
    }
    
    return `w-full px-4 py-3 border rounded-lg ${focusClass} transition-all duration-200 bg-white ${borderClass}`;
  };

  return (
    <div className="px-4 py-8 md:px-8 flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Title
            title="Add New Car"
            subtitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
          />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Form Completion</span>
              <span className="text-sm font-semibold text-blue-600">
                {Math.round((Object.values(car).filter(value => value && value.toString().trim()).length + (image ? 1 : 0)) / 11 * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(Object.values(car).filter(value => value && value.toString().trim()).length + (image ? 1 : 0)) / 11 * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <form onSubmit={onSubmitHandler} className="p-6 md:p-8">
            
            {/* Image Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Car Image
              </label>
              <div className="relative">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  imagePreview 
                    ? 'border-green-400 bg-green-50' 
                    : getFieldError('image') 
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}>
                  <label htmlFor="car-image" className="cursor-pointer block">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Car preview"
                            className="w-56 h-36 object-cover rounded-lg mx-auto shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                              const fileInput = document.getElementById('car-image');
                              if (fileInput) fileInput.value = '';
                              setErrors(prev => ({ ...prev, image: null }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                          ✓ Image uploaded successfully
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
                          <img src={assets.upload_icon} alt="Upload" className="w-10 h-10 opacity-70" />
                        </div>
                        <div>
                          <p className="text-gray-700 font-semibold text-lg">Upload car image</p>
                          <p className="text-sm text-gray-500 mt-2">
                            PNG, JPG up to 10MB
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Click here to browse files
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    id="car-image"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </div>
                {getFieldError('image') && (
                  <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                )}
              </div>
            </div>

            {/* Car Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Brand */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Brand
                </label>
                <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. BMW, Mercedes, Audi"
                    className={getFieldClassName('brand')}
                  value={car.brand}
                    onChange={(e) => handleFieldChange('brand', e.target.value)}
                    onBlur={() => handleFieldBlur('brand')}
                  />
                  {touched.brand && car.brand && !errors.brand && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {getFieldError('brand') && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.brand}
                  </p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Model
                </label>
                <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. X5, E-Class, M4"
                    className={getFieldClassName('model')}
                  value={car.model}
                    onChange={(e) => handleFieldChange('model', e.target.value)}
                    onBlur={() => handleFieldBlur('model')}
                  />
                  {touched.model && car.model && !errors.model && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {getFieldError('model') && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.model}
                  </p>
                )}
              </div>
            </div>

            {/* Year, Price, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  placeholder="2025"
                  min="1900"
                  max="2030"
                  className={getFieldClassName('year')}
                  value={car.year}
                  onChange={(e) => handleFieldChange('year', e.target.value)}
                  onBlur={() => handleFieldBlur('year')}
                />
                {getFieldError('year') && (
                  <p className="text-red-500 text-sm">{errors.year}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Daily Price ({currency})
                </label>
                <input
                  type="number"
                  placeholder="200"
                  min="1"
                  className={getFieldClassName('pricePerDay')}
                  value={car.pricePerDay}
                  onChange={(e) => handleFieldChange('pricePerDay', e.target.value)}
                  onBlur={() => handleFieldBlur('pricePerDay')}
                />
                {getFieldError('pricePerDay') && (
                  <p className="text-red-500 text-sm">{errors.pricePerDay}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Category
                </label>
                <select
                  className={getFieldClassName('category')}
                  value={car.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  onBlur={() => handleFieldBlur('category')}
                >
                  <option value="">Select category</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Wagon">Wagon</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Van">Van</option>
                </select>
                {getFieldError('category') && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Transmission, Fuel, Seats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Transmission
                </label>
                <select
                  className={getFieldClassName('transmission')}
                  value={car.transmission}
                  onChange={(e) => handleFieldChange('transmission', e.target.value)}
                  onBlur={() => handleFieldBlur('transmission')}
                >
                  <option value="">Select transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
                {getFieldError('transmission') && (
                  <p className="text-red-500 text-sm">{errors.transmission}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Fuel Type
                </label>
                <select
                  className={getFieldClassName('fuel_type')}
                  value={car.fuel_type}
                  onChange={(e) => handleFieldChange('fuel_type', e.target.value)}
                  onBlur={() => handleFieldBlur('fuel_type')}
                >
                  <option value="">Select fuel type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                  <option value="CNG">CNG</option>
                  <option value="LPG">LPG</option>
                </select>
                {getFieldError('fuel_type') && (
                  <p className="text-red-500 text-sm">{errors.fuel_type}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  placeholder="5"
                  min="1"
                  max="12"
                  className={getFieldClassName('seating_capacity')}
                  value={car.seating_capacity}
                  onChange={(e) => handleFieldChange('seating_capacity', e.target.value)}
                  onBlur={() => handleFieldBlur('seating_capacity')}
                />
                {getFieldError('seating_capacity') && (
                  <p className="text-red-500 text-sm">{errors.seating_capacity}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. New York, Mumbai, London, Delhi"
                    className={getFieldClassName('location')}
                  value={car.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    onBlur={() => handleFieldBlur('location')}
                  />
                  {touched.location && car.location && !errors.location && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {getFieldError('location') && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Describe your car's features, condition, and any special amenities..."
                  className={getFieldClassName('description')}
                  rows="4"
                  value={car.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  onBlur={() => handleFieldBlur('description')}
                />
                <div className="flex justify-between items-center">
                  {getFieldError('description') ? (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Minimum 20 characters required
                    </p>
                  )}
                  <p className={`text-xs ${car.description.length >= 20 ? 'text-green-600' : 'text-gray-500'}`}>
                    {car.description.length}/500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Car...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    List Your Car
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Reset Form
              </button>

              <button
                type="button"
                onClick={deleteForm}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCar;

