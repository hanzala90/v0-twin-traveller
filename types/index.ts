export interface Location {
  name: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

export interface RouteStep {
  id: string
  description: string
  type: "walk" | "bus" | "metro" | "wait"
  duration: number // in minutes
  distance?: number // in meters
  busNumber?: string
  busName?: string
  startLocation?: Location
  endLocation?: Location
}

export interface Route {
  id: string
  name: string
  origin: Location
  destination: Location
  duration: number // in minutes
  distance: number // in meters
  fare: number // in PKR
  steps: RouteStep[]
}

export interface SearchQuery {
  origin: string
  destination: string
  timestamp: number
}
