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
import {
  AddReview,
  EditReview,
  PublishedReviews,
  PublishReview,
  GenreReviews,
  CompleteReview,
  PlatformReviews,
} from './review-components';
import { Search, SearchListings } from './search-components';
import { Hash } from 'crypto';
import { createHashHistory } from 'history';
import { gameService, Game } from './services/game-services';
import { GameCard, AddGame } from './game-component';
import { UserNav } from './user-components';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

const history = createHashHistory();

class NavHeader extends Component {
  render() {
    return (
      <div>
        <NavBar brand="GS">
          <NavBar.Link to="/games">Games</NavBar.Link>
          <UserNav />
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
      <Route exact path="/games/:db_id/:igdb_id" component={GameCard}></Route>
      <Route exact path="/addGame" component={AddGame}></Route>
      <Route exact path="/addReview" component={AddReview} />
      <Route exact path="/publishReview/:id" component={PublishReview} />
      <Route exact path="/publishedReviews" component={PublishedReviews} />
      <Route exact path="/publishedReviews/:id" component={CompleteReview} />
      <Route exact path="/editReview/:id" component={EditReview} />
      <Route exact path="/genreReviews" component={GenreReviews} />
      <Route exact path="/platformReviews" component={PlatformReviews} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
