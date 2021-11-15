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
  JustifiedNavBar,
  NavBar,
  NavBarLink,
  Container,
  ColumnCentre,
  Heading,
} from './widgets';
import { NavLink } from 'react-router-dom';
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
import { UserNav, UserPage } from './user-components';
import { Category } from './genre-components';
import { Platform } from './platform-components';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export const history = createHashHistory();

/**<NavBar.Link to="/games">Games</NavBar.Link>
 *  <div>
          <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="container-fluid justify-content-end">
              <NavLink className="navbar-brand" activeClassName="active" exact to="/"></NavLink>
              <div className="navbar-nav">
                <UserNav />
              </div>
            </div>
          </nav>
        </div>
 * 
 */
class NavHeader extends Component {
  render() {
    return (
      <>
        <JustifiedNavBar justify="end">
          <UserNav />
        </JustifiedNavBar>
        <JustifiedNavBar justify="start" brand="GS">
          <NavBarLink to="">Søk</NavBarLink>
        </JustifiedNavBar>
        <Row>
          <Heading header></Heading>
        </Row>
      </>
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
      <Route exact path="/addReview/:db_id/:igdb_id" component={AddReview} />
      <Route exact path="/publishReview/:id" component={PublishReview} />
      <Route exact path="/publishedReviews" component={PublishedReviews} />
      <Route exact path="/publishedReviews/:id" component={CompleteReview} />
      <Route exact path="/editReview/:id" component={EditReview} />
      <Route exact path="/genreReviews" component={GenreReviews} />
      <Route exact path="/reviews-by-genre" component={Category}></Route>
      <Route exact path="/reviews-by-platform" component={Platform}></Route>
      <Route exact path="/platformReviews" component={PlatformReviews} />
      <Route exact path="/user" component={UserPage} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
