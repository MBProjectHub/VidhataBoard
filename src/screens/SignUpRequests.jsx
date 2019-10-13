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
  Badge,
  Card,
  CardHeader,
  Media,
  Table,
  Container,
  Row
} from "reactstrap";
// core components
import EmptyHeader from "components/Headers/EmptyHeader.jsx";
import IconLabelTabs from "components/IconLabelTabs.js";

var pending = ['lenovo.com','apple.com','companyX.co.in'];
var allowed = [['airasia.com','John Doe'], ['bigbazaar.com','Jack Sams'], ['teachindia.org','John Doe'], ['agame.com','Rubert']];
var rejected = [['gmail.com','Rubert'], ['qindustries.uk','Jack Sams']];

class SignUpRequests extends React.Component {

  getPending() {
    var items = [];

    for(var i=0; i<pending.length; i++)
    {
      items.push(
        <tr>
          <th scope="row">
            <Media className="align-items-center">
              <Media>
                <span className="mb-0 text-sm">
                  {pending[i]}
                </span>
              </Media>
            </Media>
          </th>
          <td>
            <Badge color="" className="badge-dot mr-4">
              <i className="bg-warning" />
              pending
            </Badge>
          </td>
          <td>
            <button type="button" class="btn btn-success">Allow</button>
            <button type="button" class="btn btn-danger">Reject</button>
          </td>
        </tr>
      );
    }

    return items;
  }

  getAllowed() {
    var items = [];

    for(var i=0; i<allowed.length; i++)
    {
      items.push(
        <tr>
          <th scope="row">
            <Media className="align-items-center">
              <Media>
                <span className="mb-0 text-sm">
                  {allowed[i][0]}
                </span>
              </Media>
            </Media>
          </th>
          <td>
            {allowed[i][1]}
          </td>
          <td>
            <button type="button" class="btn btn-danger">Move To Rejected</button>
          </td>
        </tr>
      );
    }

    return items;
  }

  getRejected() {
    var items = [];

    for(var i=0; i<rejected.length; i++)
    {
      items.push(
        <tr>
          <th scope="row">
            <Media className="align-items-center">
              <Media>
                <span className="mb-0 text-sm">
                  {rejected[i][0]}
                </span>
              </Media>
            </Media>
          </th>
          <td>
            {rejected[i][1]}
          </td>
          <td>
            <button type="button" class="btn btn-success">Move To Allowed</button>
          </td>
        </tr>
      );
    }

    return items;
  }

  pendingTable() {
    return (
      <Row className="mt-5">
        <div className="col">
          <Card className="bg-default shadow">
            <CardHeader className="bg-transparent border-0">
              <h3 className="text-white mb-0">Domain Requests</h3>
            </CardHeader>
            <Table
              className="align-items-center table-dark table-flush"
              responsive
            >
              <thead className="thead-dark">

                <tr>
                  <th scope="col">Domain</th>
                  <th scope="col">By</th>
                  <th scope="col">Action</th>
                  <th scope="col" />
                </tr>
              </thead>

              <tbody>

                {this.getPending()}

              </tbody>
            </Table>
          </Card>
        </div>
      </Row>
    );
  }

allowedTable() {
  return (
    <Row className="mt-5">
      <div className="col">
        <Card className="bg-default shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="text-white mb-0">Allowed Domains</h3>
          </CardHeader>
          <Table
            className="align-items-center table-dark table-flush"
            responsive
          >
            <thead className="thead-dark">

              <tr>
                <th scope="col">Domain</th>
                <th scope="col">By</th>
                <th scope="col">Action</th>
                <th scope="col" />
              </tr>
            </thead>

            <tbody>

              {this.getAllowed()}

            </tbody>
          </Table>
        </Card>
      </div>
    </Row>
  );
}

rejectedTable() {
  return (
    <Row>
      <div className="col">
        <Card className="bg-default shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="text-white mb-0">Rejected Domains</h3>
          </CardHeader>
          <Table
            className="align-items-center table-dark table-flush"
            responsive
          >
            <thead className="thead-dark">

              <tr>
                <th scope="col">Domain</th>
                <th scope="col">By</th>
                <th scope="col">Action</th>
                <th scope="col" />
              </tr>
            </thead>

            <tbody>

              {this.getRejected()}

            </tbody>
          </Table>
        </Card>
      </div>
    </Row>
  );
}

  render() {
    return (
      <>
        <EmptyHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Card>
            <IconLabelTabs pending={this.pendingTable()} allowed={this.allowedTable()} rejected={this.rejectedTable()} />
          </Card>
        </Container>
      </>
    );
  }
}

export default SignUpRequests;
