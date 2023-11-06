import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./config";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [toastrMsg, setToastrMsg] = useState(null);
  const [toastrError, setToastrError] = useState(null);
  const [token, setToken] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [contactsList, setContactsList] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [messages, setMessages] = useState(null);
  const [cashFlow, setCashFlow] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [bulkDataMsg, setBulkDataMsg] = useState(null);
  const [bulkDataError, setBulkDataError] = useState(null);

  const register = (email, name, company, password) => {
    axios
      .post(`${BASE_URL}/api/register/`, { email, name, company })
      .then((res) => {
        let incomingData = res.data;
        console.log(incomingData);
        if (incomingData.success) {
          setIsRegistered(true);
          setToastrMsg(incomingData.msg);
          setToastrError(null);
        } else if (!incomingData.success) {
          setToastrError(incomingData.msg);
          setToastrMsg(null);
        }
      })
      .catch((err) => {
        setToastrError("An error occured. Please try again");
        setToastrMsg(null);
      });
  };

  const verifyOtp = (token, otp) => {
    console.log(token);
    axios
      .post(`${BASE_URL}/api/verify-otp/`, { otp, token })
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          setToastrMsg(incomingData.msg);
          setToastrError(null);
        } else if (!incomingData.success) {
          setToastrError(incomingData.msg);
          setToastrMsg(null);
        }
      })
      .catch((err) => {
        setToastrError("An error occured. Please try again");
        setToastrMsg(null);
      });
  };

  const login = (username, password) => {
    axios
      .post(`${BASE_URL}/api/login/`, { username, password })
      .then((res) => {
        let incomingData = res.data;
        console.log(incomingData);
        if (incomingData.success) {
          localStorage.setItem("userInfo", JSON.stringify(incomingData));
          setToken(incomingData.token);
          setToastrMsg(incomingData.msg);
          setToastrError(null);
        } else if (!incomingData.success) {
          setToastrError(incomingData.msg);
          setToastrMsg(null);
        }
      })
      .catch((err) => {
        setToastrError("Login Failed");
        setToastrMsg(null);
      });
  };

  // const getToken = (userId) => {
  //   axios
  //     .get(`${BASE_URL}/api/get-user-token/${userId}/`)
  //     .then((res) => {
  //       let incomingData = res.data;
  //       if (incomingData.success) {
  //         setToken(incomingData.token);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("token error", err);
  //     });
  // };

  const contacts = () => {
    console.log(`Token ${JSON.parse(localStorage.getItem("userInfo"))?.token}`);
    axios
      .get(`${BASE_URL}/api/contacts-list/`, {
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("userInfo"))?.token
          }`,
        },
      })
      .then((res) => {
        setContactsList(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        console.warn(`contacts error: ${err}`);
      });
  };

  const getUsersList = () => {
    axios
      .get(`${BASE_URL}/api/users-list/`, {
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("userInfo"))?.token
          }`,
        },
      })
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          setUsersList(incomingData.users_list);
        }
      });
  };

  const addUser = (name, email, employeeId, type, department, designation) => {
    axios
      .post(
        `${BASE_URL}/api/add-user/`,
        {
          name,
          email,
          employeeId,
          type,
          department,
          designation,
        },
        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("userInfo"))?.token
            }`,
          },
        }
      )
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          getUsersList();
          setToastrMsg(incomingData.msg);
          setToastrError(null);
        } else if (!incomingData.success) {
          setToastrError(incomingData.msg);
          setToastrMsg(null);
        }
      })
      .catch((err) => {
        setToastrError("An error occured. Please try again later");
        setToastrMsg(null);
      });
  };

  const addBulkUser = (bulkData, company) => {
    const userBulkData = JSON.stringify(bulkData);
    axios
      .post(
        `${BASE_URL}/api/add-bulk-users/`,
        {
          userBulkData,
          company,
        },
        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("userInfo"))?.token
            }`,
          },
        }
      )
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          getUsersList();
          setBulkDataError(null);
          setBulkDataMsg(incomingData.msg);
        } else if (!incomingData.success) {
          setBulkDataMsg(null);
          setBulkDataError(incomingData.msg);
        }
      })
      .catch((err) => {
        setBulkDataMsg(null);
        setBulkDataError("An error occured");
      });
  };

  const editUser = (id, name, employeeId, type, department, designation) => {
    axios
      .post(
        `${BASE_URL}/api/edit-user/${id}/`,
        {
          name,
          employeeId,
          type,
          department,
          designation,
        },
        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("userInfo"))?.token
            }`,
          },
        }
      )
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          getUsersList();
          setToastrMsg(incomingData.msg);
          setToastrError(null);
        } else if (!incomingData.success) {
          setToastrError(incomingData.msg);
          setToastrMsg(null);
        }
      })
      .catch((err) => {
        setToastrError("An error occured. Please try again later");
        setToastrMsg(null);
      });
  };

  const deleteUser = (id) => {
    axios
      .post(
        `${BASE_URL}/api/delete-user/`,
        {
          id,
        },
        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("userInfo"))?.token
            }`,
          },
        }
      )
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          setToastrMsg(incomingData.msg);
          setToastrError(null);
        } else if (!incomingData.success) {
          setToastrError(incomingData.msg);
          setToastrMsg(null);
        }
      })
      .catch((err) => {
        setToastrError("An error occured. Please try again later");
        setToastrMsg(null);
      });
  };

  const cash = () => {
    axios
      .get(`${BASE_URL}/api/cash-flow-list/`, {
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("userInfo"))?.token
          }`,
        },
      })
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          setCashFlow(incomingData.data);
        }
      })
      .catch((err) => {
        console.warn(`cash error: ${err}`);
      });
  };

  useEffect(() => {
    if (userInfo?.userId) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, [userInfo]);

  const chatMessages = (toUser) => {
    axios
      .get(`${BASE_URL}/api/chat_room/${toUser}/`, {
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("userInfo"))?.token
          }`,
        },
      })
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.warn(`chatroom error: ${err}`);
      });
  };

  const getInputDetails = () => {
    axios
      .get(`${BASE_URL}/api/get_input_details/`, {
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("userInfo"))?.token
          }`,
        },
      })
      .then((res) => {
        console.log(res.data, res.data.users, res.data.accounts);
        setUserData(res.data.users);
        setAccountData(res.data.accounts);
      })
      .catch((err) => {
        console.warn(`input detail error: ${err}`);
      });
  };

  const addCashFlow = (formData) => {
    const enteredBy = JSON.parse(localStorage.getItem("userInfo"))?.userId;
    formData.append("enteredBy", enteredBy);
    axios
      .post(`${BASE_URL}/api/add_cash_flow/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("userInfo"))?.token
          }`,
        },
      })
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          setToastrError(null);
          setToastrMsg(incomingData.msg);
          cash();
        } else if (!incomingData.success) {
          setToastrMsg(null);
          setToastrError(incomingData.msg);
        }
      })
      .catch((err) => {
        setToastrMsg(null);
        setToastrError("An error occured");
      });
  };

  const editCashFlow = (id, formData) => {
    const enteredBy = JSON.parse(localStorage.getItem("userInfo"))?.userId;
    formData.append("enteredBy", enteredBy);
    axios
      .post(`${BASE_URL}/api/edit-cash-flow/${id}/`, formData, {
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("userInfo"))?.token
          }`,
        },
      })
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          cash();
          setToastrMsg(incomingData.msg);
          setToastrError(null);
        } else if (!incomingData.success) {
          setToastrError(incomingData.msg);
          setToastrMsg(null);
        }
      })
      .catch((err) => {
        setToastrError("An error occured. Please try again later");
        setToastrMsg(null);
      });
  };

  const deleteCashFlow = (id) => {
    axios
      .post(
        `${BASE_URL}/api/delete-cash-flow/`,
        {
          id,
        },
        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("userInfo"))?.token
            }`,
          },
        }
      )
      .then((res) => {
        let incomingData = res.data;
        if (incomingData.success) {
          cash();
          setToastrMsg(incomingData.msg);
          setToastrError(null);
        } else if (!incomingData.success) {
          setToastrError(incomingData.msg);
          setToastrMsg(null);
        }
      })
      .catch((err) => {
        setToastrError("An error occured. Please try again later");
        setToastrMsg(null);
      });
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("sendTo");
    setLoggedOut(true);
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        contactsList,
        messages,
        cashFlow,
        userData,
        accountData,
        toastrMsg,
        toastrError,
        token,
        isRegistered,
        usersList,
        loggedOut,
        bulkDataMsg,
        bulkDataError,
        deleteCashFlow,
        editCashFlow,
        deleteUser,
        editUser,
        setBulkDataMsg,
        setBulkDataError,
        addBulkUser,
        addUser,
        getUsersList,
        setToastrMsg,
        setToastrError,
        verifyOtp,
        register,
        addCashFlow,
        getInputDetails,
        cash,
        chatMessages,
        contacts,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
