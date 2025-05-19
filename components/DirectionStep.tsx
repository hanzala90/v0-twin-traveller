import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { RouteStep } from "../types"

interface DirectionStepProps {
  step: RouteStep
  isFirst: boolean
  isLast: boolean
}

const DirectionStep: React.FC<DirectionStepProps> = ({ step, isFirst, isLast }) => {
  const getStepIcon = () => {
    switch (step.type) {
      case "walk":
        return <Ionicons name="walk-outline" size={24} color="#0066cc" />
      case "bus":
        return <Ionicons name="bus-outline" size={24} color="#0066cc" />
      case "metro":
        return <Ionicons name="train-outline" size={24} color="#0066cc" />
      case "wait":
        return <Ionicons name="time-outline" size={24} color="#0066cc" />
      default:
        return <Ionicons name="navigate-outline" size={24} color="#0066cc" />
    }
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDistance = (meters?: number): string => {
    if (!meters) return ""

    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`
    }
    return `${meters} m`
  }

  return (
    <View style={styles.container}>
      <View style={styles.timelineContainer}>
        <View style={[styles.timelineLine, isFirst && styles.timelineLineFirst, isLast && styles.timelineLineLast]} />
        <View style={styles.iconContainer}>{getStepIcon()}</View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.description}>{step.description}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{formatDuration(step.duration)}</Text>
          </View>

          {step.distance && (
            <View style={styles.detail}>
              <Ionicons name="navigate-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{formatDistance(step.distance)}</Text>
            </View>
          )}

          {step.busNumber && (
            <View style={styles.busDetail}>
              <Text style={styles.busNumber}>{step.busNumber}</Text>
              <Text style={styles.busName}>{step.busName}</Text>
            </View>
          )}
        </View>

        {step.startLocation && step.endLocation && (
          <View style={styles.locationsContainer}>
            <Text style={styles.locationText}>
              <Text style={styles.locationLabel}>From: </Text>
              {step.startLocation.name}
            </Text>
            <Text style={styles.locationText}>
              <Text style={styles.locationLabel}>To: </Text>
              {step.endLocation.name}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 16,
  },
  timelineContainer: {
    width: 60,
    alignItems: "center",
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    width: 2,
    backgroundColor: "#ddd",
    top: 0,
    bottom: 0,
    left: 30,
  },
  timelineLineFirst: {
    top: "50%",
  },
  timelineLineLast: {
    bottom: "50%",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  busDetail: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    marginBottom: 4,
  },
  busNumber: {
    fontWeight: "bold",
    color: "#0066cc",
    marginRight: 4,
  },
  busName: {
    fontSize: 14,
    color: "#666",
  },
  locationsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  locationLabel: {
    fontWeight: "500",
    color: "#666",
  },
})

export default DirectionStep
