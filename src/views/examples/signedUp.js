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
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "utils/AuthContext";

const SignedUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const param = searchParams.get("signedUp");
  if (param !== "signed") {
    navigate("/auth/register/signed");
  }
  return (
    <>
      <ToastContainer />
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h4>
                A temporary password has been sent to your registered email.
                Click <Link to="/login">here</Link> to Login.
              </h4>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default SignedUp;
