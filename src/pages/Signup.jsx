import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.config";
import { db } from "../firebase.config";
import { toast } from "react-toastify";



const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const storageRef = ref(storage, `images/${Date.now() + username}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            toast.error(error.message, {
              style: { background: "#1F5F5B" },
              progressStyle: { background: "#75CE9F" },
            });
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then(async (downloadURL) => {
                await updateProfile(user, {
                  displayName: username,
                  photoURL: downloadURL,
                });

                await setDoc(doc(db, "users", user.uid), {
                  uid: user.uid,
                  displayName: username,
                  email,
                  photoURL: downloadURL,
                });

                resolve();
              })
              .catch((error) => {
                toast.error(error.message, {
                  style: { background: "#1F5F5B" },
                  progressStyle: { background: "#75CE9F" },
                });
                reject(error);
              });
          }
        );
      });

      setLoading(false);
      toast.success("Account created.", {
        style: { background: "#1F5F5B" },
        progressStyle: { background: "#75CE9F" },
      });
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.success("Something went wrong.", {
        style: { background: "#1F5F5B" },
        progressStyle: { background: "#75CE9F" },
      });
    }
  };

  return (
    <Helmet title="Sign Up">
      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading...</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Sign Up</h3>
                <Form className="auth__form" onSubmit={signup}>
                  <FormGroup className="form__group">
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </FormGroup>
                  <button type="submit" className="auth__btn">
                    Create an Account
                  </button>
                  <p>
                    Already have an account? {""}
                    <Link to="/Login">Log In</Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;
