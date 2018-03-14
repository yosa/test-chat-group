import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/fontawesome-free-solid';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import io from 'socket.io-client';
import faker from 'faker';
import { markdown } from 'markdown';

class App extends Component {
  constructor(props) {
    super(props);
    const me = this;
    const socket = io('localhost:3001')
    this.state = {
      connected: false,
      socket: socket,
      messages: [],
      username: `${faker.name.firstName()} - ${faker.random.number()}`
    };
    
    socket.on('connect', me.onSocketConnect.bind(me));
    socket.on('message', me.onSocketMessage.bind(me));
    socket.on('disconnect', me.onSocketDisConnect.bind(me));
  }

  onSocketDisConnect () {
    this.setState({
      connected: false
    })
    console.log('disconnect')
  }

  onSocketMessage (message) {
    const me = this;
    me.addMessage(message);
  }

  onSocketConnect () {
    this.setState({
      connected: true
    })
    console.log('connect')
  }

  getMarkdownMessage (message) {
    return <div className="message-html" dangerouslySetInnerHTML={{__html:markdown.toHTML(message) }} /> 
  }

  onKeypressMessage (e) {
    const message = e.target.value;
    const me = this;

    if (e.key !== 'Enter') {
      return
    }
    e.preventDefault();
    e.target.value = '';
    me.sendMessage(message);
  }

  addMessage (messageObject) {
    const me = this;
    me.state.messages.push({
      id: me.state.messages.length + 1,
      message: messageObject.message,
      username: messageObject.username,
      isMy: messageObject.isMy
    });
    me.setState({
      messages: me.state.messages
    });
  }

  sendMessage (message) {
    const me = this;
    const messageObject = {
      isMy: true,
      message: message,
      username: me.state.username
    };
    me.addMessage(messageObject)
    me.state.socket.emit('message', messageObject);
  }

  onClickAvatar () {
    console.log('hola')
  }

  getItemClass (item) {
    console.log(item)
    return item.isMy ? 'message-my' : '';
  }

  renderMessages () {
    return this.state.messages.map(item => 
      <ListItem
        className={this.getItemClass(item)}
        key={item.id}
        primaryText={item.username}
        secondaryText={this.getMarkdownMessage(item.message)}
        leftAvatar={<FontAwesomeIcon className="message-avatar" icon={faUserCircle} />}
      />
    )
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <AppBar
            title="Chat grupal"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <List>
            <Subheader>Mensajes</Subheader>
            {
              this.renderMessages()
            }
          </List>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Toolbar className="App-footer">
            <Avatar 
              className="App-avatar" 
              icon={<FontAwesomeIcon icon={faUserCircle} />} 
              onClick={this.onClickAvatar.bind(this)}
            />
            <TextField 
              className="App-message"
              hintText="Escribe el mensaje"
              fullWidth={true}
              onKeyPress={this.onKeypressMessage.bind(this)}
              disabled={!this.state.connected}
            />
          </Toolbar>  
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
