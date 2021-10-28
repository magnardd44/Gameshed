import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { Card, Alert, Row, Form, Column, Button, NavBar } from './widgets';
import axios from 'axios';
import { HashRouter, Route } from 'react-router-dom';
import { Hash } from 'crypto';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

class Menu extends Component {
  render() {
    return (
      <NavBar brand="GameShed">
        <NavBar.Link to="/games">Games</NavBar.Link>
      </NavBar>
    );
  }
}

class Start extends Component {
  input = '';
  stdout = '';
  stderr = '';
  errCode: number | null = null;

  render() {
    return (
      <>
        <Card title="GameShed">
          <Row>
            <Column width={5}>
              <Form.Label></Form.Label>
              <Form.Textarea
                value={this.input}
                onChange={(event) => (this.input = event.currentTarget.value)}
              />
            </Column>

            <Column>
              <Button.Success
                onClick={() => {
                  axios
                    .post<{ exitStatus: number; stdout: string; stderr: string }>('/run', {
                      language: 'js',
                      source: this.input,
                    })
                    .then((response) => {
                      this.errCode = response.data.exitStatus;
                      this.stdout = response.data.stdout;
                      this.stderr = response.data.stderr;
                    })
                    .catch((error: Error) =>
                      Alert.danger('Could not run app.js: ' + error.message)
                    );
                }}
              >
                Søk etter spill
              </Button.Success>
            </Column>
          </Row>
        </Card>
      </>
    );
  }
}

/*

  render() {
    return (
      <>
        <Card title="GameShed">
          <Row>
            <Column>
              <Form.Label>Søk:</Form.Label>
              <Form.Textarea
                value={this.input}
                onChange={(event) => (this.input = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Button.Success
            onClick={() => {
              axios
                .post<{ exitStatus: number; stdout: string; stderr: string }>('/run', {
                  language: 'js',
                  source: this.input,
                })
                .then((response) => {
                  this.errCode = response.data.exitStatus;
                  this.stdout = response.data.stdout;
                  this.stderr = response.data.stderr;
                })
                .catch((error: Error) => Alert.danger('Could not run app.js: ' + error.message));
            }}
          >
            Søk etter spill
          </Button.Success>
        </Card>
        <Card title="Standard output">{this.stdout}</Card>
        <Card title="Standard error">{this.stderr}</Card>
        <Card title="Errorcode">{this.errCode}</Card>
      </>
    );
  }
}


const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <>
      <Alert />
      <Start />
    </>,
    root
  );
 
 */

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Start}></Route>
    </div>
  </HashRouter>,
  document.getElementById('root')
);
