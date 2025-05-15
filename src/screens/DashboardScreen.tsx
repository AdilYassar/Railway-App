import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Station from '../components/Dashboard/StationCard'

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
  <Station/>
    </View>
  )
}
const styles=StyleSheet.create({
  container:{
    flex:1
  }
})

export default DashboardScreen