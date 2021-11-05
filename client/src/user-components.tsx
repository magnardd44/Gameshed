import * as React from 'react';
import { Component } from 'react-simplified';
import { Form, Button } from './widgets';
import userService from './services/user-service';

export class UserNav extends Component {
  input: string = '';
  password: string = '';

  render() {
    return (
      <>
        <Form.Label>Brukernamn:</Form.Label>
        <Form.Input
          type="text"
          value={this.input}
          placeholder="Epost"
          disabled={userService.token}
          onChange={(event) => {
            this.input = event.currentTarget.value;
          }}
        />
        {userService.token ? (
          // If user logged in
          <>
            <Button.Success
              onClick={() => {
                userService.logout();
                this.input = '';
                this.password = '';
              }}
            >
              Logout
            </Button.Success>
            <Button.Danger
              onClick={() => {
                userService.delete();
                // this.input = '';
                // this.password = '';
              }}
            >
              Slett meg
            </Button.Danger>
          </>
        ) : (
          // else user not logged
          <>
            <Form.Input
              type="text"
              value={this.password}
              placeholder="Passord"
              onChange={(event) => {
                this.password = event.currentTarget.value;
              }}
            />
            <Button.Success
              onClick={() => {
                userService.login(this.input, this.password);
                this.password = '';
              }}
            >
              Login
            </Button.Success>
            <Button.Success
              onClick={() => {
                userService.register(this.input, this.password);
                this.password = '';
              }}
            >
              Registrer
            </Button.Success>
          </>
        )}
      </>
    );
  }
}
