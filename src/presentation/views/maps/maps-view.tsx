import {
  OFFICE_COORD,
  OFFICE_RADIUS_M,
} from "@/src/common/constants/constants";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import useLocation from "../../hooks/location/use-location";

interface MapsViewProps {
  isDark: boolean;
}

const MapsView = ({ isDark }: MapsViewProps) => {
  const { location, isLocationValid, refresh } = useLocation();
  const { width } = Dimensions.get("window");
  const mapRef = useRef<MapView>(null);
  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);

  useEffect(() => {
    if (location.lat && location.lon) {
      const initialRegion = {
        latitude: location.lat,
        longitude: location.lon,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setMapRegion(initialRegion);
    }
  }, [location.lat, location.lon]);

  const focusOnUserLocation = () => {
    if (mapRef.current && location.lat && location.lon) {
      const userRegion = {
        latitude: location.lat,
        longitude: location.lon,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      };
      mapRef.current.animateToRegion(userRegion, 1000);
    }
  };

  const zoomIn = () => {
    if (mapRef.current && mapRegion) {
      const newRegion = {
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta / 2,
        longitudeDelta: mapRegion.longitudeDelta / 2,
      };
      mapRef.current.animateToRegion(newRegion, 300);
    }
  };

  const zoomOut = () => {
    if (mapRef.current && mapRegion) {
      const newRegion = {
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta * 2,
        longitudeDelta: mapRegion.longitudeDelta * 2,
      };
      mapRef.current.animateToRegion(newRegion, 300);
    }
  };

  const bgColor = isDark ? "bg-cardDark" : "bg-cardLight";
  const mutedText = isDark ? "text-textMutedDark" : "text-textMutedLight";

  if (!location.lat || !location.lon || !mapRegion) {
    return (
      <View className={`${bgColor} w-full p-1 shadow-md my-3`}>
        <View className="bg-gray-200 rounded-xl h-48 items-center justify-center">
          <Feather name="map" size={40} color="#6b7280" />
          <Text className={`mt-2 text-sm ${mutedText}`}>
            Menunggu lokasi...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`${bgColor} w-full p-1 shadow-md`}>
      <View className="rounded-xl overflow-hidden">
        <MapView
          ref={mapRef}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={{ width: width - 48, height: 200 }}
          initialRegion={mapRegion}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation={false}
          mapType="standard"
          showsMyLocationButton={true}
          scrollEnabled={true}
          zoomEnabled={true}
        >
          <Circle
            center={{
              latitude: OFFICE_COORD.lat,
              longitude: OFFICE_COORD.lon,
            }}
            radius={OFFICE_RADIUS_M}
            fillColor={
              isDark ? "rgba(34, 197, 94, 0.2)" : "rgba(34, 197, 94, 0.1)"
            }
            strokeColor={isDark ? "#22c55e" : "#16a34a"}
            strokeWidth={2}
          />
          <Marker
            coordinate={{
              latitude: OFFICE_COORD.lat,
              longitude: OFFICE_COORD.lon,
            }}
            title="Kantor"
            description="Area kantor"
          >
            <View className="bg-blue-500 p-2 rounded-full">
              <Feather name="briefcase" size={16} color="white" />
            </View>
          </Marker>
          <Marker
            coordinate={{ latitude: location.lat, longitude: location.lon }}
            title="Lokasi Anda"
            description={`${location.lat.toFixed(6)}, ${location.lon.toFixed(
              6
            )}`}
          >
            <View
              className={`${
                isLocationValid ? "bg-green-500" : "bg-red-500"
              } p-2 rounded-full border-2 border-white`}
            >
              <Feather name="user" size={16} color="white" />
            </View>
          </Marker>
        </MapView>

        <View className="absolute bottom-4 right-4 flex-col items-center">
          <TouchableOpacity
            onPress={refresh}
            className={`p-3 rounded-full shadow-lg mb-2 ${
              isDark ? "bg-gray-700" : "bg-white"
            }`}
          >
            <Feather
              name="refresh-cw"
              size={18}
              color={isDark ? "#e2e8f0" : "#334155"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={focusOnUserLocation}
            className={`p-3 rounded-full shadow-lg mb-2 ${
              isDark ? "bg-gray-700" : "bg-white"
            }`}
          >
            <MaterialIcons
              name="location-searching"
              size={18}
              color={isDark ? "#e2e8f0" : "#334155"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={zoomIn}
            className={`p-3 rounded-full shadow-lg mb-2 ${
              isDark ? "bg-gray-700" : "bg-white"
            }`}
          >
            <Feather
              name="plus"
              size={18}
              color={isDark ? "#e2e8f0" : "#334155"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={zoomOut}
            className={`p-3 rounded-full shadow-lg ${
              isDark ? "bg-gray-700" : "bg-white"
            }`}
          >
            <Feather
              name="minus"
              size={18}
              color={isDark ? "#e2e8f0" : "#334155"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapsView;
