import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class DialogChangeName extends React.Component {
  state = {
    open: false,
    initialName: ''
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    const newName = this.refs.newName.getValue();
    this.props.onChangeName(newName);
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Rename"
        primary={true}
        onClick={this.handleClose.bind(this)}
      />,
    ];

    return (
      <div>
        <Dialog
          title="What is your name?"
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose}
        >
          <TextField 
            ref="newName"
            defaultValue={this.props.initialName}
            autoFocus={true}
            hintText="Write your name"
            fullWidth={true}
            />
        </Dialog>
      </div>
    );
  }

}