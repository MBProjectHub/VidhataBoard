import React from "react";
import fire from '../config/firebaseConfig';

import { StyledDropZone } from 'react-drop-zone';
import 'react-drop-zone/dist/styles.css';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";

let selected = {};
class ConfirmationForm extends React.Component {

  state = {
    dept: '',
    arr: '',
    date: '',
    fare: 0,
    pnr: '',
    flight: ''
  }

  componentDidMount() {
    let choice = this.props.data.bookings.active[this.props.data.threadId].options.choice;
    selected = this.props.data.bookings.active[this.props.data.threadId].options.opts[choice];

    fire.database().ref(
      '/bookings/active/'+this.props.data.threadId+'/confirmation/details').on(
        'value', snapshot => {
          if(snapshot.val() != '-')
            this.setState(snapshot.val());
          else
            this.setState({
              dept: selected.dept,
              arr: selected.arr,
              fare: selected.fare,
              date: selected.date
             });
        }
      )
  }

  send() {
    fire.database().ref(
      '/bookings/active/'+this.props.data.threadId+'/confirmation/details').update(this.state);
  }

  render() {
    return(
      <Col style={{maxWidth:'100%'}} className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Booking Confirmation</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      Booking Details
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Departure City
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-username"
                              placeholder="City Name"
                              type="text"
                              value={this.state.dept}
                              onChange={dept => this.setState({ dept: dept.target.value })}
                              style={{pointerEvents:!this.props.editable?'none':'auto'}}
                              defaultValue={'Hey'}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Arrival City
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="City Name"
                              type="text"
                              value={this.state.arr}
                              onChange={arr => this.setState({ arr: arr.target.value })}
                              style={{pointerEvents:!this.props.editable?'none':'auto'}}
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
                              Flight Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-first-name"
                              placeholder="Leaving Date"
                              type="date"
                              value={this.state.date}
                              onChange={date => this.setState({ date: date.target.value })}
                              style={{pointerEvents:!this.props.editable?'none':'auto'}}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Fare
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-last-name"
                              placeholder="Price"
                              type="number"
                              value={this.state.fare}
                              onChange={fare => this.setState({ fare: fare.target.value })}
                              style={{pointerEvents:!this.props.editable?'none':'auto'}}
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
                              PNR
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-first-name"
                              placeholder="PNR Number"
                              type="text"
                              value={this.state.pnr}
                              onChange={pnr => this.setState({ pnr: pnr.target.value })}
                              style={{pointerEvents:!this.props.editable?'none':'auto'}}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Flight Number
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-last-name"
                              placeholder="Flight Number"
                              type="text"
                              value={this.state.flight}
                              onChange={flight => this.setState({ flight: flight.target.value })}
                              style={{pointerEvents:!this.props.editable?'none':'auto'}}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                  </Form>
                </CardBody>
              </Card>
              <div style={{width:'80%',marginLeft:'8%', marginTop:"5%"}}>
                <StyledDropZone onDrop={(file, text) => console.log(file, text)} />
              </div>
              <Button color="info" type="button" onClick={() => this.send()} style={{ marginLeft: '20%', padding: '2%', width: '60%', marginTop: '3%' }}>
                Send Details
              </Button>
              <br/><br/>
            </Col>
          );
        }
      }


export default ConfirmationForm
