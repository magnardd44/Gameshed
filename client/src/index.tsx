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
} from './widgets';
import axios from 'axios';
import { HashRouter, Route } from 'react-router-dom';
import { AddReview, PublishReview } from './review-components';
import { SearchResult } from './search-components';
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
      <Route exact path="/publishReview" component={PublishReview} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
