import { useEffect, useState } from "react";
import { GET_Photo, PUT_ChangePhoto } from "../requests";

export default function Auth() {
  /* Random number meaning:
   * authState = 0: Login
   * authState = 1: Signup
   * */
  const [authState, setAuthState] = useState(0);

  const [photoPath, setPhotoPath] = useState("");
  useEffect(() => {
    GET_Photo(1).then((photo) => setPhotoPath(URL.createObjectURL(photo)));
  }, []);

  const [selectedFile, setSelectedFile] = useState("");
  const uploadFile = function () {
    const formData = new FormData();
    formData.append("photo", selectedFile);
    PUT_ChangePhoto(1, formData).then(() => {
      GET_Photo(1).then((photo) => setPhotoPath(URL.createObjectURL(photo)));
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
      {photoPath != "" ? <img src={photoPath} /> : "Loading..."}
      <input
        type="file"
        onChange={(e) => {
          setSelectedFile(e.target.files[0]);
        }}
      />
      <button type="button" onClick={uploadFile}>
        Upload
      </button>
    </>
  );
}
