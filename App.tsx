import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HomeScreen from "./screens/HomeScreen"
import ResultsScreen from "./screens/ResultsScreen"
import RouteDetailsScreen from "./screens/RouteDetailsScreen"
import type { Route } from "./types"

// Optional: Supabase setup
// import { createClient } from '@supabase/supabase-js';
// import 'react-native-url-polyfill/auto';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const supabaseUrl = 'YOUR_SUPABASE_URL';
// const supabaseKey = 'YOUR_SUPABASE_KEY';

// const supabase = createClient(supabaseUrl, supabaseKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

type RootStackParamList = {
  Home: undefined
  Results: { origin: string; destination: string }
  RouteDetails: { route: Route }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: true,
            headerShadowVisible: false,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Twin Traveller",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{
              title: "Available Routes",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="RouteDetails"
            component={RouteDetailsScreen}
            options={{
              title: "Route Details",
              headerBackTitle: "Routes",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  )
}
