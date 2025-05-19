"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native"
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import DirectionStep from "../components/DirectionStep"
import useRouteStore from "../store/useRouteStore"
import type { Route } from "../types"

type RootStackParamList = {
  RouteDetails: { route: Route }
}

type RouteDetailsScreenRouteProp = RouteProp<RootStackParamList, "RouteDetails">

const RouteDetailsScreen: React.FC = () => {
  const route = useRoute<RouteDetailsScreenRouteProp>()
  const navigation = useNavigation()
  const { route: selectedRoute } = route.params
  const mapRef = useRef<MapView>(null)

  const { savedRoutes, addSavedRoute, removeSavedRoute } = useRouteStore()
  const isSaved = savedRoutes.some((r) => r.id === selectedRoute.id)

  const handleSaveToggle = () => {
    if (isSaved) {
      removeSavedRoute(selectedRoute.id)
    } else {
      addSavedRoute(selectedRoute)
    }
  }

  // Generate route coordinates for the map
  const routeCoordinates = selectedRoute.steps
    .filter((step) => step.startLocation && step.endLocation)
    .flatMap((step) => [step.startLocation!.coordinates, step.endLocation!.coordinates])

  // Calculate map region to fit all coordinates
  const calculateRegion = () => {
    if (routeCoordinates.length === 0) return null

    let minLat = routeCoordinates[0].latitude
    let maxLat = routeCoordinates[0].latitude
    let minLng = routeCoordinates[0].longitude
    let maxLng = routeCoordinates[0].longitude

    routeCoordinates.forEach((coord) => {
      minLat = Math.min(minLat, coord.latitude)
      maxLat = Math.max(maxLat, coord.latitude)
      minLng = Math.min(minLng, coord.longitude)
      maxLng = Math.max(maxLng, coord.longitude)
    })

    const latDelta = (maxLat - minLat) * 1.5
    const lngDelta = (maxLng - minLng) * 1.5

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.02),
      longitudeDelta: Math.max(lngDelta, 0.02),
    }
  }

  const mapRegion = calculateRegion()

  useEffect(() => {
    if (mapRef.current && mapRegion) {
      mapRef.current.animateToRegion(mapRegion, 1000)
    }
  }, [])

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`
    }
    return `${meters} m`
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {mapRegion && (
          <MapView ref={mapRef} style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={mapRegion}>
            {/* Origin marker */}
            <Marker coordinate={selectedRoute.origin.coordinates} title={selectedRoute.origin.name}>
              <View style={styles.originMarker}>
                <Ionicons name="location" size={24} color="#0066cc" />
              </View>
            </Marker>

            {/* Destination marker */}
            <Marker coordinate={selectedRoute.destination.coordinates} title={selectedRoute.destination.name}>
              <View style={styles.destinationMarker}>
                <Ionicons name="navigate" size={24} color="#e74c3c" />
              </View>
            </Marker>

            {/* Route polyline */}
            <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="#0066cc" />
          </MapView>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.routeName}>{selectedRoute.name}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.statText}>{formatDuration(selectedRoute.duration)}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="navigate-outline" size={16} color="#666" />
                <Text style={styles.statText}>{formatDistance(selectedRoute.distance)}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="cash-outline" size={16} color="#666" />
                <Text style={styles.statText}>Rs. {selectedRoute.fare}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveToggle}>
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color={isSaved ? "#0066cc" : "#666"} />
          </TouchableOpacity>
        </View>

        <View style={styles.routeOverview}>
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText} numberOfLines={1}>
              {selectedRoute.origin.name}
            </Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.locationContainer}>
            <View style={[styles.locationDot, styles.destinationDot]} />
            <Text style={styles.locationText} numberOfLines={1}>
              {selectedRoute.destination.name}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Step by Step Directions</Text>

        <ScrollView style={styles.stepsContainer}>
          {selectedRoute.steps.map((step, index) => (
            <DirectionStep
              key={step.id}
              step={step}
              isFirst={index === 0}
              isLast={index === selectedRoute.steps.length - 1}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mapContainer: {
    height: "40%",
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  originMarker: {
    padding: 5,
  },
  destinationMarker: {
    padding: 5,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  routeName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  saveButton: {
    padding: 4,
  },
  routeOverview: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0066cc",
    marginRight: 12,
  },
  destinationDot: {
    backgroundColor: "#e74c3c",
  },
  locationText: {
    fontSize: 16,
    color: "#333",
  },
  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: "#ddd",
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  stepsContainer: {
    flex: 1,
  },
})

export default RouteDetailsScreen
