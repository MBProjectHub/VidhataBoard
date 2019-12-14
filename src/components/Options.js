import React from "react";
import fire from '../config/firebaseConfig';
// reactstrap components
import {
  Button,
  Alert,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input as TextInput
} from "reactstrap";

import { Input } from 'semantic-ui-react';

class Options extends React.Component {

  state = {
    cardOptions:[],
    data : {
      opts: [],
      choice: -1,
      status: 0
    }
  }

  componentDidMount() {
    let temp = this.props.data.bookings.active[this.props.data.threadId];
    if(temp && temp.options != '-')
    {
        var data = temp.options;
        if(!data.opts)
          data['opts'] = [];
        this.setState({ data: data, cardOptions: [] }, () => {
          for(var i=0; i < this.state.data.opts.length; i++)
            this.addOption(this.state.cardOptions, i, false);
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
  if(prevProps != this.props) {
    let temp = this.props.data.bookings.active[this.props.data.threadId];
    if(temp && temp.options != '-')
    {
        var data = temp.options;
        if(!data.opts)
          data['opts'] = [];
          fire.database().ref('/users/'+this.props.data.bookings.active[this.props.data.threadId].uid).once('value', snapshot => {
            this.setState({ data: data, approver: snapshot.val().approver, cardOptions: [] }, () => {
              for(var i=0; i < this.state.data.opts.length; i++)
                this.addOption(this.state.cardOptions, i, false);
            });
          });
    }
  }
}

  getTimestamp(h,m) {
    var t = new Date();
    t.setHours(t.getUTCHours() + h);
    t.setMinutes(t.getUTCMinutes() + m);

    var timestamp =
        t.getUTCFullYear() + "_" +
        ("0" + (t.getMonth()+1)).slice(-2) + "_" +
        ("0" + t.getDate()).slice(-2) + "_" +
        ("0" + t.getHours()).slice(-2) + "_" +
        ("0" + t.getMinutes()).slice(-2) + "_" +
        ("0" + t.getSeconds()).slice(-2) + "_" +
        ("0" + t.getMilliseconds()).slice(-2);

    return timestamp;
  }

  send() {
    this.props.load();
    let data = this.state.data;

    for(var i=0; i < data.opts.length; i++)
    {
      if(!data.opts[i].dept)
        data.opts[i]['dept'] = this.props.data.bookings.active[this.props.data.threadId].request.details.dept;
      if(!data.opts[i].arr)
        data.opts[i]['arr'] = this.props.data.bookings.active[this.props.data.threadId].request.details.arr;
      if(!data.opts[i].date)
        data.opts[i]['date'] = this.props.data.bookings.active[this.props.data.threadId].request.details.ddate;
    }
    let newData = this.props.data.bookings.active[this.props.data.threadId];
    newData.Ustage = 1;
    newData.options.opts = data.opts;
    newData.options.choice = data.choice;
    newData.options.status = data.status;
    let timestamp = this.getTimestamp(5,30);
    let temp = timestamp.split('_');
    let formatted = temp[2]+'-'+temp[1]+'-'+temp[0]+' '+temp[3]+':'+temp[4];
    newData.options.arrivedAt = formatted;

    temp = {};
    temp['/users/'+newData.uid+'/bookings/'+this.props.data.threadId] = {};
    temp['/users/'+newData.uid+'/bookings/'+'booking_'+timestamp] = '-';

    temp['/bookings/active/'+this.props.data.threadId] = {};
    temp['/bookings/active/'+'booking_'+timestamp] = newData;

    fire.database().ref().update(temp);
    this.props.updateId('booking_'+timestamp);
  }

  cardStatus(cardId) {
    if(cardId === this.state.data.choice)
    {
      if(this.state.data.status == 1) {
        return (
          <div>
            <Alert color="info" style={{ marginTop: '3%', textAlign: 'center' }}>
              <img src={require('../assets/img/icons/common/tick.png')} style={{width:15, height:15, marginRight: 10}}/>
              Selected Flight Option
            </Alert>
          </div>
        );
      } else if(this.state.data.status == 2) {
        return (
          <div>
            <Alert color="success" style={{ marginTop: '3%', textAlign: 'center' }}>
              <i className="fa fa-thumbs-up" style={{ marginRight: 10 }} />
              Flight Option Approved
            </Alert>
          </div>
        );
      } else if(this.state.data.status == 3) {
        return (
          <div>
            <Alert color="danger" style={{ marginTop: '3%', textAlign: 'center' }}>
              <i className="fa fa-thumbs-down" style={{ marginRight: 10 }} />
              Flight Option Rejected
            </Alert>
          </div>
        );
      }
    }
  }

  delOption(cardId) {
    let temp = this.state.data;
    temp.opts.splice(cardId,1);
    this.setState({ data: temp, cardOptions: [] }, () => {
      for(var i=0; i < this.state.data.opts.length; i++)
        this.addOption(this.state.cardOptions, i, false);
    });
  }

  addOption(arr, i, updateOpts) {
    let cardOptions = arr;
    let opts = this.state.data.opts;
    if(updateOpts)
      opts.push({});
    cardOptions.push(
    <div>
      <a class="ui card" style={{ background:'#fff', width:'90%', boxShadow:'0 5px 9px 0 #fafafa, 0 0 0 1px #fafafa', marginBottom:'3%'}}>
        <div class="content">
          <div style={{display:'flex', flexDirection:'row', alignItems:'center' }}>
            <div class="header" style={{ marginTop: 0 }}><b>Flight Option</b></div>
            <button id={i} class="ui negative button" onClick={e => this.delOption(e.target.getAttribute('id'))}
              style={{ marginLeft: '70%', marginTop: 0, backgroundColor: '#ff726f', paddingTop: 6, paddingBottom: 7 }}>
                Delete
            </button>
          </div>
          <div style={{display:'flex', flexDirection:'row',alignItems:'center', marginTop:'3%'}}>
            <Input id={i} style={{width:'50%', marginRight:'5%'}} label='From' placeholder='Departure City'
                onChange={e => { opts[e.target.getAttribute('id')]['dept'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].dept?this.state.data.opts[i].dept:this.props.data.bookings.active[this.props.data.threadId].request.details.dept}
              />
            <Input id={i} style={{width:'50%'}} label='To' placeholder='Arrival City'
              onChange={e => { opts[e.target.getAttribute('id')]['arr'] = e.target.value; this.forceUpdate(); }}
              defaultValue={this.state.data.opts[i].arr?this.state.data.opts[i].arr:this.props.data.bookings.active[this.props.data.threadId].request.details.arr}
            />
          </div>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:'3%'}}>
            <div style={{alignItems:'center', width: '50%', marginTop:'3%', marginRight: '5%'}}>
              <InputGroup>
                <InputGroupAddon addonType="prepend" style={{ height: 40 }}>
                  <InputGroupText style={{ backgroundColor: '#E7E7E7', color: '#5c5c5c', fontWeight: 700 }}>Date</InputGroupText>
                </InputGroupAddon>
                <TextInput id={i} style={{width: 100, marginBottom: '3%', color: 'black', paddingLeft: 15}} placeholder='  Date'
                  onChange={e => { opts[e.target.getAttribute('id')]['date'] = e.target.value; this.forceUpdate(); }} type='date'
                  defaultValue={this.state.data.opts[i].date?this.state.data.opts[i].date:this.props.data.bookings.active[this.props.data.threadId].request.details.ddate}
                />
              </InputGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend" style={{ height: 40 }}>
                  <InputGroupText style={{ backgroundColor: '#E7E7E7', color: '#5c5c5c', fontWeight: 700 }}>Time</InputGroupText>
                </InputGroupAddon>
                <TextInput id={i} style={{width: 100, marginBottom: '3%', color: 'black', paddingLeft: 15}} placeholder='  Time'
                  onChange={e => { opts[e.target.getAttribute('id')]['time'] = e.target.value; this.forceUpdate(); }} type='time'
                  defaultValue={this.state.data.opts[i].time}
                />
              </InputGroup>
              <Input id={i} style={{width:'100%', marginBottom: '3%'}} label='Fare' placeholder='Price'
                onChange={e => { opts[e.target.getAttribute('id')]['fare'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].fare}
              />
              <Input id={i} style={{width:'100%', marginBottom: '3%'}} label='Airline' placeholder='Airline'
                onChange={e => { opts[e.target.getAttribute('id')]['airline'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].airline}
              />
            </div>
            <div style={{alignSelf: 'flex-start', width: '50%', marginTop:'3%'}}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Remarks</span>
              <textarea id={i} class="form-control" rows="3" placeholder="Remarks" style={{ marginTop: '3%', color: 'black' }}
                onChange={e => { opts[e.target.getAttribute('id')]['remarks'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].remarks}
              />
              {this.cardStatus(i)}
            </div>
          </div>
        </div>
      </a>
    </div>);

    if(updateOpts) {
      let temp = this.state.data;
      temp['opts'] = opts;
      this.setState({ cardOptions:cardOptions, data: temp });
    }
    else
      this.setState({ cardOptions:cardOptions });
  }

  render() {
    return(
      <div style={{height:'75%', marginBottom:'2%',paddingLeft:'7%', paddingTop:'4%', paddingBottom:'4%', overflowY:'scroll', width:'100%',backgroundColor:'#f8f9fe'}}>
        {this.state.cardOptions.map(card => card )}
        <a class="ui card" onClick={() => this.addOption(this.state.cardOptions, this.state.cardOptions.length, true)}  style={{border:'2px dashed rgb(94, 114, 228)', background:'#5e72e450', width:'90%', height:'25%', boxShadow:'0 5px 9px 0 #d4d4d5, 0 0 0 1px #d4d4d5'}}>
          <div class="content" style={{display:'flex',alignItems:'center', justifyContent:'center',}}>
            <img src={require('../assets/img/icons/common/plus.png')} style={{width:50, height:50}}/>
          </div>
        </a>
        <Button color="info" type="button" onClick={() => this.send()} style={{ marginLeft: '15%', padding: '3%', width: '60%' }}>
          Send Flight Options
        </Button>
        <br/><br/>
      </div>
      );
    }
  }


export default Options;
