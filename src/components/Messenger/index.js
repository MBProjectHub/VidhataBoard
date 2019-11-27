import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {Row, Col, Container, Button} from 'reactstrap'

import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

import { Dropdown, Input } from 'semantic-ui-react'

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import './Messenger.css';
import ConversationSearch from '../ConversationSearch';
import '../ConversationList.css';
import '../ConversationListItem.css';
import ProfileCard from '../ProfileCard'
import RequestForm from '../RequestForm'

export default class Messenger extends React.Component {
  state = {
    conversations:[
      {name: "Romário da Rosa",
      photo: "https://randomuser.me/api/portraits/men/67.jpg",
      text: "Google",
      stage: 0},
      {photo: "https://randomuser.me/api/portraits/women/24.jpg",
      name: "Sonia Pearson",
      text: "Facebook",
      stage: 0},
      {photo: "https://randomuser.me/api/portraits/men/72.jpg",
      name: "Tim West",
      text: "Amazon",
      stage: 1},
      {photo: "https://randomuser.me/api/portraits/men/69.jpg",
      name: "Luke Clarke",
      text: "Lenovo",
      stage: 1},
      {photo: "https://randomuser.me/api/portraits/men/54.jpg",
      name: "Gordon Chambers",
      text: "Redmi",
      stage: 2},
      {name: "Romário da1 Rosa",
      photo: "https://randomuser.me/api/portraits/men/67.jpg",
      text: "Google",
      stage: 2},
      {photo: "https://randomuser.me/api/portraits/women/24.jpg",
      name: "Sonia1 Pearson",
      text: "Facebook",
      stage: 3},
      {photo: "https://randomuser.me/api/portraits/men/72.jpg",
      name: "Tim1 West",
      text: "Amazon",
      stage: 3},
      {photo: "https://randomuser.me/api/portraits/men/69.jpg",
      name: "Luke1 Clarke",
      text: "Lenovo",
      stage: 0},
      {photo: "https://randomuser.me/api/portraits/men/54.jpg",
      name: "Gordon1 Chambers",
      text: "Redmi",
      stage: 2}
    ],

    currentProgressStage:"",
    currentSelected:"",
    currentConversation:{},
    cardOptions:[]

    }

  ClickRequest(conversation)
  {
    this.state.conversations.forEach(conversation => {
      document.getElementById(conversation.name).style.background = "#fff"
      });
      document.getElementById(conversation.name).style.background = "#eeeef1"
      this.setState({currentSelected:conversation.name, currentProgressStage:conversation.stage, currentConversation: conversation})
  }

  MouseOverRequest(conversation)
  {
    if(this.state.currentSelected!==conversation.name)
      document.getElementById(conversation.name).style.background = "#eeeef1"
  }

  MouseOutRequest(conversation)
  {
    if(this.state.currentSelected!==conversation.name)
      document.getElementById(conversation.name).style.background = "#fff"
  }

  renderProgressBar()
  {
    const theme = createMuiTheme({
      typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        color:'#fff'
      },
    });

    let steps = ['Initiate Request', 'Flight Options', 'Booking Confirmation', 'Travel Complete'];
    if(this.state.currentProgressStage==="")
    return
    else
    {
      return <ThemeProvider  theme={theme}>
        <Stepper style={{height:100, padding:10, backgroundColor:'transparent'}} alternativeLabel activeStep={this.state.currentProgressStage}>
      {steps.map(label => (
        <Step  key={label}>
        <StepLabel label= {{color:'#fff'}} style={{color:'#fff'}} onClick={()=>{console.log("hi")}}>
          {label}
        </StepLabel>
        </Step>
      ))}
    </Stepper>
    </ThemeProvider>
    }
  }


  renderBookingOptions()
  {
    console.log('sdsd')
    return this.state.cardOptions.map(cards=>{
      return cards
    })
  }

  loadContent(conversation)
  {
    const countryOptions = [
      { key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
      { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' },
      { key: 'al', value: 'al', flag: 'al', text: 'Albania' },
      { key: 'dz', value: 'dz', flag: 'dz', text: 'Algeria' },
      { key: 'as', value: 'as', flag: 'as', text: 'American Samoa' },
    ]

    if(conversation.stage == 0)
    {
      return <div style={{height:'70%',paddingTop:'3%',marginTop:'2%',marginBottom:'2%', paddingBottom:'3%', overflowY:'scroll', width:'100%'}}>
      <RequestForm editable={false}/>
    </div>
    }
    else if(conversation.stage == 1)
    {
      return <div style={{height:'75%', marginBottom:'2%',paddingLeft:'7%', paddingTop:'4%', paddingBottom:'4%', overflowY:'scroll', width:'100%',backgroundColor:'#f8f9fe'}}>

      {this.renderBookingOptions()}

      <a class="ui card" onClick={()=>{
        let cardOptions = this.state.cardOptions
        cardOptions.push(
        <div><a class="ui card"style={{ background:'#fff', width:'50%', boxShadow:'0 5px 9px 0 #fafafa, 0 0 0 1px #fafafa', marginBottom:'3%'}}>
        <div class="content">
        <div class="header" style={{marginBottom:'5px'}}>Choose Flight</div>
      <Dropdown
    placeholder='Select Country'
    fluid
    search
    selection
    options={countryOptions}
  />
    <div style={{display:'flex', flexDirection:'row',alignItems:'center', marginTop:'3%'}}>
    <Input style={{width:'31%', marginRight:'20%'}} label='To' placeholder='mysite.com' />
    <Input style={{width:'31%'}} label='From' placeholder='mysite.com' />
    </div>
    </div>
    <div class="extra content">
      <div class="ui two buttons">
        <button class="ui negative button">Delete</button>
      </div>
        </div>
      </a></div>
      )
      this.setState({cardOptions:cardOptions})
      }}  style={{border:'2px dashed rgb(94, 114, 228)', background:'#5e72e450', width:'50%', height:'25%', boxShadow:'0 5px 9px 0 #d4d4d5, 0 0 0 1px #d4d4d5'}}>
      <div class="content" style={{display:'flex',alignItems:'center', justifyContent:'center',}}>
        <img src={require('../../assets/img/icons/common/plus.png')} style={{width:50, height:50}}/>
      </div>
    </a>
    </div>
    }
    else
    {
      return <div style={{height:'70%',paddingTop:'3%',marginTop:'2%',marginBottom:'2%', paddingBottom:'3%', overflowY:'scroll', width:'100%'}}>


      <RequestForm editable={true}/>


      <div style={{width:'80%',marginLeft:'8%', marginTop:"5%"}}>
      <StyledDropZone onDrop={(file, text) => console.log(file, text)} />
      </div>

    </div>
    }
  }

  loadStage()
  {
    if(this.state.currentSelected!=="")
    {
      return <div style={{width:'100%',height: window.innerHeight, position:'relative'}}>
      <Container style={{padding:0}}>
        <Row  style={{height:'30%',backgroundColor:'#FAFAFA', boxShadow: '0 5px 5px rgba(0,0,0,0.22)', marginRight:0, marginLeft:0}}>
          <Col>
          <ProfileCard company={this.state.currentConversation.text} employee={this.state.currentConversation.name} />
          </Col>
          <Col>
          <div>
          {this.renderProgressBar()}
          </div>
          </Col>
        </Row>
        </Container>

        {this.loadContent(this.state.currentConversation)}
    </div>

    }
  }

  render()
  {

    console.log(this.state.cardOptions)
    return (
      <div className="messenger" style={{flex : 1}}>

        <div className="scrollable sidebar" style={{height: window.innerHeight}}>
        <div className="conversation-list">
          <ConversationSearch placeholder="Search Bookings"/>
          {
            this.state.conversations.map(conversation =>
              <div id={conversation.name} className="conversation-list-item"
                onClick={this.ClickRequest.bind(this, conversation)}
                onMouseOver = {this.MouseOverRequest.bind(this,conversation)}
                onMouseOut = {this.MouseOutRequest.bind(this,conversation)}>

                <img className="conversation-photo" src={conversation.photo} alt="conversation" />
                <div className="conversation-info">
                  <h1 className="conversation-title">{ conversation.name }</h1>
                  <p className="conversation-snippet">{ conversation.text }</p>
                </div>

              </div>
            )
          }
        </div>
        </div>
          {this.loadStage()}
          <div  style={{position:'absolute', top: '100%', width:'100%',height:'9%', backgroundColor:'#FAFAFA', boxShadow: '0 -10px 15px -10px rgba(0,0,0,0.22)'}}>
            <Button color="primary" type="button" style={{position:'absolute',right:'5%', bottom:'20%'}}>
              Handle Request
            </Button>
          </div>
      </div>
    );
  }
}
