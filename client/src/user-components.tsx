import * as React from 'react';
import { Component } from 'react-simplified';
import { FormGroup, Form, Card, Alert, Button, Container, Column } from './widgets';
import userService from './services/user-service';
import { createHashHistory } from 'history';

export const history = createHashHistory();

export class UserNav extends Component {
  render() {
    return (
      <>
        {
          // <Button.Success
          //   small
          //   onClick={() => {
          //     userService.login('admin', 'admin').then(() => Alert.success(<>Logged inn as admin</>));
          //     //this.password = '';
          //   }}
          // >
          //   DebugAdmin
          // </Button.Success>
        }
        <Form.Label>Brukernavn:</Form.Label>
        <Form.Input
          id="emailInput"
          type="text"
          value={userService.email}
          placeholder="Epost"
          disabled={userService.token}
          onChange={(event) => {
            userService.email = event.currentTarget.value;
          }}
        />
        {userService.token ? (
          // If user logged in
          <Button.Success
            small
            onClick={() => {
              userService.logout();
              userService.email = '';
              //this.password = '';
            }}
          >
            Logout
          </Button.Success>
        ) : (
          // else user not logged
          //          <>
          //		  {
          //            //<Form.Input
          //            //  type="password"
          //            //  value={this.password}
          //            //  placeholder="Passord"
          //            //  onChange={(event) => {
          //            //    this.password = event.currentTarget.value;
          //            //  }}
          //            ///>
          //			}
          <Button.Success
            small
            onClick={() => {
              let password = prompt('Skriv inn passord');
              if (userService.email.length && password?.length) {
                userService
                  .login(userService.email, password)
                  .catch((err) => Alert.warning(<>Feil brukarnavn eller passord</>));
              } else {
                Alert.info(<>Skriv inn brukarnavn og passord</>);
              }
              //                this.password = '';
            }}
          >
            Login
          </Button.Success>
          //</>
        )}
        <Button.Success
          small
          onClick={() => {
            history.push('/user');
          }}
        >
          {userService.token ? 'MinSide' : 'Registrer'}
        </Button.Success>
      </>
    );
  }
  mounted() {
    userService.get_user().catch((err) => {});
  }
}

export class UserData extends Component {
  render() {
    return (
      <Card title="Brukerdata">
        <FormGroup>
          <Form.Label>Brukernavn</Form.Label>
          <Form.Input
            id="inputName"
            type="text"
            value={userService.name}
            placeholder="Brukernavn"
            onChange={(event) => {
              userService.name = event.currentTarget.value;
            }}
          />
        </FormGroup>

        <FormGroup>
          <Form.Label>Epost</Form.Label>
          <Form.Input
            id="inputEmail"
            type="text"
            value={userService.email}
            disabled={userService.token}
            placeholder="Epost"
            required={true}
            onChange={(event) => {
              userService.email = event.currentTarget.value;
            }}
          />
        </FormGroup>

        <FormGroup>
          <Form.Label>Om meg</Form.Label>
          <Form.Textarea
            id="inputAbout"
            type="text"
            value={userService.about}
            placeholder="Om meg"
            onChange={(event) => {
              userService.about = event.currentTarget.value;
            }}
          />
        </FormGroup>
      </Card>
    );
  }
}

export class UserPersonal extends Component {
  render() {
    return (
      <>
        <Button.Success
          onClick={() => {
            userService
              .set_user()
              .then(() => Alert.success(<>Oppdatert bruker</>))
              .catch((err) => Alert.warning(<>Bruker ble ikke oppdatert</>));
          }}
        >
          Oppdater bruker
        </Button.Success>
        <Button.Danger
          onClick={() => {
            userService
              .delete()
              .then(() => Alert.success(<>Bruker slettet</>))
              .catch((err) => Alert.warning(<>Bruker ble ikke oppdatert</>));
            // this.input = '';
            // this.password = '';
          }}
        >
          Slett meg
        </Button.Danger>
      </>
    );
  }
  mounted() {
    let result = userService
      .get_user()
      .then()
      .catch((err) => {
        //console.log('Failed');
        //console.log(err);
      });
  }
}

export class UserRegister extends Component {
  render() {
    return (
      <>
        <Button.Success
          onClick={() => {
            if (userService.name == '' || userService.email == '' || userService.about == '') {
              Alert.warning('Fyll inn alle feltene!');
            } else {
              let newPassword = prompt('Skriv inn passord');
              if (newPassword?.length) {
                userService
                  .register(userService.email, newPassword)
                  .then(() => Alert.success(<>Ny bruker registrert</>))
                  .catch(() => Alert.danger(<>Bruker eksisterer allerede.</>));
              } else {
                Alert.warning(<>Skriv inn passord</>);
              }
            }
          }}
        >
          Registrer ny bruker
        </Button.Success>
      </>
    );
  }
}

export class UserPage extends Component {
  render() {
    return (
      <>
        <Container>
          <UserData />
          {userService.token ? <UserPersonal /> : <UserRegister />}
        </Container>
      </>
    );
  }
}
