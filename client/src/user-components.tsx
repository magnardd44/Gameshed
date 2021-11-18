import * as React from 'react';
import { Component } from 'react-simplified';
import { Form, Card, Alert, Button, Container, Column } from './widgets';
import userService from './services/user-service';
//import { history } from './index';
import { createHashHistory } from 'history';
//
const history = createHashHistory();

export class UserNav extends Component {
  //password: string = '';

  render() {
    return (
      <>
        <Button.Success
          small
          onClick={() => {
            userService.login('admin', 'admin').then(() => Alert.success(<>Logged inn as admin</>));
            //this.password = '';
          }}
        >
          DebugAdmin
        </Button.Success>
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
          //            //  type="text"
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
              //console.log(userService.email.length ? true : false);
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
            //if(history.location.pathname != '/user')  history.push('/user')
            //                this.password = '';
            //                userService.register(this.input, this.password)
            //				.then(()=> history.push('/user'))
            //				.catch(()=> history.push('/user')
            //				);
            //				:
          }}
        >
          {userService.token ? 'MinSide' : 'Registrer'}
        </Button.Success>
      </>
    );
  }
}

export class UserData extends Component {
  render() {
    return (
      <Card title="Brukerdata">
        <Form.Label>
          Brukarnavn
          <Form.Input
            id="inputName"
            type="text"
            value={userService.name}
            placeholder="Brukernavn"
            onChange={(event) => {
              userService.name = event.currentTarget.value;
            }}
          />
        </Form.Label>

        <Form.Label>
          Epost
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
        </Form.Label>

        <Form.Label>
          Om meg
          <Form.Textarea
            id="inputAbout"
            type="text"
            value={userService.about}
            placeholder="Om meg"
            onChange={(event) => {
              userService.about = event.currentTarget.value;
            }}
          />
        </Form.Label>
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
            userService.set_user().then(() => Alert.success(<>Oppdatert bruker</>));
          }}
        >
          Oppdater bruker
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
            let newPassword = prompt('Skriv inn passord');
            if (newPassword?.length) {
              userService
                .register(userService.email, newPassword)
                .then(() => Alert.success(<>Ny bruker registrert</>));
            } else {
              Alert.info(<>Skriv inn passord</>);
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
        <UserData />
        {userService.token ? <UserPersonal /> : <UserRegister />}
      </>
    );
  }
}
