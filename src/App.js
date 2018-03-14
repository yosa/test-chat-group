import React, { Component } from 'react';
import './App.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/fontawesome-free-solid';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import io from 'socket.io-client';
import faker from 'faker';
import { markdown } from 'markdown';
import DialogChangeName from './DialogChangeName'
import moment from 'moment'

class App extends Component {

  constructor(props) {
    super(props);
    const me = this;
    const config = require('../package.json')
    const socket = io(`${window.location.hostname !== 'localhost' ? config.homepage : 'localhost'}:3001`)
    me.state = {
      openDialogChangeName: false,
      connected: false,
      socket: socket,
      messages: [],
      username: `${faker.name.firstName()} ${faker.random.number()}`,
      users: []
    };
    
    socket.on('connect', me.onSocketConnect.bind(me));
    socket.on('message', me.onSocketMessage.bind(me));
    socket.on('disconnect', me.onSocketDisConnect.bind(me));
    socket.on('user.connected', me.onSocketUserConnected.bind(me));
  }

  onSocketUserConnected (user) {
    this.state.users.push(user)
    this.setState({
      users: this.state.users
    })
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
    const me = this
    me.setState({
      connected: true
    })
    me.state.socket.emit('user.connected', {
      id: me.state.socket.id,
      username: me.state.username,
      date: moment().format('YYYY-MM-DD h:mm a')
    })
  }

  getMarkdownMessage (message) {
    return <div className="message-html" dangerouslySetInnerHTML={{__html:markdown.toHTML(message) }} /> 
  }

  onKeypressMessage (e) {
    const message = e.target.value;
    const me = this;

    if (e.key !== 'Enter' || !message) {
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
      date: moment().format('YYYY-MM-DD h:mm a')
    });
    me.setState({
      messages: me.state.messages
    });
  }

  sendMessage (message) {
    const me = this;
    const messageObject = {
      message: message,
      username: me.state.username
    };
    me.addMessage(messageObject)
    me.state.socket.emit('message', messageObject);
  }

  onClickAvatar () {
    this.setState({
      openDialogChangeName: true
    });
  }

  onChangeName (name) {
    if (!name) {
      this.setState({
        openDialogChangeName: false
      });
      return;
    }
    this.setState({
      username: name,
      openDialogChangeName: false
    });
  }

  getMessatePrimaryText (item) {
    return `${item.username} - ${item.date}`
  }

  renderUsers () {
    return this.state.users.map(user =>
      <ListItem
        key={user.id}
        primaryText={this.getMessatePrimaryText(user)}
        leftAvatar={<FontAwesomeIcon className="message-avatar" icon={faUserCircle} />}
      />
    )
  }

  renderMessages () {
    return this.state.messages.map(item => 
      <ListItem
        key={item.id}
        primaryText={this.getMessatePrimaryText(item)}
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
            title="Chat group"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <List className="App-list-messages">
          <Subheader inset={true}>Messages</Subheader>
            {
              this.renderMessages()
            }
          </List>
        </MuiThemeProvider>
        <MuiThemeProvider>
        <List className="App-list-users">
          <Subheader inset={true}>Users online</Subheader>
            {
              this.renderUsers()
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
              hintText="Write the message"
              fullWidth={true}
              onKeyPress={this.onKeypressMessage.bind(this)}
              disabled={!this.state.connected}
            />
          </Toolbar>  
        </MuiThemeProvider>
        <MuiThemeProvider>
          <DialogChangeName 
            initialName={this.state.username}
            open={this.state.openDialogChangeName}
            onChangeName={this.onChangeName.bind(this)}/>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
