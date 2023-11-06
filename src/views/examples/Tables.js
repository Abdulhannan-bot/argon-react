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
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Input,
  InputGroup,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";

// core components
import Header from "components/Headers/Header.js";
import { AuthContext } from "utils/AuthContext";
import { CHATSOCKET, NOTIFYSOCKET } from "utils/config";

const Tables = () => {
  const [chatSocket, setChatSocket] = useState();
  const [notifySocket, setNotifySocket] = useState();
  const [sms, setSms] = useState("");
  const chatContainerRef = useRef(null);
  const [hide, setHide] = useState(true);
  const { contacts, contactsList, messages, chatMessages, userInfo } =
    useContext(AuthContext);

  useEffect(() => {
    setChatSocket(new WebSocket(CHATSOCKET));
    setNotifySocket(new WebSocket(NOTIFYSOCKET));
    contacts();
    if (!hide) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (localStorage.getItem("sendTo")) {
      setHide(false);
      chatMessages(JSON.parse(localStorage.getItem("sendTo"))?.id);
    }
  }, []);

  useEffect(() => {
    console.log(contactsList);
  }, [contactsList]);

  useEffect(() => {
    if (!hide) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function newMessage(message) {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(
        JSON.stringify({
          message: message,
          to: JSON.parse(localStorage.getItem("sendTo"))?.id,
          from: JSON.parse(localStorage.getItem("userInfo"))?.userId,
        })
      );
    }
  }

  function notify(contact, from) {
    if (notifySocket && notifySocket.readyState == WebSocket.OPEN) {
      notifySocket.send(
        JSON.stringify({
          contact: contact,
          from: from,
        })
      );
    }
  }

  if (
    chatSocket &&
    chatSocket.readyState == WebSocket.OPEN &&
    JSON.parse(localStorage.getItem("userInfo"))
  ) {
    chatSocket.onmessage = (e) => {
      e.preventDefault();
      let data = JSON.parse(e.data);
      if (
        JSON.parse(localStorage.getItem("userInfo"))?.userId == data.from ||
        JSON.parse(localStorage.getItem("userInfo"))?.userId == +data.to
      ) {
        chatMessages(JSON.parse(localStorage.getItem("sendTo"))?.id);
        contacts();

        if (JSON.parse(localStorage.getItem("sendTo"))?.id == data.from) {
          console.log("notie");
          notify(
            data.from,
            JSON.parse(localStorage.getItem("userInfo"))?.userId
          );
        }
      }
    };
  }

  if (
    notifySocket &&
    notifySocket.readyState == WebSocket.OPEN &&
    JSON.parse(localStorage.getItem("userInfo"))
  ) {
    notifySocket.onmessage = (e) => {
      e.preventDefault();
      let data = JSON.parse(e.data);
      if (
        JSON.parse(localStorage.getItem("userInfo"))?.userId == data.from ||
        JSON.parse(localStorage.getItem("userInfo"))?.userId == data.contact
      ) {
        contacts();
        if (
          JSON.parse(localStorage.getItem("sendTo"))?.id == data.from ||
          JSON.parse(localStorage.getItem("sendTo"))?.id == data.contact
        ) {
          console.log("messages");
          chatMessages(JSON.parse(localStorage.getItem("sendTo"))?.id);
        }
      }
    };
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date >= today.setHours(0, 0, 0, 0)) {
      // Date is today
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    } else if (date >= yesterday.setHours(0, 0, 0, 0)) {
      // Date is yesterday
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `yesterday`;
    } else {
      // Date is before yesterday
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${day.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
    }
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--9" fluid>
        {/* Table */}
        <Row className="">
          <div className="col-4 mx--3">
            <Card
              className="left-shadow bg-default text-white"
              style={{ height: "42rem", borderRadius: "0" }}
            >
              <ListGroup style={{ maxHeight: "100%", overflowY: "auto" }}>
                {contactsList &&
                  contactsList.map((contact) => (
                    <ListGroupItem
                      key={contact.id}
                      className="bg-default border-0"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        localStorage.setItem(
                          "sendTo",
                          JSON.stringify({
                            id: contact.id,
                            name: contact.name,
                          })
                        );
                        chatMessages(contact.id);
                        setHide(false);
                        notify(
                          contact.id,
                          JSON.parse(localStorage.getItem("userInfo")).userId
                        );
                      }}
                    >
                      <div className="ml--2" style={{ flex: 1 }}>
                        <Media left>
                          <Media
                            object
                            src={require("../../assets/img/theme/bootstrap.jpg")}
                            alt={contact.name}
                            className="rounded-circle"
                            style={{
                              height: "3rem",
                              borderRadius: "2.5rem",
                              borderWidth: "2px",

                              margin: "0px",
                            }}
                          />
                        </Media>
                      </div>
                      <div
                        className="ml-1"
                        style={{
                          flex: 4,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Media body>
                          <Media
                            heading
                            style={{ fontSize: "14px" }}
                            className="text-white"
                          >
                            {contact.name}
                          </Media>
                          <div style={{ fontSize: "12px" }}>
                            {contact.latest_message_user ==
                            JSON.parse(localStorage.getItem("userInfo"))
                              ?.userId ? (
                              contact.latest_message_read ? (
                                <span style={{ color: "lightgreen" }}>✔︎ </span>
                              ) : (
                                <span style={{ color: "gray" }}>✔︎ </span>
                              )
                            ) : (
                              <></>
                            )}
                            {contact.latest_message?.length > 28
                              ? contact.latest_message.slice(0, 28) + "..."
                              : contact.latest_message}
                          </div>
                        </Media>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontSize: "12px" }}>
                          {formatTime(contact.latest_message_time)}
                        </div>
                        {contact.latest_message_user !=
                        JSON.parse(localStorage.getItem("userInfo"))?.userId ? (
                          <Badge
                            style={{ backgroundColor: "lightgreen" }}
                            className="mt-2 text-dark"
                          >
                            {contact.unread_messages_count}
                          </Badge>
                        ) : (
                          <></>
                        )}
                      </div>
                    </ListGroupItem>
                  ))}
              </ListGroup>
            </Card>
          </div>
          <div className="col-8 ml-0 bg-white p-0">
            {!hide && (
              <Card
                className="shadow"
                style={{
                  height: "42rem",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "0",
                }}
              >
                <CardHeader
                  className="border-0"
                  style={{
                    flex: 0.3,
                    backgroundColor: "rgb(246 249 252)",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={require("../../assets/img/theme/bootstrap.jpg")}
                    className="rounded-circle"
                    style={{
                      height: "2.5rem",

                      borderWidth: "2px",
                      margin: "0px",
                    }}
                  />
                  <div className="ml-2" style={{ fontWeight: "bold" }}>
                    {JSON.parse(localStorage.getItem("sendTo"))?.name}
                  </div>
                </CardHeader>
                <div
                  className="px-2"
                  style={{ flex: 14, overflowY: "auto" }}
                  ref={chatContainerRef}
                >
                  {messages &&
                    messages.map((msg) => {
                      return msg.from_user ==
                        JSON.parse(localStorage.getItem("userInfo"))?.userId ? (
                        <div
                          className="d-flex flex-row justify-content-end"
                          key={msg.id}
                        >
                          <div style={{ position: "relative" }}>
                            <div
                              className="small p-2 me-3 mb-1 text-white rounded-3 bg-default sms-container"
                              style={{ position: "relative" }}
                            >
                              {msg.sms}
                              <div style={{ marginTop: 10 }}>
                                {msg.read_by ? (
                                  <span style={{ color: "lightgreen" }}>
                                    ✔︎{" "}
                                  </span>
                                ) : (
                                  <span style={{ color: "gray" }}>✔︎ </span>
                                )}
                                {/* <div
                                className="arrow-sign"
                                onClick={() => setArrowClicked(true)}
                              >
                                <FontAwesomeIcon icon={faAngleDown} />
                              </div> */}
                              </div>
                            </div>
                            <p
                              className="small me-3 mb-3 rounded-3 text-muted"
                              style={{ fontSize: 10 }}
                            >
                              {formatTime(msg.created_at)}
                            </p>
                          </div>

                          <img
                            src={require("../../assets/img/theme/bootstrap.jpg")}
                            alt="avatar 1"
                            style={{ width: "45px", height: "100%" }}
                          />
                        </div>
                      ) : (
                        <div
                          className="d-flex flex-row justify-content-start"
                          key={msg.id}
                        >
                          <img
                            src={require("../../assets/img/theme/bootstrap.jpg")}
                            alt="avatar 1"
                            style={{ width: "45px", height: "100%" }}
                          />
                          <div>
                            <div
                              className="small p-2 ms-3 mb-1 rounded-3"
                              style={{
                                backgroundColor: "rgb(246 249 252)",
                              }}
                            >
                              {msg.sms}
                            </div>
                            <p
                              className="small ms-3 mb-3 rounded-3 text-muted float-end"
                              style={{ fontSize: 10 }}
                            >
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div
                  style={{
                    // position: "absolute",
                    // bottom: 0,
                    // left: 0,
                    // right: 0,
                    flex: 1,
                    display: "flex",
                  }}
                >
                  <InputGroup style={{ flex: 1 }}>
                    <Input
                      type="text"
                      style={{ borderRadius: "0" }}
                      placeholder="Type a message..."
                      value={sms}
                      onChange={(event) => {
                        const text = event.target.value;
                        setSms(text);
                      }}
                    />
                  </InputGroup>
                  <Button
                    style={{ borderRadius: "0" }}
                    className="bg-default text-white"
                    onClick={(event) => {
                      console.log("clicked");
                      event.preventDefault();
                      newMessage(sms);
                      setSms("");
                    }}
                  >
                    Send
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Tables;
