import { useEffect, useMemo, useState } from "react";

import fetchModel from "../lib/fetchModelData";

function useAllUserPhotos(users, enabled, refreshKey = 0) {
  const [photosByUserId, setPhotosByUserId] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userIdsKey = useMemo(
    () => users.map((user) => user._id).join(","),
    [users]
  );

  useEffect(() => {
    const userIds = userIdsKey ? userIdsKey.split(",") : [];

    if (!enabled || userIds.length === 0) {
      setPhotosByUserId({});
      setError(null);
      setIsLoading(false);
      return undefined;
    }

    let isActive = true;

    setError(null);
    setIsLoading(true);

    Promise.all(
      userIds.map((userId) =>
        fetchModel(`/photosOfUser/${userId}`).then((photos) => ({
          userId,
          photos,
        }))
      )
    )
      .then((results) => {
        if (!isActive) {
          return;
        }

        const nextPhotosByUserId = results.reduce((byUserId, result) => {
          byUserId[result.userId] = result.photos;
          return byUserId;
        }, {});

        setPhotosByUserId(nextPhotosByUserId);
      })
      .catch((fetchError) => {
        if (isActive) {
          setError(fetchError);
          setPhotosByUserId({});
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
  }, [enabled, refreshKey, userIdsKey]);

  return { photosByUserId, isLoading, error };
}

export default useAllUserPhotos;
