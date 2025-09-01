import React from 'react'
import Hero from '../Components/Hero'
// import CarCard from '../Components/CarCard'
import Banner from '../Components/Banner'
import FeaturedSection from '../Components/FeaturedSection'
import Testimonial from '../Components/Testimonial'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Hero/>
       <FeaturedSection></FeaturedSection>
        <Banner/>
        <Testimonial></Testimonial>
    </div>
  )
}

export default React.memo(Home)
