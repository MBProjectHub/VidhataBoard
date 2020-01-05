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

import fire from '../config/firebaseConfig';

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
import SignUpTabs from "components/SignUpTabs.js";

class SignUpRequests extends React.Component {

  state = {
    pending : {},
    allowed : {},
    rejected : {},
    name : ''
  }

  componentDidMount() {
    fire.database().ref('/users/'+fire.auth().currentUser.uid).on('value', user => {
      fire.database().ref('/signup').on('value', snapshot => {
        if(snapshot.val() && snapshot.val().pendDom && snapshot.val().apprDom && snapshot.val().rejDom)
          this.setState({ pending: snapshot.val().pendDom, allowed: snapshot.val().apprDom, rejected: snapshot.val().rejDom, name: user.val().name })
      });
    });
  }

  allow(domain, pending) {
    let temp = {};

    if(pending)
      temp['/signup/pendDom/' + domain] = {}
    else
      temp['/signup/rejDom/' + domain] = {}

    temp['/signup/apprDom/' + domain] = { by: this.state.name, handling: 0 }

    fire.database().ref().update(temp);
  }

  reject(domain, pending) {
    let temp = {};

    if(pending)
      temp['/signup/pendDom/' + domain] = {}
    else
      temp['/signup/apprDom/' + domain] = {}

    temp['/signup/rejDom/' + domain] = this.state.name;

    fire.database().ref().update(temp);
  }

  getPending() {
    var items = [];
    let pends = Object.keys(this.state.pending);

    for(var i=0; i<pends.length; i++)
    {
      items.push(
        <tr>
          <th scope="row">
            <Media className="align-items-center">
              <Media>
                <span className="mb-0 text-sm">
                  {pends[i].replace(/\^/g,'.')}
                </span>
              </Media>
            </Media>
          </th>
          <td>
          <span className="mb-0 text-sm">
            {this.state.pending[pends[i]]}
          </span>
          </td>
          <td>
            <button type="button" class="btn btn-success" onClick={this.allow.bind(this, pends[i], true)}>Allow</button>
            <button type="button" class="btn btn-danger" onClick={this.reject.bind(this, pends[i], true)}>Reject</button>
          </td>
        </tr>
      );
    }

    return items;
  }

  getAllowed() {
    var items = [];
    let allows = Object.keys(this.state.allowed)

    for(var i=0; i<allows.length; i++)
    {
      items.push(
        <tr>
          <th scope="row">
            <Media className="align-items-center">
              <Media>
                <span className="mb-0 text-sm">
                  {allows[i].replace(/\^/g,'.')}
                </span>
              </Media>
            </Media>
          </th>
          <td>
            {allows[i].by}
          </td>
          <td>
          <div class="input-group input-group-alternative mb-4" style={{ marginTop: 20, marginLeft: '15%', width: '70%' }}>
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="ni ni-money-coins"></i></span>
            </div>
            <input
              id={allows[i]}
              class="form-control form-control-alternative"
              placeholder="Amount"
              type="text"
              value={this.state.allowed[allows[i]].handling}
              onChange={e => fire.database().ref('/signup/apprDom/'+e.target.getAttribute("id")).update({ handling: Number(e.target.value) })}
            />
          </div>
          </td>
          <td>
            <button type="button" class="btn btn-danger" onClick={this.reject.bind(this, allows[i], false)}>Move To Rejected</button>
          </td>
        </tr>
      );
    }

    return items;
  }

  getRejected() {
    var items = [];
    let rejs = Object.keys(this.state.rejected)

    for(var i=0; i<rejs.length; i++)
    {
      items.push(
        <tr>
          <th scope="row">
            <Media className="align-items-center">
              <Media>
                <span className="mb-0 text-sm">
                  {rejs[i].replace(/\^/g,'.')}
                </span>
              </Media>
            </Media>
          </th>
          <td>
            {this.state.rejected[rejs[i]]}
          </td>
          <td>
            <button type="button" class="btn btn-success" onClick={this.allow.bind(this, rejs[i], false)}>Move To Allowed</button>
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
                  <th scope="col">#Requests</th>
                  <th scope="col">Action</th>
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
                <th scope="col"><span style={{ marginLeft: '15%' }}>Handling Charge</span></th>
                <th scope="col">Action</th>
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
            <SignUpTabs pending={this.pendingTable()} allowed={this.allowedTable()} rejected={this.rejectedTable()} />
          </Card>
        </Container>
      </>
    );
  }
}

export default SignUpRequests;
