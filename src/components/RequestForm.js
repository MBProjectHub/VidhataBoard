import React from "react";
import fire from '../config/firebaseConfig';
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

class Requestform extends React.Component {

  state = {
    dept: '',
    arr: '',
    ddate: '',
    rdate: '',
    ttype: 0,
    class: 0,
    numTrav: 1,
    travNames: []
  }

  componentDidMount() {
    let temp = this.props.data.bookings.active[this.props.data.threadId];
    if(temp && temp.request.details != '-')
      this.setState(temp.request.details);
  }

  getNameFields(num) {
    let fields = [];

    for(var i=0; i < num; i++)
    {
      fields.push(
        <Input
          className="form-control-alternative"
          id={i}
          placeholder="Traveller Name"
          type="text"
          value={this.state.travNames[i]}
          onChange={name => {
            let temp = this.state.travNames;
            temp[Number(name.target.getAttribute("id"))] = name.target.value;
            this.setState({ travNames: temp });
          }}
          style={{pointerEvents:!this.props.editable?'none':'auto', marginTop: '2%'}}
        />
      );
    }

    if(num > 0)
      return(
        <Row>
          <Col lg="6">
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-city"
              >
                Names of additional Travellers
              </label>
              {fields.map(field => field )}
            </FormGroup>
          </Col>
        </Row>
      );
  }

  render() {
    return(
      <Col style={{maxWidth:'100%'}} className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Request Form</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      Trip Details
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
                              Departure Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-first-name"
                              placeholder="Leaving Date"
                              type="date"
                              value={this.state.ddate}
                              onChange={ddate => this.setState({ ddate: ddate.target.value })}
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
                              Return Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-last-name"
                              placeholder="Returning Date"
                              type="date"
                              value={this.state.rdate}
                              onChange={rdate => this.setState({ rdate: rdate.target.value })}
                              style={{pointerEvents:!this.props.editable?'none':'auto'}}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Flight Preferences
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Trip type
                            </label>
                            <div class="custom-control custom-radio mb-3">
                              <input name="custom-radio-2" class="custom-control-input" id="customRadio5" type="radio" checked={this.state.ttype==1} onChange={() => this.setState({ ttype: 1 })} />
                              <label class="custom-control-label" for="customRadio5">One Way</label>
                            </div>
                            <div class="custom-control custom-radio mb-3">
                              <input name="custom-radio-2" class="custom-control-input" id="customRadio6" type="radio" checked={this.state.ttype==2} onChange={() => this.setState({ ttype: 2 })} />
                              <label class="custom-control-label" for="customRadio6">Round Trip</label>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Class
                            </label>
                            <div class="custom-control custom-radio mb-3">
                              <input name="custom-radio-3" class="custom-control-input" id="customRadio7" type="radio" checked={this.state.class==1} onChange={() => this.setState({ class: 1 })} />
                              <label class="custom-control-label" for="customRadio7">Business</label>
                            </div>
                            <div class="custom-control custom-radio mb-3">
                              <input name="custom-radio-3" class="custom-control-input" id="customRadio8" type="radio" checked={this.state.class==2} onChange={() => this.setState({ class: 2 })} />
                              <label class="custom-control-label" for="customRadio8">Economy</label>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    <h6 className="heading-small text-muted mb-4">
                      Additional Options
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Number of Travellers
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-city"
                              type="number"
                              value={this.state.numTrav}
                              onChange={num => this.setState({ numTrav: num.target.value })}
                              style={{pointerEvents:!this.props.editable?'none':'auto'}}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      {this.getNameFields(this.state.numTrav-1)}
                    </div>
                    <hr className="my-4" />
                  </Form>
                </CardBody>
              </Card>
            </Col>
          );
        }
      }


export default Requestform
