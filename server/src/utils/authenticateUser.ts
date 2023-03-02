import { getAuth } from "firebase-admin/auth";

export const getUidFromToken = (idToken: string) => {
  return new Promise((resolve, reject) => {
    getAuth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        resolve(decodedToken.uid);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
