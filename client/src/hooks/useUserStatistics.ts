import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { functions } from "../firebase/firebase";

type UserStatistics = {
  totalDistanceKm: number;
  totalTimeMin: number;
  totalRunCount: number;
};

export const useUserTotalStatistics = (uid: string) => {
  const [userTotalStatistics, setUserTotalStatistics] =
    useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const handleGetUserTotalStatistics = httpsCallable(
    functions,
    "handleGetUserTotalStatistics"
  );

  useEffect(() => {
    getUserTotalStatistics();
  }, []);

  const getUserTotalStatistics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await handleGetUserTotalStatistics({ uid });
      const { success, ...data } = result.data as {
        success: boolean;
      } & UserStatistics;
      console.log(data);
      setUserTotalStatistics(data);
      // setTimeout(() => {
      setIsLoading(false);
      // }, 3000);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  return { userTotalStatistics, isLoading, error };
};
