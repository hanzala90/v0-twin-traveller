import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Route } from "../types"

interface RouteCardProps {
  route: Route
  onPress: (route: Route) => void
  onSave: (route: Route) => void
  isSaved: boolean
}

const RouteCard: React.FC<RouteCardProps> = ({ route, onPress, onSave, isSaved }) => {
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
    <TouchableOpacity style={styles.card} onPress={() => onPress(route)}>
      <View style={styles.header}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{route.name}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.statText}>{formatDuration(route.duration)}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="navigate-outline" size={16} color="#666" />
              <Text style={styles.statText}>{formatDistance(route.distance)}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="cash-outline" size={16} color="#666" />
              <Text style={styles.statText}>Rs. {route.fare}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={() => onSave(route)}>
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color={isSaved ? "#0066cc" : "#666"} />
        </TouchableOpacity>
      </View>

      <View style={styles.routePreview}>
        <View style={styles.routeSteps}>
          <View style={styles.locationDot} />
          <View style={styles.routeLine} />
          <View style={[styles.locationDot, styles.destinationDot]} />
        </View>
        <View style={styles.routeLocations}>
          <Text style={styles.locationText} numberOfLines={1}>
            {route.origin.name}
          </Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {route.destination.name}
          </Text>
        </View>
      </View>

      <View style={styles.transportModes}>
        {route.steps.some((step) => step.type === "bus") && (
          <View style={styles.transportMode}>
            <Ionicons name="bus-outline" size={16} color="#0066cc" />
          </View>
        )}
        {route.steps.some((step) => step.type === "walk") && (
          <View style={styles.transportMode}>
            <Ionicons name="walk-outline" size={16} color="#0066cc" />
          </View>
        )}
        {route.steps.some((step) => step.type === "metro") && (
          <View style={styles.transportMode}>
            <Ionicons name="train-outline" size={16} color="#0066cc" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  statText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  saveButton: {
    padding: 4,
  },
  routePreview: {
    flexDirection: "row",
    marginBottom: 12,
  },
  routeSteps: {
    width: 20,
    alignItems: "center",
    marginRight: 8,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0066cc",
  },
  destinationDot: {
    backgroundColor: "#e74c3c",
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: "#ddd",
    marginVertical: 4,
  },
  routeLocations: {
    flex: 1,
    justifyContent: "space-between",
    height: 52,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
  },
  transportModes: {
    flexDirection: "row",
    marginTop: 8,
  },
  transportMode: {
    backgroundColor: "#f0f8ff",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
})

export default RouteCard
