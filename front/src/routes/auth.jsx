import { useContext, useState } from "react";
import { POST_Register, PUT_Login } from "../requests";
import { AuthContext } from "./root";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  /* Random number meaning:
   * authState = 0: Login
   * authState = 1: Signup
   * */
  const navigate = useNavigate();
  const { setAuthenticated } = useContext(AuthContext);
  const [authState, setAuthState] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  let login = function () {
    PUT_Login(email, password).then(() => {
      setAuthenticated(true);
      navigate("/profile");
    });
  };
  let register = function () {
    POST_Register(email, password, rePassword).then(() => {
      setAuthState(0);
    });
  };

  return (
    <>
      <div>
        <button
          onClick={() => {
            setAuthState(0);
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            setAuthState(1);
          }}
        >
          Register
        </button>
      </div>
      {authState == 0 && (
        <div>
          <h3>Login</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="first">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" onClick={login}>
              Login
            </button>
          </div>
        </div>
      )}
      {authState == 1 && (
        <div>
          <h3>Register</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="first">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="password">Repeat Password:</label>
            <input
              type="password"
              id="rePassword"
              name="rePassword"
              placeholder="Repeat your Password"
              required
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" onClick={register}>
              Register
            </button>
          </div>
        </div>
      )}
    </>
  );
}
