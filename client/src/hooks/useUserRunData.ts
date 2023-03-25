import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { functions } from "../firebase/firebase";

import { RunData } from "../types";

type RunDataResponse = {
  success: boolean;
  error?: any;
  runData?: RunData[];
};

export const useUserRunData = (uid: string, selectedPage: number) => {
  const [userRunData, setUserRunData] = useState<RunData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const handleFetchUserRunData = httpsCallable(
    functions,
    "handleFetchUserRunData"
  );

  const updateUserRunData = (newRunData: RunData) => {
    const updatedRunData = [...(userRunData || [])];
    if (updatedRunData.length === 10) {
      updatedRunData.pop();
    }

    setUserRunData([newRunData, ...updatedRunData]);
  };

  useEffect(() => {
    getUserRunData();
  }, [selectedPage]);

  const getUserRunData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await handleFetchUserRunData({ uid, selectedPage });

      const { success, error, runData } = result.data as RunDataResponse;

      if (error) {
        setError(error);
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        if (runData) {
          console.log(runData);
          setUserRunData(runData);

          setIsLoading(false);
        }
      }, 1500);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  return {
    userRunData,
    isLoading,
    error,
    updateUserRunData,
  };
};
