import { UserRole } from "@/src/common/enums/user-role";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useRegisterToken } from "@/src/hooks/use-notifikasi";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

const RegisterTokenGate = () => {
  const { user, isLoading, role } = useFirebaseAuth();
  const { mutate: registerToken, isPending } = useRegisterToken();
  const registeredForUid = useRef<string | null>(null);
  const lastTokenValue = useRef<string | null>(null);
  const isRegistering = useRef(false);

  useEffect(() => {
    if (isLoading || role === UserRole.MANAJER) {
      return;
    }

    if (!user) {
      registeredForUid.current = null;
      lastTokenValue.current = null;
      isRegistering.current = false;
      return;
    }

    if (
      user.uid &&
      registeredForUid.current !== user.uid &&
      !isRegistering.current &&
      !isPending
    ) {
      isRegistering.current = true;

      registerToken(user.uid, {
        onSuccess: (success) => {
          if (success) {
            registeredForUid.current = user.uid;
          }
          isRegistering.current = false;
        },
        onError: () => {
          isRegistering.current = false;
        },
      });
    }
  }, [isLoading, user, role, registerToken, isPending]);

  useEffect(() => {
    if (!user?.uid || role === UserRole.MANAJER) {
      return;
    }

    const subscription = Notifications.addPushTokenListener((tokenData) => {
      const newToken = tokenData.data;

      if (newToken && newToken !== lastTokenValue.current) {
        lastTokenValue.current = newToken;
        registerToken(user.uid);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user?.uid, role, registerToken]);

  return null;
};

export default RegisterTokenGate;
