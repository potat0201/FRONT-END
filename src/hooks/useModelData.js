import { useEffect, useState } from "react";

import fetchModel from "../lib/fetchModelData";

function useModelData(modelUrl, refreshKey = 0) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    setData(null);
    setError(null);
    setIsLoading(true);

    fetchModel(modelUrl)
      .then((modelData) => {
        if (isActive) {
          setData(modelData);
        }
      })
      .catch((fetchError) => {
        if (isActive) {
          setError(fetchError);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [modelUrl, refreshKey]);

  return { data, isLoading, error };
}

export default useModelData;
