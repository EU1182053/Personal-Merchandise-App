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
  return fetch(`${API}/signin`, {
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

    return fetch(`${API}/signout`, {
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

export const recover = async (email) => {
  try {
    const data = await fetch(`${API}/user/recover`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
    
    
    return await data.json();
  } catch (error) {
    console.warn(error);
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

export const resetPassword =  (password) => {
  try {
    let token = localStorage.getItem('resetToken');
    return  fetch(`${API}/user/reset/${token}`, {
      mode: "no-cors",
      method: "POST",
      headers: {
      
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(password),
    })
    .then((response) => {return response})
    .catch((error) => console.log(error));
  } catch (error) {
    console.warn("error", error);
  }
};