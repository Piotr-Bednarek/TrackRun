import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleRedirectToLoginPage = () => {
    console.log("Redirect to login page");
    navigate("/login");
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
      }}
    >
      <h1>This is the landing page!</h1>
      <h1>Go to the login page</h1>
      <button onClick={() => handleRedirectToLoginPage()}>LOGIN PAGE</button>
    </div>
  );
}
