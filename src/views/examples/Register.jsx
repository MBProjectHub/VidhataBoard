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
  Col
} from "reactstrap";

import { Formik } from "formik";
import { Route, Switch } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import fire from "../../config/firebaseConfig";

class Register extends React.Component {
  state = {
    loading: false,
    passcode: null
  };

  componentDidMount() {
    fire
      .database()
      .ref("passcode")
      .on("value", passcode => {
        this.setState({ passcode: passcode.val() });
      });
  }

  renderLoader() {
    if (this.state.loading) return <CircularProgress />;
    else
      return (
        <Button className="mt-4" color="primary" type="submit">
          Create account
        </Button>
      );
  }
  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <Formik
                initialValues={{
                  passcode: "",
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  email: "",
                  password: ""
                }}
                onSubmit={(values, actions) => {
                  const {
                    passcode,
                    firstName,
                    middleName,
                    lastName,
                    email,
                    password
                  } = values;
                  if (
                    passcode.length !== 0 &&
                    firstName.length !== 0 &&
                    lastName.length !== 0 &&
                    email.length !== 0 &&
                    password.length !== 0
                  ) {
                    if (passcode === this.state.passcode + "") {
                      fire
                        .auth()
                        .createUserWithEmailAndPassword(email, password)
                        .then(() => {
                          fire
                            .database()
                            .ref(`users/${fire.auth().currentUser.uid}`)
                            .set(
                              {
                                firstName,
                                middleName,
                                lastName,
                                email,
                                admin: true
                              },
                              () => {
                                this.props.history.push("/admin/bookings");
                                this.setState({ loading: false });
                              }
                            );
                        })
                        .catch(() => {
                          this.setState({ loading: false });
                          alert("Email already exists");
                        });
                    } else {
                      this.setState({ loading: false });
                      alert("Please enter a valid passcode");
                    }
                  } else {
                    this.setState({ loading: false });
                    alert("Please enter all the details");
                  }
                }}
              >
                {({ handleChange, values, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="passcode"
                            >
                              Passcode
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="passcode"
                              placeholder="Passcode"
                              type="text"
                              value={values.passcode}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="firstName"
                            >
                              First Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Lucky"
                              id="firstName"
                              placeholder="John"
                              type="text"
                              value={values.firstName}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>

                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="middleName"
                            >
                              Middle Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Lucky"
                              id="middleName"
                              type="text"
                              value={values.middleName}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>

                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="lastName"
                            >
                              Last Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Lucky"
                              id="lastName"
                              placeholder="Doe"
                              type="text"
                              value={values.lastName}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="email"
                              placeholder="jesse@example.com"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Password
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="password"
                              placeholder="Password"
                              type="password"
                              value={values.password}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div className="text-center">{this.renderLoader()} </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Register;
