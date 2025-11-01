import {
  OFFICE_COORD,
  OFFICE_RADIUS_M,
} from "@/src/common/constants/constants";
import { Coordinate } from "@/src/common/types/coordinate";
import distanceMeters from "@/src/common/utils/geo";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const useLocation = () => {
  const [location, setLocation] = useState<Coordinate>({ lat: 0, lon: 0 });
  const [address, setAddress] = useState("");
  const [isInsideOffice, setIsInsideOffice] = useState<boolean | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const requestForegroundPermission =
    useCallback(async (): Promise<boolean> => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    }, []);

  const getCurrent = useCallback(
    async (
      accuracy: Location.Accuracy = Location.Accuracy.Balanced
    ): Promise<Location.LocationObject> => {
      return Location.getCurrentPositionAsync({ accuracy });
    },
    []
  );

  const reverseGeocode = useCallback(
    async (lat: number, lon: number): Promise<string> => {
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
      } catch (error) {
        console.error("[useLocation] Reverse geocode error:", error);
        return "";
      }
    },
    []
  );

  const watchPosition = useCallback(
    async (
      cb: (pos: Location.LocationObject) => void,
      opts: {
        accuracy?: Location.Accuracy;
        timeInterval?: number;
        distanceInterval?: number;
      } = {}
    ): Promise<Location.LocationSubscription> => {
      const {
        accuracy = Location.Accuracy.Balanced,
        timeInterval = 5000,
        distanceInterval = 5,
      } = opts;
      return Location.watchPositionAsync(
        { accuracy, timeInterval, distanceInterval },
        cb
      );
    },
    []
  );

  const updateLocation = useCallback(async () => {
    try {
      const granted = await requestForegroundPermission();
      if (!granted) {
        setIsInsideOffice(null);
        return;
      }
      const current = await getCurrent(Location.Accuracy.Balanced);
      const lat = current.coords.latitude;
      const lon = current.coords.longitude;
      setLocation({ lat, lon });
      const d = distanceMeters(lat, lon, OFFICE_COORD.lat, OFFICE_COORD.lon);
      setIsInsideOffice(d <= OFFICE_RADIUS_M);
      const name = await reverseGeocode(lat, lon);
      if (name) setAddress(name);
    } catch {
      setIsInsideOffice(null);
    }
  }, [requestForegroundPermission, getCurrent, reverseGeocode]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const granted = await requestForegroundPermission();
        if (!mounted) return;
        if (!granted) {
          setIsInsideOffice(null);
          return;
        }

        const initial = await getCurrent(Location.Accuracy.Balanced);
        if (!mounted) return;

        const lat0 = initial.coords.latitude;
        const lon0 = initial.coords.longitude;
        setLocation({ lat: lat0, lon: lon0 });

        const d0 = distanceMeters(
          lat0,
          lon0,
          OFFICE_COORD.lat,
          OFFICE_COORD.lon
        );
        setIsInsideOffice(d0 <= OFFICE_RADIUS_M);

        watchRef.current = await watchPosition(
          (pos) => {
            if (!mounted) return;
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setLocation({ lat, lon });

            const d = distanceMeters(
              lat,
              lon,
              OFFICE_COORD.lat,
              OFFICE_COORD.lon
            );
            setIsInsideOffice(d <= OFFICE_RADIUS_M);
          },
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 5,
          }
        );
      } catch {
        if (!mounted) return;
        setIsInsideOffice(null);
      }
    })();

    return () => {
      mounted = false;
      watchRef.current?.remove();
      watchRef.current = null;
    };
  }, [requestForegroundPermission, getCurrent, watchPosition]);

  useEffect(() => {
    (async () => {
      if (address) return;
      const { lat, lon } = location;
      if (lat === 0 && lon === 0) return;

      const name = await reverseGeocode(lat, lon);
      if (!name) return;
      setAddress(name);
    })();
  }, [location.lat, location.lon, address, location, reverseGeocode]);

  const isLocationValid = useMemo(
    () =>
      isInsideOffice === true &&
      Number.isFinite(location.lat) &&
      Number.isFinite(location.lon),
    [isInsideOffice, location.lat, location.lon]
  );

  return {
    location,
    isInsideOffice,
    address,
    isLocationValid,
    refresh: updateLocation,
  };
};

export default useLocation;
