import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import {
  Card,
  Alert,
  Row,
  Form,
  Column,
  Button,
  NavBar,
  Header,
  Container,
  ColumnCentre,
  SearchResult,
} from './widgets';
import axios from 'axios';
import { HashRouter, Route } from 'react-router-dom';
import { AddReview, PublishReview } from './review-components';
import { Hash } from 'crypto';
import { createHashHistory } from 'history';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

const history = createHashHistory();

class NavHeader extends Component {
  render() {
    return (
      <div>
        <NavBar brand="GameShed">
          <NavBar.Link to="/games">Games</NavBar.Link>
        </NavBar>
        <Header></Header>
      </div>
    );
  }
}

class Search extends Component {
  input = '';
  render() {
    return (
      <>
        <Container textalign={'centre'}>
          <Row>
            <ColumnCentre width={6} offset={2}>
              <Form.Input
                type={this.input}
                value={this.input}
                placeholder="Søk etter et spill"
                onChange={(event) => (this.input = event.currentTarget.value)}
              />
            </ColumnCentre>
            <ColumnCentre width={2}>
              <Button.Success
                onClick={() => {
                  this.search();
                }}
              >
                Søk
              </Button.Success>
            </ColumnCentre>
          </Row>
        </Container>
      </>
    );
  }
  search() {
    console.log('search');
    history.push('/results');
  }
}

class SearchListings extends Component {
  render() {
    return (
      <Container>
        Søkeresultater:
        <SearchResult></SearchResult>
        <SearchResult></SearchResult>
        <SearchResult></SearchResult>
      </Container>
    );
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <NavHeader />
      <Route exact path="/" component={Search}></Route>
      <Route exact path="/results" component={SearchListings}></Route>
      <Route exact path="/addReview" component={AddReview} />
      <Route exact path="/publishReview/:id" component={PublishReview} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);

/*
class Start extends Component {
  input = '';
  stdout = '';
  stderr = '';
  errCode: number | null = null;
}



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
    <HashRouter>
      <Alert />

      <Route exact path="/" component={Start} />
      
    </HashRouter>,
    root
  );
 
 */
