import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createUser } from "./usersService";

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const loginAndCreateUser = async () => {
  const user = await loginWithGoogle();

  await createUser(user.uid, {
    name: user.displayName ?? "unknown",
    email: user.email ?? "",
    role: "student"
  });

  return user;
};