"use client"

import type React from "react"
import { useState } from "react"
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { SearchQuery } from "../types"
import useRouteStore from "../store/useRouteStore"

interface SearchBarProps {
  onSearch: (origin: string, destination: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [showRecentSearches, setShowRecentSearches] = useState(false)

  const { recentSearches, addRecentSearch } = useRouteStore()

  const handleSearch = () => {
    if (origin.trim() && destination.trim()) {
      const searchQuery: SearchQuery = {
        origin: origin.trim(),
        destination: destination.trim(),
        timestamp: Date.now(),
      }

      addRecentSearch(searchQuery)
      onSearch(origin.trim(), destination.trim())
      setShowRecentSearches(false)
    }
  }

  const handleRecentSearchSelect = (search: SearchQuery) => {
    setOrigin(search.origin)
    setDestination(search.destination)
    setShowRecentSearches(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="location" size={20} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="From"
            value={origin}
            onChangeText={setOrigin}
            onFocus={() => setShowRecentSearches(true)}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.inputContainer}>
          <Ionicons name="navigate" size={20} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="To"
            value={destination}
            onChangeText={setDestination}
            onFocus={() => setShowRecentSearches(true)}
          />
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showRecentSearches && recentSearches.length > 0 && (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => `${item.origin}-${item.destination}-${item.timestamp}`}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.recentSearchItem} onPress={() => handleRecentSearchSelect(item)}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.recentSearchText}>
                  {item.origin} → {item.destination}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 10,
  },
  searchContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
  searchButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#0066cc",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  recentSearchesContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  recentSearchesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#666",
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  recentSearchText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
})

export default SearchBar
