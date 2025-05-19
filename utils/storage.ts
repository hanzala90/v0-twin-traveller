import AsyncStorage from "@react-native-async-storage/async-storage"
import type { SearchQuery } from "../types"

export const storeRecentSearch = async (search: SearchQuery): Promise<void> => {
  try {
    const existingSearchesJSON = await AsyncStorage.getItem("recentSearches")
    const existingSearches: SearchQuery[] = existingSearchesJSON ? JSON.parse(existingSearchesJSON) : []

    // Filter out duplicate searches
    const filteredSearches = existingSearches.filter(
      (s) => !(s.origin === search.origin && s.destination === search.destination),
    )

    // Add new search at the beginning and limit to 5 items
    const updatedSearches = [search, ...filteredSearches].slice(0, 5)

    await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  } catch (error) {
    console.error("Error storing recent search:", error)
  }
}

export const getRecentSearches = async (): Promise<SearchQuery[]> => {
  try {
    const searchesJSON = await AsyncStorage.getItem("recentSearches")
    return searchesJSON ? JSON.parse(searchesJSON) : []
  } catch (error) {
    console.error("Error retrieving recent searches:", error)
    return []
  }
}

export const clearRecentSearches = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("recentSearches")
  } catch (error) {
    console.error("Error clearing recent searches:", error)
  }
}
