import { Timestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { functions } from "../firebase/firebase";

type RunData = {
  distanceKm: number;
  totalTimeMin: number;
  runDate: Timestamp;
};

type RunDataResponse = {
  success: boolean;
  error?: any;
  runData?: RunData[];
};

export const useUserRunData = (uid: string, selectedPage: number) => {
  const [userRunData, setUserRunData] = useState<RunData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const [paginatedRunData, setPaginatedRunData] = useState<RunData[] | null>();

  const [lastRun, setLastRun] = useState<RunData | null>(null);

  const handleFetchUserRunData = httpsCallable(
    functions,
    "handleFetchUserRunData"
  );

  const updateUserRunData = (newRunData: RunData) => {
    setUserRunData((prevRunData) => {
      if (prevRunData) {
        return [newRunData, ...prevRunData];
      }
      return null;
    });
    sessionStorage.setItem(
      "userRunData",
      JSON.stringify([newRunData, ...(userRunData || [])])
    );
  };
  useEffect(() => {
    getUserRunData();
  }, [selectedPage]);

  useEffect(() => {
    getPaginatedRunData(selectedPage);
  }, [userRunData]);

  const getPaginatedRunData = (selectedPage: number) => {
    if (userRunData) {
      if (userRunData.length < 10) {
        setPaginatedRunData(userRunData);
        return;
      }

      const startIndex = (selectedPage - 1) * 10;
      const endIndex = startIndex + 10;

      const paginatedRunData = userRunData.slice(startIndex, endIndex);
      setPaginatedRunData(paginatedRunData);
    }
  };

  const getUserRunData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (sessionStorage.getItem("userRunData")) {
        setUserRunData(JSON.parse(sessionStorage.getItem("userRunData")!));
        setIsLoading(false);
        return;
      }

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
          if (runData.length !== 0) {
            setLastRun(runData[runData.length - 1]);
            sessionStorage.setItem("userRunData", JSON.stringify(runData));
          }

          setIsLoading(false);
        }
      }, 3000);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  return {
    paginatedRunData,
    userRunData,
    isLoading,
    error,
    lastRun,
    updateUserRunData,
  };
};
