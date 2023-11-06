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
import { useContext, useEffect, useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { AuthContext } from "utils/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TiPencil, TiTrash, TiPlus } from "react-icons/ti";
import { BASE_URL } from "utils/config";

const Index = (props) => {
  const {
    cashFlow,
    cash,
    userData,
    accountData,
    getInputDetails,
    addCashFlow,
    toastrMsg,
    toastrError,
    setToastrError,
    setToastrMsg,
    editCashFlow,
    deleteCashFlow,
  } = useContext(AuthContext);
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [isOpen, setIsOpen] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [id, setId] = useState("");
  const [fromType, setFromType] = useState("1");
  const [toType, setToType] = useState("1");
  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");
  const [amount, setAmount] = useState(null);
  const [note, setNote] = useState("");
  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");
  const [file3, setFile3] = useState("");
  const [fileDisplay1, setFileDisplay1] = useState("");
  const [fileDisplay2, setFileDisplay2] = useState("");
  const [fileDisplay3, setFileDisplay3] = useState("");

  const [balance, setBalance] = useState(0);
  const [edit, setEdit] = useState(false);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  useEffect(() => {
    cash();
    getInputDetails();
  }, []);

  useEffect(() => {
    console.log(cashFlow);
  }, [cashFlow]);

  const reset = () => {
    setId("");
    setFromType("1");
    setToType("1");
    setFromUser("");
    setToUser("");
    setFile1("");
    setFile2("");
    setFile3("");
    setNote("");
    setFileDisplay1("");
    setFileDisplay2("");
    setFileDisplay3("");
    setAmount(null);
  };

  useEffect(() => {
    if (toastrMsg) {
      toast.success(toastrMsg);
      setIsOpen(false);
      reset();
      setToastrMsg(null);
    } else if (toastrError) {
      toast.error(toastrError);
      setToastrError(null);
    }
  }, [toastrMsg, toastrError, setToastrMsg, setToastrError]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const delToggle = () => {
    setIsDelOpen(!isDelOpen);
  };

  const handleEdit = (
    id,
    fromType,
    fromInternal,
    fromExternal,
    fromAccount,
    toType,
    toInternal,
    toExternal,
    toAccount,
    note,
    amount,
    file1,
    file2,
    file3
  ) => {
    console.log(file1, file2, file3);
    setId(id);
    setFromType(fromType);
    if (fromInternal) {
      setFromUser(fromInternal.id);
    } else if (fromExternal) {
      setFromUser(fromExternal);
    } else if (fromAccount) {
      setFromUser(fromAccount);
    }

    setToType(toType);
    if (toInternal) {
      setToUser(toInternal.id);
    } else if (toExternal) {
      setToUser(toExternal);
    } else if (toAccount) {
      setToUser(toAccount.id);
    }

    setNote(note);
    setAmount(amount);
    if (file1) {
      setFile1("populated");
      setFileDisplay1(file1);
    }
    if (file2) {
      setFile2("populated");
      setFileDisplay2(file2);
    }
    if (file3) {
      setFile3("populated");
      setFileDisplay3(file3);
    }

    toggle();
  };

  const submitCashFlow = (sendEdit = false) => {
    if (
      amount !== "" &&
      toType !== "" &&
      toUser !== "" &&
      fromType !== "" &&
      fromUser !== ""
    ) {
      // if (
      //   calculateBalance(
      //     cashFlow,
      //     JSON.parse(localStorage.getItem("userInfo"))?.userId
      //   ) === 0
      // ) {
      //   return;
      // } else {
      const formData = new FormData();
      if (file1) {
        console.log(file1);
        formData.append("file1", file1);
      }
      if (file2) {
        formData.append("file2", file2);
      }
      if (file3) {
        formData.append("file3", file3);
      }
      if (note) {
        formData.append("note", note);
      }
      formData.append("fromType", fromType);
      formData.append("toType", toType);
      formData.append("fromUser", fromUser);
      formData.append("toUser", toUser);
      formData.append("amount", amount);
      console.log(formData);
      if (edit) {
        editCashFlow(id, formData);
      } else {
        addCashFlow(formData);
      }
      // setIsOpen(false);
      // setToType("");
      // setToUser("");
      // setAmount("");
      // }
    }
  };

  function calculateBalance(cashFlow, userId) {
    let balance = 0;

    cashFlow.map((x) => {
      if (x.to_type === "1" && x.to_internal.id === userId) {
        balance += +x.amount;
      } else if (x.from_type === "1" && x.from_internal.id === userId) {
        balance -= +x.amount;
      }
    });

    return balance;
  }

  function formatDateToCustomFormat(isoDate) {
    const options = {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      year: "numeric",
      minute: "2-digit",
      second: "2-digit",
    };

    const date = new Date(isoDate);
    const formattedDate = date.toLocaleString("en-US", options);

    return formattedDate;
  }

  return (
    <>
      <Header />
      <Container className="mt--9" fluid>
        {/* <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
               
                <div className="chart">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
        <Row>
          <ToastContainer />
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow" style={{ height: "42rem" }}>
              <CardHeader className="border-0">
                <Row className="align-items-center justify-content-end">
                  {/* <div className="col">
                    <h3 className="mb-0">Page visits</h3>
                  </div> */}
                  {/* <Badge
                    color="info"
                    className="text-dark mr-5"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    {cashFlow &&
                      `Balance:  ${calculateBalance(
                        cashFlow,
                        JSON.parse(localStorage.getItem("userInfo"))?.userId
                      )}`}
                  </Badge> */}

                  <Button
                    color="primary"
                    onClick={(e) => {
                      setEdit(false);
                      toggle();
                      e.preventDefault();
                      reset();
                    }}
                    size="sm"
                  >
                    Add Cash Flow
                  </Button>
                  <Modal isOpen={isOpen} toggle={toggle} size="xl">
                    <ModalHeader toggle={toggle}>
                      {edit ? `Edit Record` : `Add Record`}
                    </ModalHeader>
                    <ModalBody>
                      <Form>
                        <Row className="d-flex flex-wor justify-content-center align-items-center">
                          <Col>
                            <FormGroup>
                              <Label for="to_type">Type</Label>
                              <Input
                                type="select"
                                name="to_type"
                                id="to_type"
                                value={fromType}
                                onChange={(event) => {
                                  setFromType(event.target.value);
                                  setFromUser("");
                                }}
                              >
                                <option value="1">Internal</option>
                                <option value="2">Account</option>
                                <option value="3">External</option>
                              </Input>
                            </FormGroup>
                            <FormGroup>
                              <Label for="to_user">From:</Label>
                              {(fromType === "1" && (
                                <Input
                                  type="select"
                                  name="to_user"
                                  id="to_user"
                                  value={fromUser}
                                  onChange={(event) => {
                                    console.log(event, event.target.value);
                                    setFromUser(event.target.value);
                                  }}
                                >
                                  <option value="" disabled>
                                    Select
                                  </option>
                                  {userData &&
                                    userData
                                      .filter(
                                        (x) =>
                                          x.id !==
                                          JSON.parse(
                                            localStorage.getItem("userInfo")
                                          )?.userId
                                      )
                                      .map((x, i) => {
                                        return (
                                          <option value={x.id}>
                                            {`${x.first_name} ${x.last_name}`}
                                          </option>
                                        );
                                      })}
                                </Input>
                              )) ||
                                (fromType === "2" && (
                                  <Input
                                    type="select"
                                    name="to_user"
                                    id="to_user"
                                    value={fromUser}
                                    onChange={(event) => {
                                      console.log(event, event.target.value);
                                      setFromUser(event.target.value);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Select
                                    </option>
                                    {accountData &&
                                      accountData.map((x, i) => {
                                        return (
                                          <option value={x.id}>
                                            {x.account_name}
                                          </option>
                                        );
                                      })}
                                  </Input>
                                )) ||
                                (fromType === "3" && (
                                  <Input
                                    type="text"
                                    name="to_user"
                                    id="to_user"
                                    value={fromUser}
                                    onChange={(event) => {
                                      console.log(event, event.target.value);
                                      setFromUser(event.target.value);
                                    }}
                                  />
                                ))}
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup>
                              <Label for="to_type">Type</Label>
                              <Input
                                type="select"
                                name="to_type"
                                id="to_type"
                                value={toType}
                                onChange={(event) => {
                                  setToType(event.target.value);
                                  setToUser("");
                                }}
                              >
                                <option value="1">Internal</option>
                                <option value="2">Account</option>
                                <option value="3">External</option>
                              </Input>
                            </FormGroup>
                            <FormGroup>
                              <Label for="to_user">To:</Label>
                              {(toType === "1" && (
                                <Input
                                  type="select"
                                  name="to_user"
                                  id="to_user"
                                  value={toUser}
                                  onChange={(event) => {
                                    console.log(event, event.target.value);
                                    setToUser(event.target.value);
                                  }}
                                >
                                  <option value="" disabled>
                                    Select
                                  </option>
                                  {userData &&
                                    userData
                                      .filter(
                                        (x) =>
                                          x.id !==
                                          JSON.parse(
                                            localStorage.getItem("userInfo")
                                          )?.userId
                                      )
                                      .map((x, i) => {
                                        return (
                                          <option value={x.id}>
                                            {`${x.first_name} ${x.last_name}`}
                                          </option>
                                        );
                                      })}
                                </Input>
                              )) ||
                                (toType === "2" && (
                                  <Input
                                    type="select"
                                    name="to_user"
                                    id="to_user"
                                    value={toUser}
                                    onChange={(event) => {
                                      console.log(event, event.target.value);
                                      setToUser(event.target.value);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Select
                                    </option>
                                    {accountData &&
                                      accountData.map((x, i) => {
                                        return (
                                          <option value={x.id}>
                                            {x.account_name}
                                          </option>
                                        );
                                      })}
                                  </Input>
                                )) ||
                                (toType === "3" && (
                                  <Input
                                    type="text"
                                    name="to_user"
                                    id="to_user"
                                    value={toUser}
                                    onChange={(event) => {
                                      console.log(event, event.target.value);
                                      setToUser(event.target.value);
                                    }}
                                  />
                                ))}
                            </FormGroup>
                          </Col>
                        </Row>

                        <FormGroup>
                          <Label for="amount">Amount</Label>
                          <Input
                            type="number"
                            name="amount"
                            id="amount"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="note">Note</Label>
                          <Input
                            type="textarea"
                            name="note"
                            id="note"
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="file">Image Upload</Label>

                          <Row>
                            <Col>
                              {fileDisplay1 ? (
                                <>
                                  <a
                                    href={`${BASE_URL}${fileDisplay1}`}
                                    target="_blank"
                                  >
                                    {BASE_URL}
                                    {fileDisplay1}
                                  </a>
                                  <Label
                                    className="file-input-button"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Input
                                      type="file"
                                      name="file"
                                      style={{ display: "none" }}
                                      onChange={(event) => {
                                        setFile1(event.target.files[0]);
                                        setFileDisplay1(
                                          event.target.files[0].name
                                        );
                                      }}
                                    />
                                    <TiPencil />
                                  </Label>
                                  <TiTrash
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setFile1("");
                                      setFileDisplay1("");
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <Label
                                    className="file-input-button"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Input
                                      type="file"
                                      name="file"
                                      style={{ display: "none" }}
                                      onChange={(event) => {
                                        setFile1(event.target.files[0]);
                                        setFileDisplay1(
                                          event.target.files[0].name
                                        );
                                      }}
                                    />
                                    <TiPlus /> Add Image
                                  </Label>
                                </>
                              )}
                            </Col>
                          </Row>

                          <Row>
                            <Col>
                              {fileDisplay2 ? (
                                <>
                                  <a
                                    href={`${BASE_URL}${fileDisplay2}`}
                                    target="_blank"
                                  >
                                    {BASE_URL}
                                    {fileDisplay2}
                                  </a>
                                  <Label
                                    className="file-input-button"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Input
                                      type="file"
                                      name="file"
                                      style={{ display: "none" }}
                                      onChange={(event) => {
                                        setFile2(event.target.files[0]);
                                        setFileDisplay2(
                                          event.target.files[0].name
                                        );
                                      }}
                                    />
                                    <TiPencil />
                                  </Label>
                                  <TiTrash
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setFile2("");
                                      setFileDisplay2("");
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <Label
                                    className="file-input-button"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Input
                                      type="file"
                                      name="file"
                                      style={{ display: "none" }}
                                      onChange={(event) => {
                                        setFile2(event.target.files[0]);
                                        setFileDisplay2(
                                          event.target.files[0].name
                                        );
                                      }}
                                    />
                                    <TiPlus /> Add Image
                                  </Label>
                                </>
                              )}
                            </Col>
                          </Row>

                          <Row>
                            <Col>
                              {fileDisplay3 ? (
                                <>
                                  <a
                                    href={`${BASE_URL}${fileDisplay3}`}
                                    target="_blank"
                                  >
                                    {BASE_URL}
                                    {fileDisplay3}
                                  </a>
                                  <Label
                                    className="file-input-button"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Input
                                      type="file"
                                      name="file"
                                      style={{ display: "none" }}
                                      onChange={(event) => {
                                        setFile3(event.target.files[0]);
                                        setFileDisplay3(
                                          event.target.files[0].name
                                        );
                                      }}
                                    />
                                    <TiPencil />
                                  </Label>
                                  <TiTrash
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setFile3("");
                                      setFileDisplay3("");
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <Label
                                    className="file-input-button"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Input
                                      type="file"
                                      name="file"
                                      style={{ display: "none" }}
                                      onChange={(event) => {
                                        setFile3(event.target.files[0]);
                                        setFileDisplay3(
                                          event.target.files[0].name
                                        );
                                      }}
                                    />
                                    <TiPlus /> Add Image
                                  </Label>
                                </>
                              )}
                            </Col>
                          </Row>

                          {/* {fileDisplay2 && (
                                <Row>
                                  <Col>
                                    <a
                                      href={`${BASE_URL}${fileDisplay2}`}
                                      target="_blank"
                                    >
                                      {BASE_URL}
                                      {fileDisplay2}
                                    </a>
                                    <Label
                                      className="file-input-button"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <Input
                                        type="file"
                                        name="file"
                                        style={{ display: "none" }}
                                        onChange={(event) => {
                                          setFile3(event.target.files[0]);
                                        }}
                                      />
                                      <TiPencil />
                                    </Label>
                                  </Col>
                                </Row>
                              )}
                              {fileDisplay3 && (
                                <Row>
                                  <Col>
                                    <a
                                      href={`${BASE_URL}${fileDisplay3}`}
                                      target="_blank"
                                    >
                                      {BASE_URL}
                                      {fileDisplay3}
                                    </a>
                                    <Label
                                      className="file-input-button"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <Input
                                        type="file"
                                        name="file"
                                        style={{ display: "none" }}
                                        onChange={(event) => {
                                          console.log(event.target.files[0]);
                                          setFile3(event.target.files[0]);
                                        }}
                                      />
                                      <TiPencil />
                                    </Label>
                                  </Col>
                                </Row>
                              )} */}
                        </FormGroup>
                      </Form>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="primary"
                        onClick={() => {
                          submitCashFlow(true);
                        }}
                      >
                        Submit
                      </Button>
                      <Button color="secondary" onClick={() => toggle()}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Row>
              </CardHeader>
              <div style={{ maxHeight: "100%", overflowY: "auto" }}>
                <Modal isOpen={isDelOpen} toggle={delToggle}>
                  <ModalHeader toggle={delToggle}>Delete User</ModalHeader>
                  <ModalBody>
                    <Form>
                      <h4>Are you sure you want to delete this record?</h4>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() => {
                            deleteCashFlow(id);
                            delToggle();
                            setId("");
                          }}
                        >
                          Delete
                        </Button>
                        <Button color="secondary" onClick={() => delToggle()}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Form>
                  </ModalBody>
                </Modal>
                <Table className="align-items-center" style={{}}>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Lender</th>
                      <th scope="col">Borrower</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Entered By</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cashFlow &&
                      cashFlow.map((x) => {
                        return (
                          <tr>
                            <th scope="row">
                              {formatDateToCustomFormat(x.created_at)}
                            </th>
                            <td>
                              {(x.from_type === "1" &&
                                `${x.from_internal.first_name} ${x.from_internal.last_name}(internal)`) ||
                                (x.from_type === "2" &&
                                  `${x.from_account.account_name}(account)`) ||
                                (x.from_type === "3" &&
                                  `${x.from_external}(external)`)}
                            </td>
                            <td>
                              {(x.to_type === "1" &&
                                `${x.to_internal.first_name} ${x.to_internal.last_name}(internal)`) ||
                                (x.to_type === "2" &&
                                  `${x.to_account.account_name}(account)`) ||
                                (x.to_type === "3" &&
                                  `${x.to_external}(external)`)}
                            </td>
                            <td>{x.amount}</td>
                            <td>{`${x.entered_by.first_name} ${x.entered_by.last_name}`}</td>
                            <td>
                              <Row>
                                <Button
                                  color="info"
                                  className="rounded-circle btn-info text-white btn-sm "
                                  onClick={() => {
                                    reset();
                                    setEdit(true);
                                    handleEdit(
                                      x.id,
                                      x.from_type,
                                      x.from_internal,
                                      x.from_external,
                                      x.from_account,
                                      x.to_type,
                                      x.to_internal,
                                      x.to_external,
                                      x.to_account,
                                      x.note,
                                      x.amount,
                                      x.file_upload1,
                                      x.file_upload2,
                                      x.file_upload3
                                    );
                                  }}
                                >
                                  <TiPencil />
                                </Button>

                                <Button
                                  color="danger"
                                  className="rounded-circle btn-circle text-white btn-sm"
                                  onClick={() => {
                                    setId(x.id);
                                    delToggle();
                                  }}
                                >
                                  <TiTrash />
                                </Button>
                              </Row>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
          {/* <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Social traffic</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Referral</th>
                    <th scope="col">Visitors</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>1,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">60%</span>
                        <div>
                          <Progress
                            max="100"
                            value="60"
                            barClassName="bg-gradient-danger"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>5,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">70%</span>
                        <div>
                          <Progress
                            max="100"
                            value="70"
                            barClassName="bg-gradient-success"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Google</th>
                    <td>4,807</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">80%</span>
                        <div>
                          <Progress max="100" value="80" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Instagram</th>
                    <td>3,678</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">75%</span>
                        <div>
                          <Progress
                            max="100"
                            value="75"
                            barClassName="bg-gradient-info"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">twitter</th>
                    <td>2,645</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">30%</span>
                        <div>
                          <Progress
                            max="100"
                            value="30"
                            barClassName="bg-gradient-warning"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col> */}
        </Row>
      </Container>
    </>
  );
};

export default Index;
