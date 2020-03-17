/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import _ from "lodash";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
  Table,
  Media
} from "reactstrap";

// RCE CSS
import "react-chat-elements/dist/main.css";
// MessageBox component
import { MessageBox } from "react-chat-elements";
import "../assets/css/Notifications.css";
import fire from "../config/firebaseConfig";
// core components
import EmptyHeader from "components/Headers/EmptyHeader.jsx";
import NotifTabs from "components/NotifTabs.js";
import ConversationSearch from "../components/ConversationSearch";
import "../components/ConversationSearch/ConversationSearch.css";

import {
  Button as SemButton,
  Header,
  Icon,
  Image,
  Modal,
  Form,
  TextArea,
  Label,
  Loader,
  Dimmer,
  Search,
  Grid,
  Segment
} from "semantic-ui-react";

class Notifications extends React.Component {
  state = {
    allNotifs: null,
    notifs: null,
    currentModalConvos: [],
    open: false,
    currentSubject: "",
    currentFrom: "",
    currentToken: "",
    notifications: {},
    users: null,
    allUsers: null,
    currentInitiated: "",
    isLoading: false,
    results: [],
    value: "",
    recieverId: null,
    name: null
  };

  componentDidMount() {
    this.retrieveFirebaseData();
  }

  async retrieveFirebaseData() {
    let notifications = {};
    let notifications_arr = [];

    fire
      .database()
      .ref("notifications/")
      .on("value", notifs => {
        let notifications_arr = [];
        //notifications = notifs.val()
        let currentModalConvos = null;
        let currentSubject = null;
        let currentFrom = null;
        let currentToken = null;
        let currentInitiated = null;
        notifs.forEach(notification => {
          if (
            notification.val().initiatedTime === this.state.currentInitiated
          ) {
            fire
              .database()
              .ref(`notifications/${notification.key}/opened`)
              .set(true);
            let conversations = [];
            let prevDate = "";
            Object.values(notification.val()["conversation"]).map(val => {
              if (val.time.slice(0, 3) != prevDate) {
                prevDate = val.time.slice(0, 3);
                conversations.push(val.time.slice(0, 5));
              }
              conversations.push(val);
            });

            currentModalConvos = conversations;
            currentSubject = notification.val().subject;
            currentFrom = notification.val().sentByname;
            currentToken = notification.key;
            currentInitiated = notification.val().initiatedTime;

            notifications_arr.push({
              token: notification.key,
              sentByname: notification.val().sentByname,
              subject: notification.val().subject,
              timestamp: notification.val().timestamp,
              sentToName: notification.val().sentToName,
              initiatedTime: notification.val().initiatedTime,
              sentTouid: notification.val().sentTouid,
              opened: true
            });
          } else {
            notifications_arr.push({
              token: notification.key,
              sentByname: notification.val().sentByname,
              subject: notification.val().subject,
              timestamp: notification.val().timestamp,
              sentToName: notification.val().sentToName,
              initiatedTime: notification.val().initiatedTime,
              sentTouid: notification.val().sentTouid,
              opened: notification.val().opened
            });
          }
        });
        if (currentToken !== null)
          this.setState({
            notifs: notifications_arr,
            searchNotif: notifications_arr,
            allNotifs: notifs.val(),
            currentToken: currentToken,
            currentFrom: currentFrom,
            currentSubject: currentSubject,
            currentInitiated: currentInitiated,
            currentModalConvos: currentModalConvos
          });
        else
          this.setState({
            notifs: notifications_arr,
            searchNotif: notifications_arr,
            allNotifs: notifs.val()
          });
      });

    await fire
      .database()
      .ref("users")
      .once("value", users => {
        let user_obj = {};
        if (users.hasChildren()) {
          Object.entries(users.val()).map(([key, val]) => {
            user_obj[val.email] = key;
          });
          this.setState({ users: user_obj, allUsers: users.val() });
        }
      });
  }
  getTimestamp(h, m) {
    var t = new Date();
    t.setHours(t.getUTCHours() + h);
    t.setMinutes(t.getUTCMinutes() + m);

    var timestamp =
      t.getUTCFullYear() +
      "_" +
      ("0" + (t.getMonth() + 1)).slice(-2) +
      "_" +
      ("0" + t.getDate()).slice(-2) +
      "_" +
      ("0" + t.getHours()).slice(-2) +
      "_" +
      ("0" + t.getMinutes()).slice(-2) +
      "_" +
      ("0" + t.getSeconds()).slice(-2) +
      "_" +
      ("0" + t.getMilliseconds()).slice(-2);

    return timestamp;
  }

  leftPad(number, targetLength) {
    var output = number + "";
    while (output.length < targetLength) {
      output = "0" + output;
    }
    return output;
  }

  sendNotification() {
    let subject = document.getElementById("notify_sub").value;
    let message = document.getElementById("notify_msg").value;
    //let recieverId = document.getElementById('exampleFormControlInput1').value

    if (this.state.recieverId === null) {
      alert("Reciever Email not found");
      return;
    }

    if (subject === "" || message === "") {
      alert("Please enter all the fields");
      return;
    } else {
      let currentDate = new Date();
      let date = this.leftPad(currentDate.getDate(), 2);
      let month = this.leftPad(currentDate.getMonth() + 1, 2);
      let year = currentDate.getFullYear();
      let hour = this.leftPad(currentDate.getHours(), 2);
      let mins = this.leftPad(currentDate.getMinutes(), 2);
      let secs = this.leftPad(currentDate.getSeconds(), 2);
      let recieveruid = this.state.recieverId;

      let DateString = this.getTimestamp(5, 30);
      let conversation = {};

      let firstConvo = "convo_" + DateString;
      conversation[firstConvo] = {
        customer: false,
        message: message,
        time: "" + date + "-" + month + "-" + year + " " + hour + ":" + mins
      };

      fire
        .database()
        .ref(`users/${fire.auth().currentUser.uid}/`)
        .on("value", user => {
          fire
            .database()
            .ref(`notifications/notify_${DateString}/`)
            .set(
              {
                conversation: conversation,
                subject: subject,
                sentByuid: fire.auth().currentUser.uid,
                timestamp:
                  "" +
                  date +
                  "/" +
                  month +
                  "/" +
                  year +
                  " " +
                  hour +
                  ":" +
                  mins,
                sentByname: user.val().name,
                sentByEmail: user.val().email,
                sentToMail: this.state.value,
                sentTouid: this.state.recieverId,
                sentToName: this.state.name,
                initiatedTime: DateString,
                opened: true
              },
              () => {
                fire
                  .database()
                  .ref(
                    `users/${this.state.recieverId}/notifications/notify_${DateString}/`
                  )
                  .set({
                    subject: subject,
                    sentByuid: fire.auth().currentUser.uid,
                    timestamp:
                      "" +
                      date +
                      "/" +
                      month +
                      "/" +
                      year +
                      " " +
                      hour +
                      ":" +
                      mins,
                    sentByname: user.val().name,
                    sentByEmail: user.val().email,
                    sentToMail: this.state.value,
                    sentTouid: this.state.recieverId,
                    sentToName: this.state.name,
                    initiatedTime: DateString,
                    opened: false
                  });
              }
            );
        });

      document.getElementById("notify_sub").value = "";
      document.getElementById("notify_msg").value = "";
      //document.getElementById("exampleFormControlInput1").value = ""

      this.retrieveFirebaseData();
    }
  }

  searchName(name) {
    fire
      .database()
      .ref("users")
      .orderByChild("name")
      .startAt(`${name}`)
      .endAt(`${name}\uf8ff`)
      .limitToFirst(5)
      .once("value", snap => {
        console.log("name", snap.val());
      });
  }

  handleResultSelect = (e, { result }) =>
    this.setState({
      value: result.description,
      recieverId: result.name,
      name: result.title
    });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value: value });

    setTimeout(() => {
      if (this.state.value.length < 1)
        return this.setState({ isLoading: false, results: [], value: "" });

      fire
        .database()
        .ref("users")
        .orderByChild("name")
        .startAt(`${value}`)
        .endAt(`${value}\uf8ff`)
        .limitToFirst(5)
        .once("value", snap => {
          let results = [];
          if (snap.val() !== null) {
            Object.entries(snap.val()).map(([key, item]) => {
              results.push({
                name: key,
                title: item.name,
                description: item.email
              });
            });
          }
          console.log(results);
          this.setState({
            isLoading: false,
            results: results
          });
        });
    }, 300);
  };

  send() {
    let email = "";
    if (fire.auth().currentUser !== null) {
      email = fire.auth().currentUser.email;
    }

    return (
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Personal Notification</h3>
            </CardHeader>
            <div class="container">
              <div class="row">
                <div class="col">
                  <button
                    type="button"
                    class="btn btn-default"
                    style={{ width: "100%" }}
                  >
                    {email}
                  </button>
                </div>
                <div class="col-md-auto">
                  <span class="lead">
                    <i>To</i>
                  </span>
                </div>
                <div class="col">
                  <Search
                    loading={this.state.isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, {
                      leading: true
                    })}
                    results={this.state.results}
                    value={this.state.value}
                    {...this.props}
                  />
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <form style={{ marginBottom: 20 }}>
                    <input
                      id="notify_sub"
                      class="form-control form-control-alternative"
                      placeholder="Subject"
                      type="text"
                      style={{ marginBottom: 20 }}
                    />
                    <textarea
                      id="notify_msg"
                      class="form-control form-control-alternative"
                      rows="10"
                      placeholder="Enter Custom Notification..."
                    ></textarea>
                  </form>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Button
                      onClick={this.sendNotification.bind(this)}
                      block
                      color="info"
                      size="lg"
                      type="button"
                      style={{ marginBottom: 20, width: "80%" }}
                    >
                      Send
                    </Button>
                  </div>
                </div>

                <div class="col">
                  <InputGroup>
                    <InputGroupAddon
                      addonType="prepend"
                      style={{ width: "50%" }}
                    >
                      <Button
                        style={{ paddingLeft: "20%", paddingRight: "20%" }}
                        block
                        color="info"
                        size="lg"
                        type="button"
                      >
                        Schedule Send
                      </Button>
                    </InputGroupAddon>
                    <Input
                      placeholder="dd/mm/yyyy"
                      style={{ paddingLeft: "10%", height: 51 }}
                    />
                  </InputGroup>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Row>
    );
  }

  sendMessage() {
    let text = document.getElementById("messageBox").value;
    let uid = fire.auth().currentUser.uid;
    let token = this.state.currentToken;
    let currentDate = new Date();
    let date = this.leftPad(currentDate.getDate(), 2);
    let month = this.leftPad(currentDate.getMonth() + 1, 2);
    let year = currentDate.getFullYear();
    let hour = this.leftPad(currentDate.getHours(), 2);
    let mins = this.leftPad(currentDate.getMinutes(), 2);
    let secs = this.leftPad(currentDate.getSeconds(), 2);

    console.log(Date.now(), token, newToken);

    let DateString = this.getTimestamp(5, 30);
    let newToken = "notify_" + DateString;
    let newnotif = this.state.allNotifs[token];
    let tempnotif = {};
    console.log(newnotif);
    tempnotif["sentByEmail"] = newnotif["sentByEmail"];
    tempnotif["sentByname"] = newnotif["sentByname"];
    tempnotif["sentToMail"] = newnotif["sentToMail"];
    tempnotif["sentToName"] = newnotif["sentToName"];
    tempnotif["sentTouid"] = newnotif["sentTouid"];
    tempnotif["sentByuid"] = newnotif["sentByuid"];
    tempnotif["subject"] = newnotif["subject"];
    tempnotif["timestamp"] = newnotif["timestamp"];
    tempnotif["initiatedTime"] = newnotif["initiatedTime"];
    tempnotif["opened"] = false;

    newnotif["opened"] = true;
    let convoString = "convo_" + DateString;

    console.log("New notif", this.state.allNotifs);
    newnotif["conversation"][convoString] = {
      customer: false,
      message: text,
      time: "" + date + "-" + month + "-" + year + " " + hour + ":" + mins
    };

    console.log(this.state.allNotifs, token, newnotif["sentTouid"] === "-");
    let newdbstruct = {};

    newdbstruct["/notifications/" + token] = {};

    if (newnotif["sentTouid"] === "-") {
      newdbstruct[
        "users/" + newnotif["sentByuid"] + "/notifications/" + token
      ] = {};
      newdbstruct[
        "users/" + newnotif["sentByuid"] + "/notifications/" + newToken
      ] = tempnotif;
    } else {
      newdbstruct[
        "users/" + newnotif["sentTouid"] + "/notifications/" + token
      ] = {};
      newdbstruct[
        "users/" + newnotif["sentTouid"] + "/notifications/" + newToken
      ] = tempnotif;
    }

    newdbstruct["/notifications/" + newToken] = newnotif;
    console.log(newdbstruct);
    fire
      .database()
      .ref()
      .update(newdbstruct);

    document.getElementById("messageBox").value = "";
  }

  close = () => this.setState({ open: false, currentInitiated: "" });

  ChatModal() {
    let subject = this.state.currentSubject;
    let from = this.state.currentFrom;
    return (
      <Modal
        style={{ height: "fit-content", top: "10%", left: "20%" }}
        open={this.state.open}
        onClose={this.close.bind(this)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "fit-content"
          }}
        >
          <Modal.Header className="ModalHeader">{subject}</Modal.Header>
          <p className="SenderDetails">{from}</p>
        </div>
        <Modal.Content
          className="ModalContent"
          style={{ minHeight: window.innerHeight * 0.6 }}
          scrolling
        >
          <Modal.Description>
            {this.state.currentModalConvos.map((value, index, array) => {
              if (typeof value === "object")
                return (
                  <MessageBox
                    position={value.customer ? "left" : "right"}
                    type={"text"}
                    text={value.message}
                    dateString={value.time.slice(11)}
                  />
                );
              else
                return (
                  <Label
                    style={{ marginLeft: "47%", backgroundColor: "#fff9c4" }}
                    primary
                    pointing
                  >
                    {value}
                  </Label>
                );
            })}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Form style={{ width: window.innerWidth * 0.4 }}>
            <TextArea id="messageBox" placeholder="Type a message" rows={2} />
          </Form>
          <SemButton id="reply" onClick={this.sendMessage.bind(this)} primary>
            Reply <Icon name="chevron right" />
          </SemButton>
        </Modal.Actions>
      </Modal>
    );
  }

  openChatModal(subject, from, token) {
    fire
      .database()
      .ref(`notifications/${token}/opened`)
      .set(true);
    let conversations = [];
    let prevDate = "";
    conversations = [];

    Object.values(this.state.allNotifs[token]["conversation"]).map(val => {
      if (val.time.slice(0, 3) != prevDate) {
        prevDate = val.time.slice(0, 3);
        conversations.push(val.time.slice(0, 5));
      }
      conversations.push(val);
    });
    this.setState({
      currentModalConvos: conversations,
      open: true,
      currentSubject: subject,
      currentFrom: from,
      currentToken: token,
      currentInitiated: this.state.allNotifs[token]["initiatedTime"]
    });

    console.log(conversations);
  }

  getReceived() {
    var items = [];
    if (this.state.notifs !== null)
      for (var i = this.state.notifs.length - 1; i >= 0; i--) {
        items.push(
          <tr
            style={{
              backgroundColor: this.state.notifs[i].opened ? "#fff" : "#78909c"
            }}
          >
            <td>
              <span class="mb-0 text-sm">
                {this.state.notifs[i].sentByname}
              </span>
            </td>
            <td>
              <span class="mb-0 text-sm">
                {this.state.notifs[i].sentToName}
              </span>
            </td>
            <td>
              <span class="mb-0 text-sm" style={{ fontWeight: 700 }}>
                {this.state.notifs[i].subject}
              </span>
            </td>
            <td>{this.state.notifs[i].timestamp}</td>
            <td>
              <button
                type="button"
                class="btn btn-success"
                onClick={this.openChatModal.bind(
                  this,
                  this.state.notifs[i].subject,
                  this.state.notifs[i].name,
                  this.state.notifs[i].token
                )}
              >
                Open
              </button>
            </td>
          </tr>
        );
      }

    return items;
  }

  loadingBar() {
    if (this.state.notifs === null) {
      return (
        <Dimmer active inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
      );
    } else if (this.state.notifs.length === 0) {
      return (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Header
            as="h2"
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
            block
          >
            No Notifications yet
          </Header>
        </div>
      );
    }
  }

  searchBarChange(val) {
    let tempnotif = [];
    this.state.searchNotif.forEach(noti => {
      if (
        noti.subject.toLowerCase().includes(val.toLowerCase()) ||
        noti.sentToName.toLowerCase().includes(val.toLowerCase()) ||
        noti.timestamp.toLowerCase().includes(val.toLowerCase())
      ) {
        tempnotif.push(noti);
      }
    });
    console.log(val, tempnotif);
    this.setState({ notifs: tempnotif });
  }

  received() {
    return (
      <div class="table-responsive">
        <div>
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Your Notifications</h3>
              <div className="conversation-search">
                <input
                  type="search"
                  className="conversation-search-input"
                  placeholder="Search Notifications"
                  onChange={e => this.searchBarChange(e.target.value)}
                />
              </div>
            </CardHeader>
            <table class="table align-items-center">
              <thead class="thead-light">
                <tr>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Timestamp</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody class="list">{this.getReceived()}</tbody>
            </table>
            {this.loadingBar()}
          </Card>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <EmptyHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Card>
            <NotifTabs send={this.send()} received={this.received()} />
            {this.ChatModal()}
          </Card>
        </Container>
      </>
    );
  }
}

export default Notifications;
