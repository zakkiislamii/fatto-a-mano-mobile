import {
  OFFICE_COORD,
  OFFICE_RADIUS_M,
} from "@/src/common/constants/constants";
import { Coordinate } from "@/src/common/types/coordinate";
import distanceMeters from "@/src/common/utils/geo";
import { LocationService } from "@/src/domain/services/location-service";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const useLiveLocation = () => {
  const [location, setLocation] = useState<Coordinate>({ lat: 0, lon: 0 });
  const [address, setAddress] = useState("");
  const [isInsideOffice, setIsInsideOffice] = useState<boolean | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const svcRef = useRef(new LocationService());

  const updateLocation = useCallback(async () => {
    try {
      const granted = await svcRef.current.requestForegroundPermission();
      if (!granted) {
        setIsInsideOffice(null);
        return;
      }
      const current = await svcRef.current.getCurrent(
        Location.Accuracy.Balanced
      );
      const lat = current.coords.latitude;
      const lon = current.coords.longitude;
      setLocation({ lat, lon });
      const d = distanceMeters(lat, lon, OFFICE_COORD.lat, OFFICE_COORD.lon);
      setIsInsideOffice(d <= OFFICE_RADIUS_M);
      const name = await svcRef.current.reverseGeocode(lat, lon);
      if (name) setAddress(name);
    } catch {
      setIsInsideOffice(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const granted = await svcRef.current.requestForegroundPermission();
        if (!mounted) return;
        if (!granted) {
          setIsInsideOffice(null);
          return;
        }

        const initial = await svcRef.current.getCurrent(
          Location.Accuracy.Balanced
        );
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

        watchRef.current = await svcRef.current.watch(
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
  }, []);

  useEffect(() => {
    (async () => {
      if (address) return;
      const { lat, lon } = location;
      if (lat === 0 && lon === 0) return;

      const name = await svcRef.current.reverseGeocode(lat, lon);
      if (!name) return;
      setAddress(name);
    })();
  }, [location.lat, location.lon, address, location]);

  const canCheck = useMemo(
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
    canCheck,
    refresh: updateLocation,
  };
};

export default useLiveLocation;
