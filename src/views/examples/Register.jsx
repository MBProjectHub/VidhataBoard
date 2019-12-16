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


import { Route, Switch } from "react-router-dom";

import CircularProgress from '@material-ui/core/CircularProgress';
import fire from '../../config/firebaseConfig'

class Register extends React.Component {
 state = {loading:false}
  firebaseRegister()
  {
    let passcode = document.getElementById('passcode').value;
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    
  
    if(name.length!==0 && email.length!==0 && password.length!==0)
    {
      fire.auth().createUserWithEmailAndPassword(email, password)
      .then(()=>{
        fire.database().ref(`users/${fire.auth().currentUser.uid}`).set({
          name: name,
          email: email,
          admin: true
        }, ()=>{
          this.props.history.push('/admin/bookings')
          this.setState({loading:false})
        })
      }).catch(()=>{
        this.setState({loading:false})
        alert("Email already exists");
      })
    }
    else
    {
      this.setState({loading:false})
      alert("Please enter all the details");
    }
  }

  renderLoader()
  {
    if(this.state.loading)
    return <CircularProgress />
   
    else
   return <Button className="mt-4" color="primary" type="button" onClick={()=>{this.setState({loading:true},this.firebaseRegister.bind(this)) }}>
   Create account
 </Button>
    
  }
  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Passcode
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="passcode"
                              placeholder="Passcode"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="email"
                              placeholder="jesse@example.com"
                              type="email"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Lucky"
                              id="name"
                              placeholder="Name"
                              type="text"
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
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
              
                <div className="text-center">
                    {this.renderLoader()}
                </div>  
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Register;
