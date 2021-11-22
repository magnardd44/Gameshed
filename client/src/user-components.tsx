import * as React from 'react';
import { Component } from 'react-simplified';
import { FormGroup, Form, Card, Alert, Button, Container } from './widgets';
import userService from './services/user-service';
import { createHashHistory } from 'history';

export const history = createHashHistory();

export class UserNav extends Component {
  render() {
    return (
      <>
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
          // If user is logged in
          <Button.Success
            small
            onClick={() => {
              userService.logout();
              userService.email = '';
            }}
          >
            Logout
          </Button.Success>
        ) : (
          // If user is not logged in
          <Button.Success
            small
            onClick={() => {
              userService.loginOrRegister = userService.login;
              userService.passwordPrompt = true;
            }}
          >
            Login
          </Button.Success>
        )}
        <Button.Success
          small
          onClick={() => {
            history.push('/user');
          }}
        >
          {userService.token ? 'MinSide' : 'Registrer'}
        </Button.Success>
        <PasswordPrompt />
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
              userService.loginOrRegister = userService.register;
              userService.passwordPrompt = true;
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

export class PasswordPrompt extends Component<{}> {
  hidden = false;
  password = '';
  render() {
    return (
      <div
        id="password"
        hidden={!userService.passwordPrompt}
        style={{
          position: 'fixed',
          padding: '20px',
          border: 'dashed',
          background: '#eeeeee',
          left: '35%',
          top: '30%',
          width: '30%',
          zIndex: 100,
        }}
      >
        <Form.Label>Skriv inn passord:</Form.Label>
        <Form.Input
          type="password"
          value={this.password}
          placeholder="passord"
          onChange={(event) => {
            this.password = event.currentTarget.value;
          }}
          onKeyUp={(event: any) => {
            if (event.key == 'Enter') {
              this.submit();
            }
          }}
        />
        <Button.Success
          small
          onClick={() => {
            this.submit();
          }}
        >
          Send inn
        </Button.Success>
        <Button.Light
          small
          onClick={() => {
            this.cancel();
          }}
        >
          Avbryt
        </Button.Light>
      </div>
    );
  }

  submit() {
    userService.passwordPrompt = false;
    let password = this.password;
    this.password = '';
    if (userService.email.length && password?.length) {
      userService
        .loginOrRegister(userService.email, password)
        .catch((err) => Alert.warning(<>Feil brukarnavn eller passord</>));
    } else {
      Alert.info(<>Skriv inn brukarnavn og passord</>);
    }
  }

  cancel() {
    userService.passwordPrompt = false;
    this.password = '';
  }
}
