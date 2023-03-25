import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { functions } from "../firebase/firebase";

export const useNumberOfPages = (uid: string) => {
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const [runsCollectionSize, setRunsCollectionSize] = useState<number>(0);

  const handleGetRunsCollectionSize = httpsCallable(
    functions,
    "handleGetRunsCollectionSize"
  );

  useEffect(() => {
    getNumberOfPages();
  }, []);

  useEffect(() => {
    calculateNumberOfPages(runsCollectionSize);
  }, [runsCollectionSize]);

  const getNumberOfPages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await handleGetRunsCollectionSize({ uid });
      const { success, numberOfRuns } = result.data as {
        success: boolean;
        numberOfRuns: number;
      };

      if (success) {
        setRunsCollectionSize(numberOfRuns);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  const calculateNumberOfPages = (arrayLength: number) => {
    const newNumberOfPages = Math.ceil(arrayLength / 10);
    setNumberOfPages(newNumberOfPages);
  };

  const updateNumberOfPages = () => {
    setRunsCollectionSize(runsCollectionSize + 1);
  };

  return { numberOfPages, isLoading, error, updateNumberOfPages };
};
