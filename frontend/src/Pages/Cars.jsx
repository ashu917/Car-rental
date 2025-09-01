import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import CarCard from '../Components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../Components/Context/AppContext'
import toast from 'react-hot-toast'

const Cars = () => {
  // getting search params from url 
  const [searchParams] = useSearchParams()
  const pickpLocation = searchParams.get('pickupLocation')
  const pickpDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const q = searchParams.get('q') || ''

  const { cars, axios } = useAppContext()

  const isSearchData = pickpLocation && pickpDate && returnDate

  const [filteredCars, setFilteredCars] = useState([])
  const [input, setInput] = useState(q)

  const applyFilter = useCallback(() => {
    if (input === '') {
      // Only show available and not booked cars
      setFilteredCars(cars.filter(car => car.isAvailable !== false && car.isBooked !== true))
      return
    }
    const filtered = cars.slice().filter((car) => {
      // First check if car is available and not booked
      if (car.isAvailable === false || car.isBooked === true) return false
      
      // Then apply search filter
      return (
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase()) ||
        car.transmission.toLowerCase().includes(input.toLowerCase())
      )
    })
    setFilteredCars(filtered)
  }, [input, cars])

  useEffect(() => {
    if (cars?.length > 0 && !isSearchData) {
      // Ensure we only show available and not booked cars
      const availableCars = cars.filter(car => car.isAvailable !== false && car.isBooked !== true)
      const filteredOut = cars.length - availableCars.length
      if (filteredOut > 0) {
        console.log(`Filtered out ${filteredOut} cars (unavailable or booked)`)
      }
      applyFilter()
    }
  }, [input, cars])

  // keep input in sync when the URL q changes
  useEffect(() => {
    setInput(q)
  }, [q])

  const searchCarAvailablity = useCallback(async () => {
    const { data } = await axios.post('/api/booking/check-availability', {
      location: pickpLocation,
      pickpDate,
      returnDate,
    })
    if (data.success) {
      // Double-check: only show cars that are available and not booked
      const trulyAvailableCars = data.availableCars.filter(car => car.isAvailable !== false && car.isBooked !== true)
      setFilteredCars(trulyAvailableCars)
      
      if (trulyAvailableCars.length === 0) {
        toast('No cars Available')
      } else if (trulyAvailableCars.length !== data.availableCars.length) {
        const filteredOut = data.availableCars.length - trulyAvailableCars.length
        console.log(`Filtered out ${filteredOut} cars (unavailable or booked) from search results`)
      }
    }
  }, [pickpLocation, pickpDate, returnDate, axios])

  useEffect(() => {
    isSearchData && searchCarAvailablity()
  }, [])

  return (
    <div>
      <div className="flex flex-col items-center gap-y-8 bg-light max-md:px-4 pt-20">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles that are currently available and not booked"
        />

        {/* Search bar */}
        <div className="flex items-center bg-white px-4 mt-4 max-w-[560px] w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </div>
      </div>

      {/* Car list */}
      <div className="px-6 md:px-16 lg:px-24 Xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Available Cars
          {cars.length !== filteredCars.length && (
            <span className="text-blue-600 ml-2">
              ({cars.length - filteredCars.length} unavailable cars filtered out)
            </span>
          )}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <div key={index}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cars
