/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "react-notifications-component";
import queryString from "query-string";
import Cookies from "js-cookie";
import axios from "axios";
import Spinner from "../UI/Spinner";
import notification from "../../utility/notification";
import { get } from "../../utility/fetchClinic";

const Connect = () => {
  const [loading, setLoading] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const ModuleName = "Nurse";

  const renderTimeoutMessage = () => {
    window.location.assign(`${Cookies?.get("homeLink")}`);
    notification({ message: "Timed out please try again", type: "error" });
  };

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setShowTimeoutMessage(true);
  //   }, 60000);

  //   return () => clearTimeout(timeout);
  // }, []);

  const checkurl = () => {
    const parsed = queryString.parse(location?.search);

    console.log(parsed);

    // check if there is a jwt token saved before
    const AccessToken = Cookies.get(`${ModuleName}_AccessToken`);
    const AppToken = Cookies.get(`${ModuleName}_AppToken`);
    const baseurl = parsed?.base;
    const iSStandalone = parsed?.isStandalone === "true";

    Cookies.set("baseUrl", baseurl);
    Cookies.set("helpLink", `${parsed?.help}#page=63`);

    if (parsed?.emp !== "") {
      setLoading(true);

      const authurl = "/medicals/api/Auth/Auth/";
      console.log(authurl);
      // return;

      const apiUrl =
        iSStandalone === "true" || iSStandalone === true
          ? `${baseurl}${authurl}?AuthToken=${parsed?.emp}&iSStandalone=${iSStandalone}`
          : `${baseurl}${authurl}?AuthToken=${parsed?.emp}`;

      axios
        .post(apiUrl, {
          headers: {
            "Access-Control-Allow-Credentials": true,
            crossorigin: true,
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          const user_auth = response?.data;

          // getProfiles(user_auth?.clinicId)

          sessionStorage.setItem("token", user_auth?.jwt?.token);
          sessionStorage.setItem("clinicId", user_auth?.clinicId);
          sessionStorage.setItem("userId", user_auth?.employeeId);
          localStorage.setItem("nurseRole", user_auth?.role);
          localStorage.setItem("USER_INFO", JSON?.stringify(user_auth));
          sessionStorage.setItem("isAdmin", user_auth?.isAdmin);

          const loginTime = new Date().getTime();
          localStorage.setItem("LOGIN_TIME", loginTime);

          Cookies.set(`${ModuleName}_AppToken`, user_auth?.jwt?.token, {
            // expires: 0.0416665,
          });
          Cookies.set("homeLink", user_auth?.homeLink);
          Cookies.set(`${ModuleName}_AccessToken`, parsed?.emp);
          Cookies.set("_APIBaseURL", parsed?.base);
          Cookies.set("tokenExist", true,
            //  { expires: 0.0416665 }
            );
          navigate("/dashboard"); // Redirect to dashboard

          // if (AppToken) {
          //   setLoading(false);
          //   navigate("/dashboard"); // Redirect to dashboard
          // }
          // else {
          //   // setLoading(false);
          //   store?.addNotification({
          //     title: "Error!",
          //     message: user_auth?.message,
          //     type: "danger",
          //     insert: "bottom",
          //     container: "bottom-left",
          //     animationIn: ["animate__animated", "animate__fadeIn"],
          //     animationOut: ["animate__animated", "animate__fadeOut"],
          //     dismiss: {
          //       duration: 5000,
          //       onScreen: true,
          //     },
          //   });
          //   window.location.assign(`${Cookies?.get("homeLink")}`);
          // }
        })
        .catch((error) => {
          console.log(error);
          // setLoading(false);
          Cookies.set("_AppToken", null);
          Cookies.set("tokenExist", false);
          Cookies.set("_FullName", null);
          Cookies.set("_Role", null);
          Cookies.set("_Email", null);

          store?.addNotification({
            title: "Error!",
            message: "You Do Not Have Access To this Application!",
            type: "danger",
            insert: "bottom",
            container: "bottom-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
          window.location.assign(`${Cookies?.get("homeLink")}`);
        });
    }
  };

  const getProfiles = async (clinicId) => {
    const response = await get(`/clinic/${clinicId}`);
    localStorage.setItem("COMPANY_INFO", JSON?.stringify(response));
    // localStorage.setItem("nurseRole", user_auth?.role);
    console.log(response);

    // setFormData({ ...formData, ...response });
    //   setTotalPaginationLength(response.totalPages * 10)
  };

  useEffect(() => {
    checkurl();
  }, [Cookies.get(`${ModuleName}_AppToken`)]);

  return (
    <div
      className="w-100 flex flex-v-center flex-h-center"
      style={{ minHeight: "105vh" }}
    >
      {loading ? <Spinner /> : ""}
      {showTimeoutMessage && renderTimeoutMessage()}
    </div>
  );
};

export default Connect;
