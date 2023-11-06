import { useContext, useEffect, useState, useRef } from "react";
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
  InputGroup,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TiPencil, TiTrash } from "react-icons/ti";
// import { Handsontable } from "@handsontable/react";
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
// import "handsontable/dist/handsontable.full.min.css";
// import { registerAllModules } from "handsontable/registry";
import { registerAllModules } from "handsontable/registry";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { AuthContext } from "utils/AuthContext";
import { buildData } from "@integration-app/sdk";

registerAllModules();
// registerAllModules();
const UsersList = (props) => {
  const {
    getUsersList,
    usersList,
    addUser,
    toastrMsg,
    toastrError,
    setToastrMsg,
    setToastrError,
    addBulkUser,
    editUser,
    bulkDataMsg,
    bulkDataError,
    setBulkDataMsg,
    setBulkDataError,
    deleteUser,
  } = useContext(AuthContext);
  const [activeNav, setActiveNav] = useState(1);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("1");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [isOpen, setIsOpen] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [fadeEmail, setFadeEmail] = useState(false);
  const hotTableRef = useRef(null);

  const colkeys = [
    "name",
    "email",
    "employee_id",
    "user_type",
    "department",
    "designation",
  ];

  const colHeading = colkeys.map((x) => {
    return x
      .split("_")
      .map((y) => {
        if (y === "id") {
          return y.toUpperCase();
        } else {
          return y.charAt(0).toUpperCase() + y.slice(1);
        }
      })
      .join(" ");
  });

  console.log(colHeading);

  const bulkData = [];

  for (let i = 0; i < 15; i++) {
    bulkData.push(["", "", "", "", "", ""]);
  }

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  useEffect(() => {
    getUsersList();
  }, []);

  useEffect(() => {
    if (toastrMsg) {
      toast.success(toastrMsg);
      setIsOpen(false);
      setId("");
      setName("");
      setEmail("");
      setEmployeeId("");
      setType("1");
      setDepartment("");
      setDesignation("");
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

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  const handleEdit = (
    id,
    name,
    email,
    employeeId,
    type,
    department,
    designation
  ) => {
    setId(id);
    setName(name);
    setEmail(email);
    setEmployeeId(employeeId);
    setType(type);
    setDepartment(department);
    setDesignation(designation);
    toggle();
    setFadeEmail(true);
  };

  const handleEditSubmit = () => {
    if (name !== "") {
      editUser(id, name, employeeId, type, department, designation);
    }
  };

  const handleSubmit = () => {
    if (name !== "" && email !== "") {
      addUser(name, email, employeeId, type, department, designation);
    }
  };

  const handleBulkData = () => {
    const tableData = hotTableRef.current.hotInstance.getData();
    let finalList = [];
    for (let i = 0; i < tableData.length; i++) {
      let flag = false;
      for (let j = 0; j < colkeys.length; j++) {
        if (tableData[i][j]) {
          flag = true;
          break;
        }
      }
      if (flag) {
        let data_obj = {};
        for (let k = 0; k < colkeys.length; k++) {
          if (k < 2) {
            if (!tableData[i][k]) {
              return false;
            }
          }

          if (k == 1 && !isValidEmail(tableData[i][k])) {
            return false;
          }
          let column_value = tableData[i][k];
          if (!column_value || column_value == null) {
            column_value = "";
          }
          column_value = column_value.trim();

          if (column_value === "Admin") {
            column_value = "1";
          } else if (column_value === "Non Admin") {
            column_value = "2";
          }

          data_obj[colkeys[k]] = column_value;
        }
        finalList.push(data_obj);
      }
    }
    addBulkUser(finalList);
  };

  useEffect(() => {
    if (bulkDataMsg) {
      setBulkDataError(null);
      toast.success(bulkDataMsg);
      toggleTable();
    } else if (bulkDataError) {
      setBulkDataMsg(null);
      toast.error(bulkDataError);
    }
  }, [bulkDataMsg, bulkDataError, setBulkDataMsg, setBulkDataError]);

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function emailFieldRenderer(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    if (value && value !== "") {
      if (!isValidEmail(value)) {
        td.style.background = "red";
      }
    }
    if (!value && value === "") {
      td.style.background = "red";
    }
  }

  function requiredFieldRenderer(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    if (!value || value === "") {
      td.style.background = "red";
    }
  }

  Handsontable.renderers.registerRenderer(
    "myClass1.requiredFieldRenderer",
    requiredFieldRenderer
  );
  Handsontable.renderers.registerRenderer(
    "myClass1.emailFieldRenderer",
    emailFieldRenderer
  );

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
      <ToastContainer />
      <Container className="mt--9" fluid>
        <Row>
          {!showTable ? (
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow" style={{ height: "42rem" }}>
                <CardHeader className="border-0">
                  <Row className="align-items-center justify-content-end">
                    <Button
                      color="primary"
                      onClick={(e) => {
                        toggle();
                        setFadeEmail(false);
                        e.preventDefault();
                        setId("");
                        setName("");
                        setEmail("");
                        setEmployeeId("");
                        setType("");
                        setDepartment("");
                        setDesignation("");
                      }}
                      size="sm"
                    >
                      Add Employee
                    </Button>
                    <Button
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowTable(true);
                      }}
                      size="sm"
                    >
                      Bulk Add Employee
                    </Button>
                    <Modal isOpen={isOpen} toggle={toggle}>
                      <ModalHeader toggle={toggle}>
                        {fadeEmail ? `Edit Employee` : `Add Employee`}
                      </ModalHeader>
                      <ModalBody>
                        <Form>
                          <FormGroup>
                            <Label for="name">Name:</Label>
                            <Input
                              required
                              type="text"
                              value={name}
                              onChange={(event) => {
                                setName(event.target.value);
                              }}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="email">Email:</Label>
                            <Input
                              disabled={fadeEmail}
                              required
                              type="email"
                              value={email}
                              onChange={(event) => {
                                setEmail(event.target.value);
                              }}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="employeeId">Employee ID:</Label>
                            <Input
                              required
                              type="text"
                              value={employeeId}
                              onChange={(event) => {
                                setEmployeeId(event.target.value);
                              }}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="type">Type:</Label>
                            <Input
                              type="select"
                              value={type}
                              onChange={(event) => {
                                setType(event.target.value);
                              }}
                            >
                              <option value="1">Admin</option>
                              <option value="2">Non Admin</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                            <Label for="Department">Department:</Label>
                            <Input
                              required
                              type="text"
                              value={department}
                              onChange={(event) => {
                                setDepartment(event.target.value);
                              }}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="Designation">Designation:</Label>
                            <Input
                              required
                              type="text"
                              value={designation}
                              onChange={(event) => {
                                setDesignation(event.target.value);
                              }}
                            />
                          </FormGroup>
                          <ModalFooter>
                            <Button
                              color="primary"
                              onClick={() => {
                                if (fadeEmail) {
                                  handleEditSubmit();
                                } else if (!fadeEmail) {
                                  handleSubmit();
                                }
                              }}
                            >
                              Submit
                            </Button>
                            <Button color="secondary" onClick={() => toggle()}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Form>
                      </ModalBody>
                    </Modal>
                  </Row>
                </CardHeader>
                <Modal isOpen={isDelOpen} toggle={delToggle}>
                  <ModalHeader toggle={delToggle}>Delete User</ModalHeader>
                  <ModalBody>
                    <Form>
                      <h4>
                        Are you sure you want to delete{" "}
                        <span style={{ color: "red" }}>{name}</span>
                      </h4>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() => {
                            deleteUser(id);
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
                <div style={{ maxHeight: "100%", overflowY: "auto" }}>
                  <Table className="align-items-center" style={{}}>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Employee ID</th>
                        <th scope="col">User Type</th>
                        <th scope="col">Department</th>
                        <th scope="col">Designation</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {usersList &&
                        usersList.map((x) => {
                          return (
                            <tr>
                              <th scope="row">
                                {x.first_name} {x.last_name}
                              </th>
                              <td>{x.email}</td>
                              <td>{x.employee_id}</td>
                              <td>
                                {x.user_type === "1" ? `Admin` : `Non Admin`}
                              </td>

                              <td>{x.department}</td>
                              <td>{x.designation}</td>
                              <td className="">
                                <Row>
                                  <Button
                                    color="info"
                                    className="rounded-circle btn-info text-white btn-sm "
                                    onClick={() => {
                                      handleEdit(
                                        x.id,
                                        `${x.first_name} ${x.last_name}`,
                                        x.email,
                                        x.employee_id,
                                        x.user_type,
                                        x.department,
                                        x.designation
                                      );
                                    }}
                                  >
                                    <TiPencil />
                                  </Button>

                                  <Button
                                    disabled={
                                      x.id ===
                                        JSON.parse(
                                          localStorage.getItem("userInfo")
                                        )?.userId ||
                                      (x.has_signed_up && x.is_admin)
                                        ? true
                                        : false
                                    }
                                    color="danger"
                                    className="rounded-circle btn-circle text-white btn-sm"
                                    onClick={() => {
                                      setId(x.id);
                                      setName(`${x.first_name} ${x.last_name}`);
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
          ) : (
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow" style={{ height: "42rem" }}>
                <CardHeader className="border-0">
                  <Row className="align-items-center justify-content-end">
                    <Button
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleTable();
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBulkData();
                      }}
                      size="sm"
                    >
                      Submit
                    </Button>
                  </Row>
                </CardHeader>
                <div>
                  {" "}
                  <HotTable
                    ref={hotTableRef}
                    width={"100%"}
                    colWidths={176.5}
                    data={bulkData}
                    rowHeaders={true}
                    columns={[
                      {
                        renderer: "myClass1.requiredFieldRenderer",
                        data: 1,
                        type: "text",
                        className: "required",
                      },
                      {
                        renderer: "myClass1.emailFieldRenderer",
                        data: 2,
                        type: "text",
                        className: "required",
                      },
                      {
                        data: 3,
                        type: "text",
                      },
                      {
                        data: 4,
                        type: "dropdown",
                        source: [("1", "Admin"), ("2", "Non Admin")],
                      },
                      {
                        data: 5,
                        type: "text",
                      },
                      {
                        data: 6,
                        type: "text",
                      },
                    ]}
                    colHeaders={colHeading}
                    height="auto"
                    manualColumnResize={true}
                    allowInsertRow={true}
                    licenseKey="non-commercial-and-evaluation"
                  />
                </div>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default UsersList;
