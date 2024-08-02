// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "@clerk/nextjs";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const { user, loading, error, getToken } = useAuth();

//   const signInWithClerk = async () => {
//     try {
//       const token = await getToken({ template: "integration_firebase" });
//       if (!token) {
//         throw new Error("No token received from Clerk");
//       }
//     } catch (err) {
//       console.error("Authentication error:", err);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await user.signOut();
//     } catch (err) {
//       console.error("Sign out error:", err);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, signInWithClerk, signOut, loading, error }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuthContext() {
//   return useContext(AuthContext);
// }
