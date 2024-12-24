import { useContext, useEffect, useState } from "react";
import {
  GET_GetLoggedUser,
  POST_CreatePerson,
  PUT_ChangePhoto,
  PUT_Logout,
} from "../requests";
import { AuthContext } from "./root";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants";

export default function Profile() {
  const navigate = useNavigate();
  const { setAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  useEffect(() => {
    GET_GetLoggedUser().then((loggedUser) => setUser(loggedUser));
  }, []);

  const logout = function () {
    PUT_Logout().then(() => {
      setAuthenticated(false);
      navigate("/auth");
    });
  };

  const [photoPath, setPhotoPath] = useState("");
  useEffect(() => {
    if (user != null) {
      setPhotoPath(
        BACKEND_URL + `/user/id/${user.id}/photo?hash=${Date.now()}`,
      );
    }
  }, [user]);

  const updatePhoto = function () {
    if (user != null) {
      setPhotoPath(
        BACKEND_URL + `/user/id/${user.id}/photo?hash=${Date.now()}`,
      );
    }
  };

  const [selectedFile, setSelectedFile] = useState("");
  const uploadFile = function () {
    if (user != null) {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      PUT_ChangePhoto(formData).then(() => {
        updatePhoto();
      });
    }
  };

  const [newPersonName, setNewPersonName] = useState("");
  const addPerson = function () {
    if (user != null) {
      POST_CreatePerson(newPersonName).then((person) => {
        setResultText(`Successful! New personID: ${person.ID}`);
      });
    }
  };
  const [resultText, setResultText] = useState("");

  return (
    <>
      {user ? (
        <>
          <div>{user.email}</div>{" "}
          <div>
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
          </div>
          <div>
            <input
              type="text"
              onChange={(e) => {
                setNewPersonName(e.target.value);
              }}
            />
            <button type="button" onClick={addPerson}>
              Add person
            </button>
            <p>{resultText}</p>
          </div>
        </>
      ) : (
        "Loading..."
      )}
      <button onClick={logout}>Logout</button>
    </>
  );
}
