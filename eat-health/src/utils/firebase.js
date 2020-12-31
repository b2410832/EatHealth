import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9vfuI1awPBy6mM1L7brpdp_A8DwRUiXM",
  authDomain: "eatwell-a0ca6.firebaseapp.com",
  databaseURL: "https://eatwell-a0ca6.firebaseio.com",
  projectId: "eatwell-a0ca6",
  storageBucket: "eatwell-a0ca6.appspot.com",
  messagingSenderId: "132579403086",
  appId: "1:132579403086:web:0e5e6421b24c66c0682a1f",
  measurementId: "G-JK8LJLGWZ2",
};

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export { db, storage, auth };

// auth
export const createNativeUser = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const logoutFromAuth = (callback) => {
  auth
    .signOut()
    .then(function () {
      callback();
    })
    .catch(function (error) {
      alert("登出失敗");
    });
};

// storage
export const uploadImageToStorage = (refPath, file, callback) => {
  return storage
    .ref(refPath)
    .put(file)
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((downloadURL) => callback(downloadURL));
};
export const getImageUrlFromStorage = (refPath, childPath, callback) => {
  return storage
    .ref(refPath)
    .child(childPath)
    .getDownloadURL()
    .then((url) => callback(url));
};

// firestore
// recipes
export const getRecipe = (recipeId) => {
  return db.collection("recipes").doc(recipeId).get();
};

export const getUserRecipe = (userId) => {
  return db.collection("recipes").where("authorId", "==", userId).get();
};

export const getRealtimeRecipe = (recipeId, callback) => {
  return db
    .collection("recipes")
    .doc(recipeId)
    .onSnapshot((snapshots) => {
      callback(snapshots);
    });
};

export const getAllRecipes = () => {
  return db.collection("recipes").get();
};

export const getRecommended = (recipeId) => {
  return db.collection("recipes").where("id", "!=", recipeId).limit(5).get();
};

export const getLatests = () => {
  return db.collection("recipes").orderBy("createdTime", "desc").limit(6).get();
};

export const getMealTimes = (mealTime) => {
  return db
    .collection("recipes")
    .where("mealTime", "==", mealTime)
    .limit(6)
    .get();
};

export const updateRecipe = (recipeId, updatedKeyValue) => {
  return db.collection("recipes").doc(recipeId).update(updatedKeyValue);
};

export const postRecipe = (recipeData) => {
  const recipe = db.collection("recipes").doc();
  recipe.set({
    ...recipeData,
    id: recipe.id,
    createdTime: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const postComment = (recipeId, commentData) => {
  const doc = db
    .collection("recipes")
    .doc(recipeId)
    .collection("comments")
    .doc();
  return doc.set({
    ...commentData,
    createdTime: firebase.firestore.FieldValue.serverTimestamp(),
    commentId: doc.id,
  });
};

export const deleteComment = (recipeId, commentId) => {
  return db
    .collection("recipes")
    .doc(recipeId)
    .collection("comments")
    .doc(commentId)
    .delete();
};

export const getRealtimeRecipeLikes = (recipeId, callback) => {
  return db
    .collectionGroup("liked")
    .where("recipeId", "==", recipeId)
    .onSnapshot((snapshots) => {
      callback(snapshots.docs);
    });
};

export const getRealtimeRecipeComments = (recipeId, callback) => {
  return db
    .collection("recipes")
    .doc(recipeId)
    .collection("comments")
    .orderBy("createdTime", "desc")
    .onSnapshot((snapshots) => {
      callback(snapshots.docs);
    });
};

// users
export const postUser = (displayName, photoURL) => {
  return db.collection("users").doc(auth.currentUser.uid).set({
    displayName,
    photoURL,
    email: auth.currentUser.email,
    userId: auth.currentUser.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const getUser = (userId) => {
  return db.collection("users").doc(userId).get();
};

export const getFavorites = (userId) => {
  return db.collection("users").doc(userId).collection("favorites").get();
};

export const getRealtimeFans = (userId, callback) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("fans")
    .onSnapshot((snapshots) => {
      callback(snapshots);
    });
};

export const getRealtimeFollowings = (userId, callback) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("followings")
    .onSnapshot((snapshot) => {
      callback(snapshot.docs);
    });
};

export const getIsFollowing = (userId, followId) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("followings")
    .doc(followId)
    .get();
};

export const addFollowing = (userId, followId) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("followings")
    .doc(followId)
    .set({ followingId: followId });
};

export const deleteFollowing = (userId, followId) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("followings")
    .doc(followId)
    .delete();
};

export const addFan = (followId, userId) => {
  return db
    .collection("users")
    .doc(followId)
    .collection("fans")
    .doc(userId)
    .set({ fanId: userId });
};

export const deleteFan = (followId, userId) => {
  return db
    .collection("users")
    .doc(followId)
    .collection("fans")
    .doc(userId)
    .delete();
};

export const toggleFollowing = (userId, followId) => {
  return getIsFollowing(userId, followId).then((doc) => {
    const isAlreadyFollowing = doc.data();
    isAlreadyFollowing
      ? deleteFollowing(userId, followId).then(() =>
          deleteFan(followId, userId)
        )
      : addFollowing(userId, followId).then(() => addFan(followId, userId));
  });
};

export const getIsFavorite = (userId, recipeId) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("favorites")
    .doc(recipeId)
    .get();
};

export const getRealtimeIsFavorite = (userId, callback) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("favorites")
    .onSnapshot((snapshot) => {
      callback(snapshot.docs);
    });
};

export const deleteFavorite = (userId, recipeId) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("favorites")
    .doc(recipeId)
    .delete();
};

export const addFavorite = (userId, recipeId) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("favorites")
    .doc(recipeId)
    .set({ recipeId: recipeId });
};

export const toggleFavorite = (userId, recipeId) => {
  return getIsFavorite(userId, recipeId).then((doc) => {
    const isAlreadyFavorite = doc.data();
    isAlreadyFavorite
      ? deleteFavorite(userId, recipeId)
      : addFavorite(userId, recipeId);
  });
};

export const getIsLiked = (userId, recipeId) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("liked")
    .doc(recipeId)
    .get();
};

export const getRealtimeIsLiked = (userId, callback) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("liked")
    .onSnapshot((snapshot) => {
      callback(snapshot.docs);
    });
};

export const deleteLiked = (userId, recipeId) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("liked")
    .doc(recipeId)
    .delete();
};

export const addLiked = (userId, recipeId) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("liked")
    .doc(recipeId)
    .set({ recipeId: recipeId });
};

export const toggleLiked = (userId, recipeId) => {
  return getIsLiked(userId, recipeId).then((doc) => {
    const isAlreadyLiked = doc.data();
    isAlreadyLiked ? deleteLiked(userId, recipeId) : addLiked(userId, recipeId);
  });
};
