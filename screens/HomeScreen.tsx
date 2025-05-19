"use client"

import type React from "react"
import { useState, useRef } from "react"
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import SearchBar from "../components/SearchBar"
import RouteCard from "../components/RouteCard"
import useRouteStore from "../store/useRouteStore"
import type { Route } from "../types"

type RootStackParamList = {
  Home: undefined
  Results: { origin: string; destination: string }
  RouteDetails: { route: Route }
}

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const mapRef = useRef<MapView>(null)
  const { savedRoutes } = useRouteStore()
  const [showSavedRoutes, setShowSavedRoutes] = useState(false)

  // Initial map region (Islamabad/Rawalpindi area)
  const initialRegion = {
    latitude: 33.6844,
    longitude: 73.0479,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  }

  const handleSearch = (origin: string, destination: string) => {
    navigation.navigate("Results", { origin, destination })
  }

  const handleRoutePress = (route: Route) => {
    navigation.navigate("RouteDetails", { route })
  }

  const toggleSavedRoutes = () => {
    setShowSavedRoutes(!showSavedRoutes)
  }

  // Popular destinations in Islamabad/Rawalpindi
  const popularDestinations = [
    { name: "Faisal Mosque", location: "Islamabad" },
    { name: "Centaurus Mall", location: "Islamabad" },
    { name: "Rawalpindi Railway Station", location: "Rawalpindi" },
    { name: "Islamabad International Airport", location: "Islamabad" },
    { name: "Bahria Town", location: "Rawalpindi" },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar onSearch={handleSearch} />
      </View>

      <View style={styles.mapContainer}>
        <MapView ref={mapRef} style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={initialRegion}>
          <Marker
            coordinate={{
              latitude: 33.6844,
              longitude: 73.0479,
            }}
            title="Islamabad"
            description="Capital of Pakistan"
          />
        </MapView>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, !showSavedRoutes && styles.activeTab]}
            onPress={() => setShowSavedRoutes(false)}
          >
            <Text style={[styles.tabText, !showSavedRoutes && styles.activeTabText]}>Popular Destinations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, showSavedRoutes && styles.activeTab]}
            onPress={() => setShowSavedRoutes(true)}
          >
            <Text style={[styles.tabText, showSavedRoutes && styles.activeTabText]}>Saved Routes</Text>
          </TouchableOpacity>
        </View>

        {!showSavedRoutes ? (
          <ScrollView style={styles.popularDestinationsContainer}>
            {popularDestinations.map((destination, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularDestination}
                onPress={() =>
                  navigation.navigate("Results", {
                    origin: "Current Location",
                    destination: destination.name,
                  })
                }
              >
                <View style={styles.popularDestinationIcon}>
                  <Ionicons name="location" size={20} color="#0066cc" />
                </View>
                <View>
                  <Text style={styles.popularDestinationName}>{destination.name}</Text>
                  <Text style={styles.popularDestinationLocation}>{destination.location}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevron} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ScrollView style={styles.savedRoutesContainer}>
            {savedRoutes.length > 0 ? (
              savedRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onPress={handleRoutePress}
                  onSave={() => {}} // No-op since it's already saved
                  isSaved={true}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="bookmark-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No saved routes yet</Text>
                <Text style={styles.emptyStateSubtext}>Your saved routes will appear here</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  mapContainer: {
    height: "50%",
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0066cc",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#0066cc",
  },
  popularDestinationsContainer: {
    flex: 1,
  },
  popularDestination: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  popularDestinationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  popularDestinationName: {
    fontSize: 16,
    fontWeight: "500",
  },
  popularDestinationLocation: {
    fontSize: 14,
    color: "#666",
  },
  chevron: {
    marginLeft: "auto",
  },
  savedRoutesContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
    color: "#666",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
})

export default HomeScreen
