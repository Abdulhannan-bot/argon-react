import { useContext, useEffect, useState } from "react";
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
import { useSearchParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "utils/AuthContext";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("t");
  const { register, userInfo } = useContext(AuthContext);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passStrength, setPassStrength] = useState(1);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  console.log(query);

  function checkPasswordStrength(password) {
    // Define regex patterns to check for uppercase, lowercase, numbers, and special characters
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

    // Check the length of the password
    const isLengthValid = password.length >= 8;

    // Determine the strength based on the criteria
    if (
      hasUppercase &&
      hasLowercase &&
      hasNumbers &&
      hasSpecialChars &&
      isLengthValid
    ) {
      setPassStrength(3);
    } else if ((hasUppercase || hasLowercase) && hasNumbers && isLengthValid) {
      setPassStrength(2);
    } else {
      setPassStrength(1);
    }
  }

  function checkComplete() {
    if (password1 !== "" && password2 !== "") {
      setDisabled(false);
    }
  }

  function handleClick(password1, password2) {
    toast.success("hello");
    // navigate("/admin/icons");
    if (password1 !== "" && password2 !== "" && password1 === password2) {
      setPassword(password1, password2);
      // navigate("/admin/icons");
      // if (JSON.parse(localStorage.getItem("userInfo"))?.token) {
      //   console.log("entered");
      // }
      // console.log(userInfo);
    }
  }

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("userToken"))) {
      navigate("/admin");

      setUsername("");
      setPassword("");
    }
  });

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("userToken")));
    if (userInfo !== null) {
    }
    if (JSON.parse(localStorage.getItem("userInfo"))?.token) {
      console.log("logged the user in");
    }
  }, [userInfo]);
  return (
    <>
      <ToastContainer />
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form">
              {password1 && (
                <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    {(passStrength === 1 && (
                      <span className="text-danger font-weight-700">weak</span>
                    )) ||
                      (passStrength === 2 && (
                        <span className="text-info font-weight-700">
                          moderate
                        </span>
                      )) ||
                      (passStrength === 3 && (
                        <span className="text-success font-weight-700">
                          strong
                        </span>
                      ))}
                  </small>
                </div>
              )}

              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="New Password"
                    type="password"
                    autoComplete="new-password"
                    value={password1}
                    onChange={(event) => {
                      setPassword1(event.target.value);
                      checkComplete();
                      checkPasswordStrength(event.target.value);
                    }}
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Re-Enter Password"
                    type="password"
                    autoComplete="new-password"
                    value={password2}
                    onChange={(event) => {
                      setPassword2(event.target.value);
                      checkComplete();
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button
                  disabled={disabled}
                  className="my-4"
                  color="primary"
                  type="button"
                  onClick={() => handleClick(password1, password2)}
                >
                  Set Password
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default SetPassword;
