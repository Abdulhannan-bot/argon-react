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

import { AuthContext } from "utils/AuthContext";

const SignedIn = () => {
  return (
    <>
      <Col lg="10" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h4>
                An email is en route with everything you need to get started.
              </h4>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default SignedIn;
