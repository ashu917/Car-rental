import React, { useEffect, useState } from 'react';
import Title from '../../Components/Title';
import { useAppContext } from '../../Components/Context/AppContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageCars = () => {
  const { isOwner, axios, currency, authReady, refreshCars } = useAppContext();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit'); // 'edit' | 'duplicate'
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: '',
    category: '',
    seating_capacity: '',
    fuel_type: '',
    transmission: '',
    pricePerDay: '',
    location: '',
    description: '',
    image: '',
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [editForm, setEditForm] = useState({
    brand: '', model: '', year: '', category: '', seating_capacity: '', fuel_type: '', transmission: '', pricePerDay: '', location: '', description: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [filtered, setFiltered] = useState([]);

  const fetchOwnerCars = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const { data } = await axios.get('/api/owner/cars', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message || 'Failed to fetch cars');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleCarAvailability = async (carId) => {
    try {
      const token = localStorage.getItem('token') || '';
      const { data } = await axios.post('/api/owner/toggle-car', { carId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message || 'Car availability updated successfully!');
        fetchOwnerCars();
        // Refresh public cars list for users
        refreshCars();
      } else {
        toast.error(data.message || 'Failed to update car availability');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  const deleteCar = async (carId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this car? This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      });
      
      if (!result.isConfirmed) return;
      
      const token = localStorage.getItem('token') || '';
      const { data } = await axios.post('/api/owner/delete-car', { carId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message || 'Car deleted successfully!');
        fetchOwnerCars();
        // Refresh public cars list for users
        refreshCars();
      } else {
        toast.error(data.message || 'Failed to delete car');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (authReady && isOwner) {
      fetchOwnerCars();
    }
  }, [authReady, isOwner]);

  // Initialize filtered cars when cars change
  useEffect(() => {
    if (cars.length > 0) {
      setFiltered(cars);
    }
  }, [cars]);

  // Handle escape key for modals
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        if (modalOpen) {
          closeModal();
        }
        if (editOpen) {
          closeEditFull();
        }
      }
    };

    if (modalOpen || editOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [modalOpen, editOpen]);

  // Separate cars by status for better management
  const availableCars = cars.filter(car => car.isAvailable && !car.isBooked);
  const unavailableCars = cars.filter(car => !car.isAvailable);
  const bookedCars = cars.filter(car => car.isBooked);

  // Apply search filter to the current filtered selection
  const searchFiltered = filtered.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.brand?.toLowerCase().includes(q) ||
      c.model?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q) ||
      String(c.year || '').includes(q) ||
      c.category?.toLowerCase().includes(q)
    );
  });

  const openModal = (mode, car) => {
    setModalMode(mode);
    setForm({
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || '',
      category: car.category || '',
      seating_capacity: car.seating_capacity || '',
      fuel_type: car.fuel_type || '',
      transmission: car.transmission || '',
      pricePerDay: car.pricePerDay || '',
      location: car.location || '',
      description: car.description || '',
      image: car.image || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const continueToAddCar = () => {
    try {
      localStorage.setItem('prefill_car', JSON.stringify(form));
      localStorage.setItem('prefill_mode', modalMode);
    } catch (e) {}
    window.location.href = '/owner/add-car';
  };

  // ----- Edit full (with image) -----
  const openEditFull = (car) => {
    setEditCar(car);
    setEditForm({
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || '',
      category: car.category || '',
      seating_capacity: car.seating_capacity || '',
      fuel_type: car.fuel_type || '',
      transmission: car.transmission || '',
      pricePerDay: car.pricePerDay || '',
      location: car.location || '',
      description: car.description || ''
    });
    setEditImageFile(null);
    setEditImagePreview(car.image || '');
    setEditOpen(true);
  };

  const closeEditFull = () => {
    setEditOpen(false);
    setEditCar(null);
  };

  const onEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const downloadUrlAsFile = async (url, filename = 'image.jpg') => {
    const res = await fetch(url);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
    return file;
  };

  const submitEditFull = async () => {
    if (!editCar) return;
    try {
      const token = localStorage.getItem('token') || '';
      // Ensure we have a file (backend requires image)
      let imageFile = editImageFile;
      if (!imageFile && editCar.image) {
        imageFile = await downloadUrlAsFile(editCar.image, 'car.jpg');
      }
      if (!imageFile) {
        toast.error('Please select an image.');
        return;
      }

      const payload = {
        brand: editForm.brand,
        model: editForm.model,
        year: Number(editForm.year) || '',
        category: editForm.category,
        seating_capacity: Number(editForm.seating_capacity) || '',
        fuel_type: editForm.fuel_type,
        transmission: editForm.transmission,
        pricePerDay: Number(editForm.pricePerDay) || 0,
        location: editForm.location,
        description: editForm.description,
      };

      const fd = new FormData();
      fd.append('carData', JSON.stringify(payload));
      fd.append('image', imageFile);
      // Create a new car with updated details
      const addRes = await axios.post('/api/owner/add-car', fd, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!addRes?.data?.success) {
        toast.error(addRes?.data?.message || 'Failed to update');
        return;
      }
      // Remove old car
      await axios.post('/api/owner/delete-car', { carId: editCar._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Car updated successfully');
      closeEditFull();
      fetchOwnerCars();
      // Refresh public cars list for users
      refreshCars();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Update failed');
    }
  };

  const goToAddCarWithPrefill = (car) => {
    try {
      const payload = {
        brand: car.brand,
        model: car.model,
        year: car.year,
        category: car.category,
        seating_capacity: car.seating_capacity,
        fuel_type: car.fuel_type,
        transmission: car.transmission,
        pricePerDay: car.pricePerDay,
        location: car.location,
        description: car.description,
        image: car.image,
      };
      localStorage.setItem('prefill_car', JSON.stringify(payload));
    } catch (e) {}
    window.location.href = '/owner/add-car';
  };

  // Note: full field edit can be done by duplicating to Add Car via prefill

  if (loading) {
    return (
      <div className="px-4 pt-6 md:px-8 flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Title
              title="Manage Cars"
              subTitle="View all listed cars, update their details, or remove them from the booking platform."
              align="left"
            />
          </div>
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 md:px-8 flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title
            title="Manage Cars"
            subTitle="View all listed cars, update their details, or remove them from the booking platform."
            align="left"
          />
          <div className="mt-4 flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-96 border border-gray-300 rounded-lg px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by brand, model, location..."
            />
            <button
              onClick={() => (window.location.href = '/owner/add-car')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Car
            </button>
          </div>
        </div>

        {/* Car Status Overview - Cards Only */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {availableCars.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unavailable</p>
                <p className="text-2xl font-bold text-red-600">
                  {unavailableCars.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Booked</p>
                <p className="text-2xl font-bold text-orange-600">
                  {bookedCars.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  {currency} {cars.reduce((sum, car) => sum + (car.pricePerDay || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Cars by Status</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltered(cars)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtered === cars 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Cars ({cars.length})
            </button>
            <button
              onClick={() => setFiltered(availableCars)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtered === availableCars 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Available ({availableCars.length})
            </button>
            <button
              onClick={() => setFiltered(unavailableCars)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtered === unavailableCars 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unavailable ({unavailableCars.length})
            </button>
            <button
              onClick={() => setFiltered(bookedCars)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtered === bookedCars 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Booked ({bookedCars.length})
            </button>
          </div>
        </div>

        {/* Dynamic Cars Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              {filtered === cars ? 'All Cars' : 
               filtered === availableCars ? 'Available Cars' : 
               filtered === unavailableCars ? 'Unavailable Cars' : 
               filtered === bookedCars ? 'Booked Cars' : 'Cars'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {filtered === cars ? 'Complete overview of all your cars' : 
               filtered === availableCars ? 'These cars are currently available for booking' : 
               filtered === unavailableCars ? 'These cars are currently marked as unavailable' : 
               filtered === bookedCars ? 'These cars are currently booked and not available for new bookings' : 
               'Car management'}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars match</h3>
              <p className="text-gray-500 mb-6">Try clearing search or add a new car</p>
              <button onClick={() => (window.location.href = '/owner/add-car')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Add Car
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/Day
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchFiltered.map((car) => (
                    <tr key={car._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={car.image} 
                            alt={`${car.brand} ${car.model}`} 
                            className="w-16 h-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {car.brand} {car.model}
                            </p>
                            <p className="text-sm text-gray-500">{car.year}</p>
                            <p className="text-xs text-gray-400">{car.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {car.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {currency} {car.pricePerDay?.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          car.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {car.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleCarAvailability(car._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            {car.isAvailable ? 'Make Unavailable' : 'Make Available'}
                          </button>
                          <button
                            onClick={() => openEditFull(car)}
                            className="inline-flex items-center px-3 py-1.5 border border-yellow-300 shadow-sm text-xs font-medium rounded-md text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCar(car._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Booked Cars Section */}
        {bookedCars.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Booked Cars</h2>
              <p className="text-gray-500 text-sm mt-1">These cars are currently booked and not available for new bookings</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/Day
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookedCars.map((car) => (
                    <tr key={car._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={car.image} 
                            alt={`${car.brand} ${car.model}`} 
                            className="w-16 h-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {car.brand} {car.model}
                            </p>
                            <p className="text-sm text-gray-500">{car.year}</p>
                            <p className="text-xs text-gray-400">{car.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {car.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {currency} {car.pricePerDay?.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          Booked
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Unavailable Cars Section */}
        {unavailableCars.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Unavailable Cars</h2>
              <p className="text-gray-500 text-sm mt-1">These cars are currently marked as unavailable</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/Day
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unavailableCars.map((car) => (
                    <tr key={car._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={car.image} 
                            alt={`${car.brand} ${car.model}`} 
                            className="w-16 h-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {car.brand} {car.model}
                            </p>
                            <p className="text-sm text-gray-500">{car.year}</p>
                            <p className="text-xs text-gray-400">{car.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {car.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {currency} {car.pricePerDay?.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Unavailable
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleCarAvailability(car._id)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200"
                        >
                          Make Available
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compact Unavailable Cars View (Alternative) */}
        {unavailableCars.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Unavailable Cars Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unavailableCars.map((car) => (
                <div key={car._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={car.image} 
                      alt={`${car.brand} ${car.model}`} 
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-xs text-gray-500">{car.year} • {car.category}</p>
                      <p className="text-xs text-gray-400">{car.location}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {currency} {car.pricePerDay?.toLocaleString()}/day
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-center">
                    <button
                      onClick={() => toggleCarAvailability(car._id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200"
                    >
                      Make Available
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Cars Unified View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Cars - Complete Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <div key={car._id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
                car.isBooked 
                  ? 'border-orange-300 bg-orange-50' 
                  : !car.isAvailable 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-green-300 bg-green-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <img 
                    src={car.image} 
                    alt={`${car.brand} ${car.model}`} 
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">{car.year} • {car.category}</p>
                    <p className="text-xs text-gray-400">{car.location}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {currency} {car.pricePerDay?.toLocaleString()}/day
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    car.isBooked 
                      ? 'bg-orange-100 text-orange-800' 
                      : !car.isAvailable 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {car.isBooked ? 'Booked' : !car.isAvailable ? 'Unavailable' : 'Available'}
                  </span>
                  <div className="flex space-x-2">
                    {car.isBooked ? (
                      <span className="text-xs text-orange-600">No Actions</span>
                    ) : !car.isAvailable ? (
                      <button
                        onClick={() => toggleCarAvailability(car._id)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200"
                      >
                        Make Available
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleCarAvailability(car._id)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200"
                      >
                        Make Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Edit/Duplicate */}
        {modalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl border border-gray-200 scrollbar-hide">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold">{modalMode === 'duplicate' ? 'Duplicate Car (Prefill)' : 'Edit Car (Prefill)'}</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600">Brand</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Model</label>
                  <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Seats</label>
                  <input type="number" value={form.seating_capacity} onChange={(e) => setForm({ ...form, seating_capacity: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Fuel</label>
                  <input value={form.fuel_type} onChange={(e) => setForm({ ...form, fuel_type: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Transmission</label>
                  <input value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Price/Day</label>
                  <input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button onClick={closeModal} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button onClick={continueToAddCar} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Continue</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 md:p-4"
            onClick={(e) => e.target === e.currentTarget && closeEditFull()}
          >
            <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-xl shadow-xl border border-gray-200 flex flex-col scrollbar-hide">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl">
                <h3 className="text-lg font-semibold">Edit Car</h3>
                <button onClick={closeEditFull} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600">Image</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {editImagePreview && (
                        <img src={editImagePreview} alt="preview" className="w-40 h-28 object-cover rounded-lg border" />
                      )}
                      <input type="file" accept="image/*" onChange={onEditImageChange} className="w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Brand</label>
                    <input value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Model</label>
                    <input value={editForm.model} onChange={(e) => setEditForm({ ...editForm, model: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Year</label>
                    <input type="number" value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Category</label>
                    <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Seats</label>
                    <input type="number" value={editForm.seating_capacity} onChange={(e) => setEditForm({ ...editForm, seating_capacity: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Fuel</label>
                    <input value={editForm.fuel_type} onChange={(e) => setEditForm({ ...editForm, fuel_type: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Transmission</label>
                    <input value={editForm.transmission} onChange={(e) => setEditForm({ ...editForm, transmission: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Price/Day</label>
                    <input type="number" value={editForm.pricePerDay} onChange={(e) => setEditForm({ ...editForm, pricePerDay: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Location</label>
                    <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600">Description</label>
                    <textarea rows={4} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 sticky bottom-0 bg-white rounded-b-xl">
                <button onClick={closeEditFull} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button onClick={submitEditFull} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Update</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCars;


