
import axios from "axios";
import { baseUrl} from "./ApiConfig";


export const GoogleAuth = (Payload) => {
    // console.log("payload", Payload)
    let data = JSON.stringify(Payload);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/auth/google-login`,
  
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
export const ForgotPassword = (Payload) => {
    console.log("payload", Payload)
    let data = JSON.stringify(Payload);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/user/forgot-password`,
  
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
export const VerifyOTPApi = (Payload) => {
    console.log("payload", Payload)
    let data = JSON.stringify(Payload);
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/user/verify-otp`,
  
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
export const RegisterApi = (Payload) => {
    console.log("payload", Payload)
    let data = JSON.stringify(Payload);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/user/create`,
  
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };

export const GetFreands = (token) => {
    let config = {
      method: "GET",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/friends/all-friends`,

      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };

export const GetAddress = (token) => {

    let config = {
      method: "GET",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/user/all-saved-address`,

      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },

    
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
export const DeleteAddress = (id, token) => {

    let config = {
      method: "DELETE",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/user/delete-address/${id}`,

      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },

    
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
};


export const AddressApi = (token, Payload) => {
    console.log("payload", Payload, token)
    let data = JSON.stringify(Payload);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/user/create-address`,
  
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
export const LoginApi = (Payload) => {
    console.log("payload", Payload)
    let data = JSON.stringify(Payload);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/auth/login`,
  
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };

export const GoogleLoginApi = (Payload) => {
    console.log("payload", Payload)
    let data = JSON.stringify(Payload);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/auth/google-login`,
  
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };


  export const GetUserProfile = (token) => {

    let config = {
      method: "GET",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/user/profile`,

      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },

    
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };


  export const UpdateProfileAPI = (token, Payload) => {
    let data = JSON.stringify(Payload);

    let config = {
      method: "PATCH",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/user/update-profile`,

      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      data: data,

    
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
export const UpdateProfileImgAPI = (token, image) => {
    let data = JSON.stringify(image);

    let config = {
      method: "POST",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/user/upload-image`,

      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      data: data,

    
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
export const StartTripApi = (token, Payload) => {
    let data = JSON.stringify(Payload);

    console.log(data, "dattttta")

    let config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/v1/trip/create`,
      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      data: data,    
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
 
export const TriggerAdrinoApi = (token, Payload) => {
    let data = JSON.stringify(Payload);

    let config = {
      method: "PATCH",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/trip/update-trip`,

      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      data: data,

    
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
 
  export const GetDistanceGoogleAPI = (Payload) => {
    let apiKey= "AIzaSyC_mNS2ZuW5Lo3VEgFsvOSPIORNAOivMSo"

    console.log("apiKey~Payload", Payload)
    
    let config = {
      method: "GET",
      maxBodyLength: Infinity,
  
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${Payload.origin}&destinations=${Payload.destination}&key=${apiKey}&mode=driving&units=metric`,

      headers: {
        "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
      },
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
  export const SendAddressAPI = (token, Payload) => {

    console.log("tokenn", token)
    let data = JSON.stringify(Payload);

    let config = {
      method: "POST",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/notification/create`,

      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      data: data,

    
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
  export const GetNotificationAPI = (token) => {

  
   console.log("object", token)
    let config = {
      method: "Get",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}/api/v1/notification/all`,

      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
    

    
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
