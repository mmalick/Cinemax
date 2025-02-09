import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useUserAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (token && loginTime) {
      const now = Date.now();
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 dni w milisekundach

      if (now - Number(loginTime) > threeDaysInMs) {
        console.log("Token wygasł, wylogowywanie...");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("loginTime");
        navigate("/login"); // Przekierowanie na stronę logowania
      }
    }
  }, [navigate]); // Hook w useEffect zależy od navigate
};

export default useUserAuth;
