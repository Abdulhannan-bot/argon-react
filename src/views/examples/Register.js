/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "utils/AuthContext";
import GoogleLogin from "react-google-login";

const Register = () => {
  const [params] = useSearchParams();
  const signedIn = params.get("signedIn");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const {
    register,
    isRegistered,
    token,
    verifyOtp,
    toastrMsg,
    toastrError,
    setToastrMsg,
    setToastrError,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOtp = () => {
    verifyOtp(token, otp);
  };

  const handleRegister = () => {
    if (name !== "" && company !== "" && email !== "") {
      register(email, name, company);
      // navigate("/auth/register/signedIn");
    }
  };

  const handleOnSuccess = (response) => {
    console.log("success");
    console.log(response?.profileObj?.email);
    alert("success");
  };

  const handleOnFailure = (response) => {
    console.log(response);
    alert(response);
  };

  useEffect(() => {
    if (isRegistered) {
      navigate("/auth/register/signed");
    }
  }, [isRegistered]);

  useEffect(() => {
    if (toastrMsg) {
      toast.success(toastrMsg);
      setToastrMsg(null);
    } else if (toastrError) {
      toast.error(toastrError);
      setToastrError(null);
    }
  }, [toastrMsg, toastrError, setToastrMsg, setToastrError]);
  return (
    <>
      <ToastContainer />
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>Sign up with</small>
            </div>
            <div className="text-center">
              <GoogleLogin
                clientId="248396148558-cl9f2vtpbjvlj1038584nn0r6u7mhivv.apps.googleusercontent.com"
                onSuccess={handleOnSuccess}
                onFailure={handleOnFailure}
                isLoggedIn={true}
              />
              {/* <Button
            className="btn-neutral btn-icon mr-4"
            color="default"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            <span className="btn-inner--icon">
              <img
                alt="..."
                src={
                  require("../../assets/img/icons/common/github.svg")
                    .default
                }
              />
            </span>
            <span className="btn-inner--text">Github</span>
          </Button> */}
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign up with credentials</small>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Name"
                    type="text"
                    onChange={(event) => setName(event.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-building" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Company"
                    type="text"
                    onChange={(event) => setCompany(event.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col className="text-center" xs="12">
                  <small>Account Created? </small>
                  <Link to="/auth/login">
                    <small>Login</small>
                  </Link>
                </Col>
              </Row>
              <div className="text-center">
                <Button
                  className="mt-4"
                  color="primary"
                  type="button"
                  onClick={() => handleRegister()}
                >
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
