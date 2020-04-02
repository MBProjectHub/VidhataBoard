import React from "react";
import { Step, Stepper, StepLabel, LinearProgress } from "@material-ui/core";
import {
  Row,
  Col,
  Container,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import "./Messenger.css";
import ConversationSearch from "../ConversationSearch";
import "../ConversationList.css";
import "../ConversationListItem.css";
import ProfileCard from "../ProfileCard";
import RequestForm from "../RequestForm";
import ConfirmationForm from "../ConfirmationForm";
import Options from "../Options";
import fire from "../../config/firebaseConfig";

export default class Messenger extends React.Component {
  state = {
    bookings: {},
    searchResults: [],
    searching: false,
    filterTitle: "Filter Bookings",
    conversations: [],
    users: {},
    currentProgressStage: "",
    currentSelected: "",
    currentConversation: {},
    loading: true,
    cover: true
  };

  componentDidMount() {
    fire
      .database()
      .ref("/bookings")
      .on("value", async b => {
        await fire
          .database()
          .ref("/users")
          .on("value", u => {
            this.setState({ bookings: b.val(), users: u.val() }, () => {
              this.loadConvos();
            });
          });
      });
  }

  trans(stage) {
    switch (stage) {
      case 0:
        return "request";
      case 1:
        return "options";
      case 2:
        return "confirmation";
      case 3:
        return "confirmation";
      default:
        return "";
    }
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

  loadConvos() {
    let update = true;
    let threads = [];
    if (this.state.bookings && this.state.bookings.active) {
      if (this.state.searching && this.state.searchResults)
        threads = this.state.searchResults;
      else threads = Object.keys(this.state.bookings.active);
    }
    let tempConvos = [];
    let tempCur = {};
    for (var i = 0; i < threads.length; i++) {
      let tid = threads[i];
      if (!this.state.bookings.active[tid]) {
        update = false;
        break;
      }
      if (this.state.bookings.active[tid].Estage != -1) {
        let iid = this.state.bookings.active[tid].initId;
        let st = this.state.bookings.active[tid].Estage;
        let uid = this.state.bookings.active[tid].uid;
        let h = this.state.bookings.active[tid][this.trans(st)].handler;
        let ha = this.state.bookings.active[tid][this.trans(st)].handledAt;
        let a = this.state.bookings.active[tid][this.trans(st)].arrivedAt;
        let dept = this.state.bookings.active[tid].request.details.dept;
        let arr = this.state.bookings.active[tid].request.details.arr;
        if (this.state.users && this.state.users[uid]) {
          tempConvos.unshift({
            threadId: tid,
            initId: iid,
            name: this.state.users[uid].name,
            meal: this.state.users[uid].mealPreference,
            seat: this.state.users[uid].seatPreference,
            phone: this.state.users[uid].phone,
            text: dept + " > " + arr,
            stage: st,
            handler: h,
            handledAt: ha,
            arrivedAt: a
          });
        }
        if (
          this.state.currentConversation.initId &&
          iid.substring(1) == this.state.currentConversation.initId.substring(1)
        )
          tempCur = tempConvos[0];
      }
    }
    if (update && Object.keys(tempCur).length != 0) {
      if (
        this.state.bookings.active[tempCur.threadId][this.trans(tempCur.stage)]
          .handler == fire.auth().currentUser.uid
      ) {
        this.setState({
          conversations: tempConvos,
          currentSelected: tempCur.threadId,
          currentProgressStage: tempCur.stage,
          currentConversation: tempCur,
          cover: false,
          loading: false
        });
      } else
        this.setState({
          conversations: tempConvos,
          currentSelected: tempCur.threadId,
          currentProgressStage: tempCur.stage,
          currentConversation: tempCur,
          cover: true,
          loading: false
        });
    } else if (update)
      this.setState({
        conversations: tempConvos,
        loading: false
      });
  }

  ClickRequest(conversation) {
    if (conversation.initId.charAt(0) == "*")
      fire
        .database()
        .ref("/bookings/active/" + conversation.threadId)
        .update({ initId: "-" + conversation.initId.substring(1) });

    this.state.conversations.forEach(conversation => {
      document.getElementById(conversation.threadId).style.background = "#fff";
    });
    document.getElementById(conversation.threadId).style.background = "#eeeef1";
    if (
      this.state.bookings.active[conversation.threadId][
        this.trans(this.state.bookings.active[conversation.threadId].Estage)
      ].handler == fire.auth().currentUser.uid
    )
      this.setState({
        currentSelected: conversation.threadId,
        currentProgressStage: conversation.stage,
        currentConversation: conversation,
        cover: false
      });
    else
      this.setState({
        currentSelected: conversation.threadId,
        currentProgressStage: conversation.stage,
        currentConversation: conversation,
        cover: true
      });
  }

  MouseOverRequest(conversation) {
    if (this.state.currentSelected !== conversation.threadId)
      document.getElementById(conversation.threadId).style.background =
        "#eeeef1";
  }

  MouseOutRequest(conversation) {
    if (this.state.currentSelected !== conversation.threadId)
      document.getElementById(conversation.threadId).style.background = "#fff";
  }

  stageClick(label) {
    let steps = [
      "Initiate Request",
      "Flight Options",
      "Booking Confirmation",
      "Booking Complete"
    ];
    let status = -1;
    if (this.state.bookings.active[this.state.currentSelected])
      status = this.state.bookings.active[this.state.currentSelected].options
        .status;

    if (label == steps[0]) {
      fire
        .database()
        .ref("/bookings/active/" + this.state.currentSelected)
        .update({ Estage: 0 });
      if (this.state.currentProgressStage != 0)
        this.setState({ loading: true });
    } else if (
      label == steps[1] &&
      (!this.state.cover || this.state.currentProgressStage == 2)
    ) {
      fire
        .database()
        .ref("/bookings/active/" + this.state.currentSelected)
        .update({ Estage: 1 });
      if (this.state.currentProgressStage != 1)
        this.setState({ loading: true });
    } else if (
      label == steps[2] &&
      status != 0 &&
      status != -1 &&
      status != 3
    ) {
      fire
        .database()
        .ref("/bookings/active/" + this.state.currentSelected)
        .update({ Estage: 2 });
      if (this.state.currentProgressStage != 2)
        this.setState({ loading: true });
    } else if (
      label == steps[3] &&
      this.state.bookings.active[this.state.currentSelected].Ustage == 3
    ) {
      fire
        .database()
        .ref("/bookings/active/" + this.state.currentSelected)
        .update({ Estage: 3 });
      if (this.state.currentProgressStage != 3)
        this.setState({ loading: true });
    }
  }

  renderProgressBar() {
    const theme = createMuiTheme({
      typography: {
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"'
        ].join(","),
        color: "#fff"
      }
    });

    let steps = [
      "Initiate Request",
      "Flight Options",
      "Booking Confirmation",
      "Booking Complete"
    ];
    if (this.state.currentProgressStage === "") return;
    else {
      return (
        <ThemeProvider theme={theme}>
          <Stepper
            style={{ height: 100, padding: 10, backgroundColor: "transparent" }}
            alternativeLabel
            activeStep={this.state.currentProgressStage}
          >
            {steps.map(label => (
              <Step key={label}>
                <StepLabel
                  label={{ color: "#fff" }}
                  style={{ color: "#fff", cursor: "pointer" }}
                  onClick={() => this.stageClick(label)}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </ThemeProvider>
      );
    }
  }

  loadContent(conversation) {
    if (conversation.stage == 0) {
      return (
        <div
          style={{
            height: "70%",
            paddingTop: "3%",
            marginTop: "2%",
            marginBottom: "2%",
            paddingBottom: "3%",
            overflowY: "scroll",
            width: "100%"
          }}
        >
          <RequestForm
            editable={false}
            data={{
              ...this.state.currentConversation,
              bookings: this.state.bookings
            }}
          />
        </div>
      );
    } else if (conversation.stage == 1)
      return (
        <Options
          load={() => this.setState({ loading: true })}
          data={{
            ...this.state.currentConversation,
            bookings: this.state.bookings
          }}
        />
      );
    else {
      return (
        <div
          style={{
            height: "70%",
            paddingTop: "3%",
            marginTop: "2%",
            marginBottom: "2%",
            paddingBottom: "3%",
            overflowY: "scroll",
            width: "100%"
          }}
        >
          <ConfirmationForm
            load={() => this.setState({ loading: true })}
            editable={true}
            data={{
              ...this.state.currentConversation,
              bookings: this.state.bookings
            }}
          />
        </div>
      );
    }
  }

  handle() {
    let timestamp = this.getTimestamp(5, 30);
    let temp = timestamp.split("_");
    let formatted =
      temp[2] + "-" + temp[1] + "-" + temp[0] + " " + temp[3] + ":" + temp[4];
    fire
      .database()
      .ref(
        "/bookings/active/" +
          this.state.currentSelected +
          "/" +
          this.trans(this.state.currentProgressStage)
      )
      .update({ handledAt: formatted, handler: fire.auth().currentUser.uid });
    this.setState({ cover: false });
  }

  loadStage() {
    if (this.state.currentSelected !== "") {
      console.log(this.state);
      let name = "-";
      if (this.state.users && this.state.currentConversation.handler != "-")
        name =
          this.state.users[this.state.currentConversation.handler].firstName +
          " " +
          this.state.users[this.state.currentConversation.handler].lastName;
      return (
        <div
          style={{
            width: "100%",
            height: window.innerHeight,
            position: "relative"
          }}
        >
          <Container style={{ padding: 0, zIndex: 10 }}>
            <Row
              style={{
                height: "30%",
                backgroundColor: "#FAFAFA",
                boxShadow: "0 5px 5px rgba(0,0,0,0.22)",
                marginRight: 0,
                marginLeft: 0,
                paddingTop: 10
              }}
            >
              <Col>
                <ProfileCard
                  data={this.state.currentConversation}
                  name={name}
                  view={() =>
                    this.props.history.push("/admin/view-profile", {
                      uid: this.state.bookings.active[
                        this.state.currentSelected
                      ].uid
                    })
                  }
                />
              </Col>
              <Col>
                <div>{this.renderProgressBar()}</div>
              </Col>
            </Row>
          </Container>

          {this.state.cover ? (
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "76%",
                bottom: 0,
                background: "#79B9E1",
                zIndex: 5,
                opacity: 0.5
              }}
            />
          ) : (
            ""
          )}
          {this.loadContent(this.state.currentConversation)}

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              bottom: 0,
              width: "100%",
              height: "9%",
              backgroundColor: "#FAFAFA",
              boxShadow: "0 -10px 15px -10px rgba(0,0,0,0.22)"
            }}
          >
            <Button
              color="primary"
              type="button"
              onClick={() => this.handle()}
              style={{ position: "absolute", right: "5%", bottom: "10%" }}
            >
              Handle Request
            </Button>
          </div>
        </div>
      );
    }
  }

  loadLeftPane() {
    return this.state.conversations.map(conversation => (
      <div
        id={conversation.threadId}
        className="conversation-list-item"
        style={{ display: "flex", flexDirection: "row" }}
        onClick={this.ClickRequest.bind(this, conversation)}
        onMouseOver={this.MouseOverRequest.bind(this, conversation)}
        onMouseOut={this.MouseOutRequest.bind(this, conversation)}
      >
        <div
          style={{
            height: 60,
            width: 2,
            backgroundColor: "#0F2972",
            margin: "5%",
            marginRight: "3%"
          }}
        />
        <div>
          <div className="conversation-info">
            <h1
              className="conversation-title"
              style={{
                fontWeight: conversation.initId.charAt(0) == "*" ? 900 : 500
              }}
            >
              {conversation.name}
            </h1>
            <span
              className="text-primary mr-2"
              style={{
                fontSize: 12,
                fontWeight: conversation.initId.charAt(0) == "*" ? 900 : 300
              }}
            >
              {conversation.initId.split("_")[3] +
                "-" +
                conversation.initId.split("_")[2] +
                "-" +
                conversation.initId.split("_")[1]}
            </span>
            <p
              className="conversation-snippet"
              style={{
                fontWeight: conversation.initId.charAt(0) == "*" ? 900 : 300
              }}
            >
              {conversation.text}
            </p>
          </div>
        </div>
      </div>
    ));
  }

  filter(low, up, str) {
    let searchResults = [];
    let threads = [];

    if (this.state.bookings && this.state.bookings.active)
      threads = Object.keys(this.state.bookings.active);

    for (let i = 0; i < threads.length; i++) {
      let item = this.state.bookings.active[threads[i]];
      if (
        item.confirmation.details != "-" &&
        Boolean(
          Number(item.confirmation.details.time.substring(0, 2)) >= low &&
            Number(item.confirmation.details.time.substring(0, 2)) < up
        )
      )
        searchResults.push(threads[i]);
    }
    this.setState(
      { filterTitle: str, searchResults: searchResults, searching: true },
      () => this.loadConvos()
    );
  }

  render() {
    return (
      <div
        className="messenger"
        style={{ height: window.innerHeight, width: "100%" }}
      >
        <div
          className="scrollable sidebar"
          style={{ height: window.innerHeight, width: "25%" }}
        >
          <div className="conversation-list">
            <UncontrolledDropdown
              style={{ alignSelf: "center", marginTop: "5%" }}
            >
              <DropdownToggle
                caret
                style={{
                  backgroundColor: "#5bc0de",
                  color: "#fff",
                  width: "100%"
                }}
              >
                {this.state.filterTitle}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header style={{ color: "#5bc0de" }}>
                  BY TIME
                </DropdownItem>
                <DropdownItem
                  onClick={() => this.filter(0, 12, "12 AM - 12 PM")}
                >
                  12 AM - 12 PM
                </DropdownItem>
                <DropdownItem
                  onClick={() => this.filter(12, 18, "12 PM - 6 PM")}
                >
                  12 PM - 6 PM
                </DropdownItem>
                <DropdownItem
                  onClick={() => this.filter(18, 24, "6 PM - 12 AM")}
                >
                  6 PM - 12 AM
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  style={{ color: "red" }}
                  onClick={() =>
                    this.setState(
                      {
                        filterTitle: "Filter Bookings",
                        searchResults: {},
                        searching: false
                      },
                      () => this.loadConvos()
                    )
                  }
                >
                  X Remove Filter
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <ConversationSearch
              bookings={this.state.bookings}
              users={this.state.users}
              sendData={ret =>
                this.setState(
                  { searchResults: ret.results, searching: ret.searching },
                  () => this.loadConvos()
                )
              }
            />
            {this.state.loading ? <LinearProgress /> : ""}
            {this.loadLeftPane()}
          </div>
        </div>
        {this.loadStage()}
      </div>
    );
  }
}
