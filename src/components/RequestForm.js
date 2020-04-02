import React from "react";
import fire from "../config/firebaseConfig";
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
    dept: "",
    mealpref: "",
    seatpref: "",
    arr: "",
    ddate: "",
    rdate: "",
    email: "",
    ttype: 0,
    class: 0,
    travellers: [],
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    acity: [],
    dcity: []
  };

  componentDidMount() {
    let temp = this.props.data.bookings.active[this.props.data.threadId];
    if (temp && temp.request.details != "-")
      this.setState(temp.request.details);
    this.fetchCity(temp.request.details.arr, "acity");
    this.fetchCity(temp.request.details.dept, "dcity");
  }
  fetchCity(query, type) {
    if (query) {
      fetch(
        `https://voyager.goibibo.com/api/v2/flights_search/find_node_by_name_v2/?limit=10&v=2&search_query=${query}`,
        {
          method: "GET"
        }
      )
        .then(res => res.json())
        .then(data => {
          this.setState({
            [type]: data.data.r.map(el => {
              return {
                key: el.iata,
                value: el.iata,
                text: `${el.n} - ${el.iata} (${el.ct.n})`
              };
            })
          });
        });
    }
  }
  getNameFields(num) {
    let fields = [];

    for (var i = 0; i < num; i++) {
      fields.push(
        <Row>
          <Col lg="6">
            <FormGroup>
              <label className="form-control-label" htmlFor="input-username">
                Name
              </label>
              <Input
                className="form-control-alternative"
                id={i}
                placeholder="Traveller Name"
                type="text"
                value={this.state.travellers[i].name}
                style={{
                  pointerEvents: !this.props.editable ? "none" : "auto",
                  marginTop: "2%"
                }}
                readOnly={true}
              />
            </FormGroup>
          </Col>
          <Col lg="6">
            <FormGroup>
              <label className="form-control-label" htmlFor="input-username">
                Number
              </label>
              <Input
                className="form-control-alternative"
                id={i}
                placeholder="Traveller Number"
                type="number"
                value={this.state.travellers[i].number}
                style={{
                  pointerEvents: !this.props.editable ? "none" : "auto",
                  marginTop: "2%"
                }}
                readOnly={true}
              />
            </FormGroup>
          </Col>
        </Row>
      );
    }

    if (num > 0)
      return (
        <Row>
          <Col lg="6">
            <FormGroup>
              <label className="form-control-label" htmlFor="input-city">
                Additional Traveller Details
              </label>
              {fields.map(field => field)}
            </FormGroup>
          </Col>
        </Row>
      );
  }

  render() {
    return (
      <Col style={{ maxWidth: "100%" }} className="order-xl-1" xl="8">
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
                        <input
                          name="custom-radio-2"
                          class="custom-control-input"
                          id="customRadio5"
                          type="radio"
                          checked={this.state.ttype == 1}
                          onChange={() => this.setState({ ttype: 1 })}
                          disabled={true}
                        />
                        <label class="custom-control-label" for="customRadio5">
                          One Way
                        </label>
                      </div>
                      <div class="custom-control custom-radio mb-3">
                        <input
                          name="custom-radio-2"
                          class="custom-control-input"
                          id="customRadio6"
                          type="radio"
                          checked={this.state.ttype == 2}
                          onChange={() => this.setState({ ttype: 2 })}
                          disabled={true}
                        />
                        <label class="custom-control-label" for="customRadio6">
                          Round Trip
                        </label>
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
                        <input
                          name="custom-radio-3"
                          class="custom-control-input"
                          id="customRadio7"
                          type="radio"
                          checked={this.state.class == 1}
                          onChange={() => this.setState({ class: 1 })}
                          disabled={true}
                        />
                        <label class="custom-control-label" for="customRadio7">
                          Business
                        </label>
                      </div>
                      <div class="custom-control custom-radio mb-3">
                        <input
                          name="custom-radio-3"
                          class="custom-control-input"
                          id="customRadio8"
                          type="radio"
                          checked={this.state.class == 2}
                          onChange={() => this.setState({ class: 2 })}
                          disabled={true}
                        />
                        <label class="custom-control-label" for="customRadio8">
                          Economy
                        </label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-country"
                      >
                        Seat Preference
                      </label>

                      <Input
                        type="select"
                        id="seatpref"
                        name="seatpref"
                        className="form-control-alternative"
                        value={this.state.seatpref}
                        disabled={true}
                      >
                        <option>Any</option>
                        <option>Aisle</option>
                        <option>Middle</option>
                        <option>Window</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-country"
                      >
                        Meal Preference
                      </label>
                      <Input
                        type="select"
                        id="mealpref"
                        name="mealpref"
                        className="form-control-alternative"
                        disabled={true}
                        value={this.state.mealpref}
                      >
                        <option>Any</option>
                        <option>Veg</option>
                        <option>Non Veg</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <hr className="my-4" />
              <h6 className="heading-small text-muted mb-4">Trip Details</h6>
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
                        onChange={dept =>
                          this.setState({ dept: dept.target.value })
                        }
                        style={{
                          pointerEvents: !this.props.editable ? "none" : "auto"
                        }}
                        readOnly={true}
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
                        onChange={arr =>
                          this.setState({ arr: arr.target.value })
                        }
                        style={{
                          pointerEvents: !this.props.editable ? "none" : "auto"
                        }}
                        readOnly={true}
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
                        onChange={ddate =>
                          this.setState({ ddate: ddate.target.value })
                        }
                        style={{
                          pointerEvents: !this.props.editable ? "none" : "auto"
                        }}
                        readOnly={true}
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
                        onChange={rdate =>
                          this.setState({ rdate: rdate.target.value })
                        }
                        style={{
                          pointerEvents: !this.props.editable ? "none" : "auto"
                        }}
                        readOnly={true}
                      />
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
                        value={
                          this.state.travellers
                            ? this.state.travellers.length + 1
                            : 1
                        }
                        onChange={num =>
                          this.setState({ numTrav: num.target.value })
                        }
                        style={{
                          pointerEvents: !this.props.editable ? "none" : "auto"
                        }}
                        readOnly={true}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <div className="pl-lg-4">
                {this.getNameFields(
                  this.state.travellers ? this.state.travellers.length : 0
                )}
              </div>
              <hr className="my-4" />
            </Form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default Requestform;
