import { API } from "../../backend";
export const signup = user => {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

export const signin = (user) => {
  return fetch(`${API}/user/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.warn(error);
    });
};

export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

export const signout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    localStorage.removeItem("cart");
    next();

    return fetch(`${API}user/signout`, {
      method: "GET",
    })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }
};
export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

export const recover = async ({ email }) => {
  try {
    const response = await fetch(`${API}/user/recover`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    // Check for non-2xx HTTP status codes
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to recover password");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Recover request failed:", error);
    throw error; // Re-throw to propagate error to caller
  }
};

// export const reset = async (email, token) => {
//   try {
//     const response = await fetch(`${API}/user/reset/${token}`, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(email),
//     });
//     return await response.json();
//   } catch (error) {
//     console.warn(error);
//   }
// };

export const resetPassword = async ({ password, token }) => {
  try {
    const response = await fetch(`${API}/user/reset/${token}`, {
      method: "POST",
      headers: {

        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({password}),
    });
    // Check for non-2xx HTTP status codes
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset password");
    }

    // Parse and return the JSON response
    return await response.json();

  } catch (error) {
    console.error("Reset password request failed:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};