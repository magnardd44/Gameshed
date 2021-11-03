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
import { AddReview, EditReview, PublishedReviews, PublishReview } from './review-components';
import { Search, SearchResult, SearchListings } from './search-components';
import { Hash } from 'crypto';
import { createHashHistory } from 'history';
import { gameService, Game } from './services/services';
import { GameCard } from './game-component';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

const history = createHashHistory();

class NavHeader extends Component {
  render() {
    return (
      <div>
        <NavBar brand="GS">
          <NavBar.Link to="/games">Games</NavBar.Link>
        </NavBar>
        <Header></Header>
      </div>
    );
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Alert />
      <NavHeader />
      <Route exact path="/" component={Search}></Route>
      <Route exact path="/results" component={SearchListings}></Route>
      <Route exact path="/games/1" component={GameCard}></Route>
      <Route exact path="/addReview" component={AddReview} />
      <Route exact path="/publishReview/:id" component={PublishReview} />
      <Route exact path="/publishedReviews" component={PublishedReviews} />
      <Route exact path="/editReview/:id" component={EditReview} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
