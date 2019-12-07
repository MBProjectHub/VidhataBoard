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
    fire.database().ref(
      '/bookings/active/'+this.props.data.threadId+'/options').on(
        'value', snapshot => {
          if(snapshot.val() != '-')
          {
            var temp = snapshot.val();
            if(!temp.opts)
              temp['opts'] = [];
            this.setState({ data: temp, cardOptions: [] }, () => {
              for(var i=0; i < this.state.data.opts.length; i++)
                this.addOption(this.state.cardOptions, i, false);
            });
          }
        }
      )
  }

  send() {
    let temp = this.state.data;

    for(var i=0; i < temp.opts.length; i++)
    {
      if(!temp.opts[i].dept)
        temp.opts[i]['dept'] = this.props.data.bookings.active[this.props.data.threadId].request.details.dept;
      if(!temp.opts[i].arr)
        temp.opts[i]['arr'] = this.props.data.bookings.active[this.props.data.threadId].request.details.arr;
      if(!temp.opts[i].date)
        temp.opts[i]['date'] = this.props.data.bookings.active[this.props.data.threadId].request.details.ddate;
    }
    fire.database().ref(
      '/bookings/active/'+this.props.data.threadId+'/options')
      .update(temp);
  }

  renderBookingOptions()
  {
    return this.state.cardOptions.map(cards=>{
      return cards
    })
  }

  cardStatus(cardId) {
    if(cardId === this.state.data.choice)
    {
      if(this.state.data.status == 1) {
        return (
          <div>
            <Alert color="success" style={{ marginTop: '3%', textAlign: 'center' }}>
              <img src={require('../assets/img/icons/common/tick.png')} style={{width:15, height:15, marginRight: 10}}/>
              Selected Flight Option
            </Alert>
          </div>
        );
      } else if(this.state.data.status == 2) {
        return (
          <div>
            <Alert color="info" style={{ marginTop: '3%', textAlign: 'center' }}>
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
                onChange={e => { opts[e.target.getAttribute('id')]['dept'] = e.target.value }}
                value={this.state.data.opts[i].dept}
                defaultValue={this.props.data.bookings.active[this.props.data.threadId].request.details.dept}
              />
            <Input id={i} style={{width:'50%'}} label='To' placeholder='Arrival City'
              onChange={e => { opts[e.target.getAttribute('id')]['arr'] = e.target.value }}
              value={this.state.data.opts[i].arr}
              defaultValue={this.props.data.bookings.active[this.props.data.threadId].request.details.arr}
            />
          </div>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:'3%'}}>
            <div style={{alignItems:'center', width: '50%', marginTop:'3%', marginRight: '5%'}}>
              <InputGroup>
                <InputGroupAddon addonType="prepend" style={{ height: 40 }}>
                  <InputGroupText style={{ backgroundColor: '#E7E7E7', color: '#5c5c5c', fontWeight: 700 }}>Date</InputGroupText>
                </InputGroupAddon>
                <TextInput id={i} style={{width: 100, marginBottom: '3%', color: 'black', paddingLeft: 15}} placeholder='  Date'
                  onChange={e => { opts[e.target.getAttribute('id')]['date'] = e.target.value }} type='date'
                  value={this.state.data.opts[i].date}
                  defaultValue={this.props.data.bookings.active[this.props.data.threadId].request.details.ddate}
                />
              </InputGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend" style={{ height: 40 }}>
                  <InputGroupText style={{ backgroundColor: '#E7E7E7', color: '#5c5c5c', fontWeight: 700 }}>Time</InputGroupText>
                </InputGroupAddon>
                <TextInput id={i} style={{width: 100, marginBottom: '3%', color: 'black', paddingLeft: 15}} placeholder='  Time'
                  onChange={e => { opts[e.target.getAttribute('id')]['time'] = e.target.value }} type='time'
                  value={this.state.data.opts[i].time}
                />
              </InputGroup>
              <Input id={i} style={{width:'100%', marginBottom: '3%'}} label='Fare' placeholder='Price'
                onChange={e => { opts[e.target.getAttribute('id')]['fare'] = e.target.value }}
                value={this.state.data.opts[i].fare}
              />
            </div>
            <div style={{alignSelf: 'flex-start', width: '50%', marginTop:'3%'}}>
              <textarea id={i} class="form-control" rows="3" placeholder="Remarks" style={{ marginTop: '3%' }}
                onChange={e => { opts[e.target.getAttribute('id')]['remarks'] = e.target.value }}
                value={this.state.data.opts[i].remarks}
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
        {this.renderBookingOptions()}
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
