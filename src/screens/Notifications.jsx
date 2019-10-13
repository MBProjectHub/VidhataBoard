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
  Card,
  CardHeader,
  Container,
  Row
} from "reactstrap";
// core components
import EmptyHeader from "components/Headers/EmptyHeader.jsx";

class Notifications extends React.Component {
  render() {
    return (
      <>
        <EmptyHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Personal Notification</h3>
                </CardHeader>
                <div class="container">
                  <div class="row">
                    <div class="col">
                      <button type="button" class="btn btn-default" style={{ width: '100%' }}>John Doe</button>
                    </div>
                    <div class="col-md-auto">
                      <span class="lead"><i>To</i></span>
                    </div>
                    <div class="col">
                      <div class="form-group">
                        <input type="email" class="form-control form-control-alternative" style={{ width: '100%' }} id="exampleFormControlInput1" placeholder="Receiver Email"/>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                    <form style={{ marginBottom: 20 }}>
                      <textarea class="form-control form-control-alternative" rows="3" placeholder="Enter Custom Notification..."></textarea>
                    </form>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Notifications;
