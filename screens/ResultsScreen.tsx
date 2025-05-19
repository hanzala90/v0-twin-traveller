"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from "react-native"
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import RouteCard from "../components/RouteCard"
import useRouteStore from "../store/useRouteStore"
import type { Route } from "../types"
import routesData from "../data/routes.json"

type RootStackParamList = {
  Results: { origin: string; destination: string }
  RouteDetails: { route: Route }
}

type ResultsScreenRouteProp = RouteProp<RootStackParamList, "Results">
type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Results">

const ResultsScreen: React.FC = () => {
  const route = useRoute<ResultsScreenRouteProp>()
  const navigation = useNavigation<ResultsScreenNavigationProp>()
  const { origin, destination } = route.params

  const [loading, setLoading] = useState(true)
  const [routes, setRoutes] = useState<Route[]>([])

  const { savedRoutes, addSavedRoute, removeSavedRoute } = useRouteStore()

  useEffect(() => {
    // Simulate API call to fetch routes
    const fetchRoutes = async () => {
      try {
        // In a real app, you would make an API call here
        // For now, we'll use the hardcoded data and add a delay to simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Parse the JSON data (in a real app, this would come from your API)
        const data = routesData as Route[]
        setRoutes(data)
      } catch (error) {
        console.error("Error fetching routes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [origin, destination])

  const handleRoutePress = (route: Route) => {
    navigation.navigate("RouteDetails", { route })
  }

  const handleSaveRoute = (route: Route) => {
    const isAlreadySaved = savedRoutes.some((r) => r.id === route.id)

    if (isAlreadySaved) {
      removeSavedRoute(route.id)
    } else {
      addSavedRoute(route)
    }
  }

  const isRouteSaved = (routeId: string) => {
    return savedRoutes.some((route) => route.id === routeId)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Routes</Text>
        <View style={styles.searchInfo}>
          <Text style={styles.searchInfoText}>
            {origin} → {destination}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Finding the best routes...</Text>
        </View>
      ) : routes.length > 0 ? (
        <FlatList
          data={routes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RouteCard
              route={item}
              onPress={handleRoutePress}
              onSave={handleSaveRoute}
              isSaved={isRouteSaved(item.id)}
            />
          )}
          contentContainerStyle={styles.routesList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No routes found</Text>
          <Text style={styles.emptyStateSubtext}>Try searching for different locations</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  searchInfo: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInfoText: {
    fontSize: 14,
    color: "#0066cc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  routesList: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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

export default ResultsScreen
