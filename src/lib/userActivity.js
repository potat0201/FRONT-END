function createInitialActivity(users) {
  return users.reduce((activityByUserId, user) => {
    activityByUserId[user._id] = {
      photoCount: 0,
      commentCount: 0,
      comments: [],
    };

    return activityByUserId;
  }, {});
}

function buildUserActivity(users, photosByUserId) {
  const activityByUserId = createInitialActivity(users);

  Object.entries(photosByUserId).forEach(([photoOwnerId, photos]) => {
    if (activityByUserId[photoOwnerId]) {
      activityByUserId[photoOwnerId].photoCount = photos.length;
    }

    photos.forEach((photo, photoIndex) => {
      (photo.comments || []).forEach((comment) => {
        const authorId = comment.user?._id;

        if (!activityByUserId[authorId]) {
          return;
        }

        activityByUserId[authorId].commentCount += 1;
        activityByUserId[authorId].comments.push({
          ...comment,
          photo: {
            _id: photo._id,
            file_name: photo.file_name,
            user_id: photo.user_id,
            owner_id: photoOwnerId,
            index: photoIndex,
          },
        });
      });
    });
  });

  return activityByUserId;
}

export default buildUserActivity;
