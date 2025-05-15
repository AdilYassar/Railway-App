import { View, StyleSheet } from 'react-native'
import React from 'react'
import Station from '../components/Dashboard/StationCard'
import Header from '../components/Dashboard/header'

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
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