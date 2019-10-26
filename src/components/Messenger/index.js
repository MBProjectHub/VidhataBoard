import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {Row, Col, Container, Button} from 'reactstrap'


import { Card as SemanticCard } from 'semantic-ui-react'

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
    currentConversation:{}

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

  loadContent(conversation)
  {
    if(conversation.stage == 0)
    {
      return <div style={{height:'70%',paddingTop:'3%',marginTop:'2%',marginBottom:'2%', paddingBottom:'3%', overflowY:'scroll', width:'100%'}}>
      <RequestForm />
    </div>
    }
    else
    {
      return <SemanticCard
      href='#card-example-link-card'
      header='Elliot Baker'
      meta='Friend'
      description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
    />
    }
  }

  loadStage()
  {
    if(this.state.currentSelected!=="")
    {
      return <div style={{width:'100%',height: window.innerHeight*0.8, position:'relative'}}>
      <Container style={{padding:0}}>
        <Row  style={{height:'30%',backgroundColor:'#FAFAFA', boxShadow: '0 5px 5px rgba(0,0,0,0.22)', marginRight:0, marginLeft:0}}>
          <Col>
          <ProfileCard company={this.state.currentConversation.text} employee={this.state.currentConversation.name}/>
          </Col>
          <Col>
          <div> 
          {this.renderProgressBar()}
          </div>
          </Col>
        </Row> 
        </Container> 

        {this.loadContent(this.state.currentConversation)}

        <div  style={{position:'absolute' ,bottom :0 , width:'100%',height:'12%', backgroundColor:'#FAFAFA', boxShadow: '0 -10px 15px -10px rgba(0,0,0,0.22)'}}>
        <Button color="primary" type="button" style={{position:'absolute',right:'5%', bottom:'20%'}}>
          Handle Request
        </Button>          
        </div>
    </div>
      
    }
  }

  render()
  {
    return (
      <div className="messenger" style={{height: window.innerHeight*0.8}}>
       
        <div className="scrollable sidebar" style={{height:'100%'}}>
        <div className="conversation-list">
          <ConversationSearch />
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

      </div>
    );
  }
}