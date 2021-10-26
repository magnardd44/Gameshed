import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { Card, Alert, Row, Form, Column, Button } from './widgets';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

class Start extends Component {
  input = '';
  stdout = '';
  stderr = '';
  errCode: number | null = null;

  render() {
    return (
      <>
        <Card title="app.js">
          <Row>
            <Column>
              <Form.Label>Input:</Form.Label>
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
            Run
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
