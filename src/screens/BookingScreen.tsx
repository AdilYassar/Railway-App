import { View, Text } from 'react-native'
import React from 'react'
import Booking from '../components/Dashboard/Bookings'

const BookingScreen = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
         <Booking/>
    </View>
  )
}

export default BookingScreen