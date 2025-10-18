import * as Location from "expo-location";

export class LocationService {
  public async requestForegroundPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  }

  public async getCurrent(
    accuracy: Location.Accuracy = Location.Accuracy.Balanced
  ) {
    return Location.getCurrentPositionAsync({ accuracy });
  }

  public async watch(
    cb: (pos: Location.LocationObject) => void,
    opts: {
      accuracy?: Location.Accuracy;
      timeInterval?: number;
      distanceInterval?: number;
    } = {}
  ) {
    const {
      accuracy = Location.Accuracy.Balanced,
      timeInterval = 5000,
      distanceInterval = 5,
    } = opts;
    return Location.watchPositionAsync(
      { accuracy, timeInterval, distanceInterval },
      cb
    );
  }

  public async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const geos = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });
      const g = geos?.[0];
      if (!g) return "";
      return [g.name, g.street, g.subregion, g.city, g.region]
        .filter(Boolean)
        .join(", ");
    } catch {
      return "";
    }
  }
}
