import { UserRole } from "@/src/common/enums/user-role";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useRegisterToken } from "@/src/hooks/use-notifikasi";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

const RegisterTokenGate = () => {
  const { user, isLoading, role } = useFirebaseAuth();
  const { mutate: registerToken } = useRegisterToken();
  const registeredForUid = useRef<string | null>(null);
  const lastTokenValue = useRef<string | null>(null);

  useEffect(() => {
    if (role === UserRole.manajer) {
      registeredForUid.current = null;
      lastTokenValue.current = null;
      return;
    }

    if (!isLoading && user?.uid && registeredForUid.current !== user.uid) {
      registerToken(user.uid);
      registeredForUid.current = user.uid;
    }

    if (!user) {
      registeredForUid.current = null;
      lastTokenValue.current = null;
    }
  }, [isLoading, user?.uid, role, registerToken, user]);

  useEffect(() => {
    if (role === UserRole.manajer) {
      return;
    }

    const sub = Notifications.addPushTokenListener((tokenData) => {
      const newToken = tokenData.data;
      if (user?.uid && newToken !== lastTokenValue.current) {
        registerToken(user.uid);
        lastTokenValue.current = newToken;
      }
    });

    return () => {
      sub.remove();
    };
  }, [user?.uid, role, registerToken]);

  return null;
};

export default RegisterTokenGate;
