import { useState } from "react";

export default function Auth() {
  /* Random number meaning:
   * authState = 0: Login
   * authState = 1: Signup
   * */
  const [authState, setAuthState] = useState(0);
  return (
    <>
      <div>
        <button
          onClick={() => {
            setAuthState(0);
            console.log(authState);
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            setAuthState(1);
            console.log(authState);
          }}
        >
          Signup
        </button>
      </div>
      {authState == 0 && (
        <div>
          <h3>Login</h3>
          <form action="">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="first">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email"
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your Password"
                required
              />
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      )}
      {authState == 1 && (
        <div>
          <h3>Signup</h3>
          <form action="">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="first">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email"
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password1"
                name="password1"
                placeholder="Enter your Password"
                required
              />

              <label htmlFor="password">Repeat Password:</label>
              <input
                type="password"
                id="password2"
                name="password2"
                placeholder="Repeat your Password"
                required
              />
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
