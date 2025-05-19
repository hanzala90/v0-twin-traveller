import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Route, SearchQuery } from "../types"

interface RouteState {
  savedRoutes: Route[]
  recentSearches: SearchQuery[]
  addSavedRoute: (route: Route) => void
  removeSavedRoute: (routeId: string) => void
  addRecentSearch: (search: SearchQuery) => void
  clearRecentSearches: () => void
}

const useRouteStore = create<RouteState>()(
  persist(
    (set) => ({
      savedRoutes: [],
      recentSearches: [],

      addSavedRoute: (route) =>
        set((state) => ({
          savedRoutes: state.savedRoutes.some((r) => r.id === route.id)
            ? state.savedRoutes
            : [route, ...state.savedRoutes],
        })),

      removeSavedRoute: (routeId) =>
        set((state) => ({
          savedRoutes: state.savedRoutes.filter((route) => route.id !== routeId),
        })),

      addRecentSearch: (search) =>
        set((state) => {
          const filteredSearches = state.recentSearches.filter(
            (s) => !(s.origin === search.origin && s.destination === search.destination),
          )
          return {
            recentSearches: [search, ...filteredSearches].slice(0, 5), // Keep only 5 recent searches
          }
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "route-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

export default useRouteStore
