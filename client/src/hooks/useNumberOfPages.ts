import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { functions } from "../firebase/firebase";

export const useNumberOfPages = (uid: string) => {
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const handleGetNumberOfPages = httpsCallable(
    functions,
    "handleGetNumberOfPages"
  );

  useEffect(() => {
    getNumberOfPages();
  }, []);

  const getNumberOfPages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (sessionStorage.getItem("numberOfPages")) {
        setNumberOfPages(JSON.parse(sessionStorage.getItem("numberOfPages")!));
        setIsLoading(false);
        return;
      }

      const result = await handleGetNumberOfPages({ uid });
      const { success, numberOfPages } = result.data as {
        success: boolean;
        numberOfPages: number;
      };

      if (numberOfPages === 0) {
        setNumberOfPages(1);
        sessionStorage.setItem("numberOfPages", JSON.stringify(1));
      } else {
        setNumberOfPages(numberOfPages);
        sessionStorage.setItem("numberOfPages", JSON.stringify(numberOfPages));
      }

      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  const updateNumberOfPages = (arrayLength: number) => {
    console.log("arrayLength", arrayLength + 1);
    const newNumberOfPages = Math.ceil((arrayLength + 1) / 10);
    setNumberOfPages(newNumberOfPages);
    console.log(newNumberOfPages || 1);
    sessionStorage.setItem(
      "numberOfPages",
      JSON.stringify(newNumberOfPages || 1)
    );
  };

  return { numberOfPages, isLoading, error, updateNumberOfPages };
};
