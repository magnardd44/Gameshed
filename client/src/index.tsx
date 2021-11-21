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
  CompleteReview,
  MyReviews,
} from './review-components';

import { Hash } from 'crypto';
import { createHashHistory } from 'history';
import { Search, SearchListings } from './search-components';
import { GameCard, AddGame } from './game-component';
import { UserNav, UserPage } from './user-components';
import { Category } from './genre-components';
import { Platform } from './platform-components';
import { Home, ReviewHome } from './home-components';
import userService from './services/user-service';
import { TopTenStars, LastTen } from './recommend-components';

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
export class NavHeader extends Component {
  render() {
    return (
      <>
        <JustifiedNavBar justify="end">
          <UserNav />
        </JustifiedNavBar>
        <JustifiedNavBar justify="start" brand="GS">
          <NavBarLink to="/search">Søk spill</NavBarLink>
          <NavBarLink to="/reviews">Anmeldelser</NavBarLink>
          <NavBarLink to="/addGame">Legg til spill</NavBarLink>
          {userService.token ? <NavBarLink to={'/myReviews'}>Mine anmeldelser</NavBarLink> : ''}
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
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/search" component={Search}></Route>
      <Route exact path="/results" component={SearchListings}></Route>
      <Route exact path="/games/:db_id/:igdb_id" component={GameCard}></Route>
      <Route exact path="/addGame" component={AddGame}></Route>
      <Route exact path="/reviews" component={ReviewHome} />
      <Route exact path="/publishedReviews" component={PublishedReviews} />
      <Route exact path="/publishedReviews/:id" component={CompleteReview} />
      <Route exact path="/addReview/:db_id/:igdb_id" component={AddReview} />
      <Route exact path="/publishReview/:id" component={PublishReview} />

      <Route exact path="/editReview/:id" component={EditReview} />
      <Route exact path="/myReviews" component={MyReviews} />

      <Route exact path="/reviews-by-genre" component={Category}></Route>
      <Route exact path="/reviews-by-platform" component={Platform}></Route>
      <Route exact path="/reviews-by-stars" component={TopTenStars}></Route>
      <Route exact path="/reviews-by-date" component={LastTen}></Route>

      <Route exact path="/user" component={UserPage} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
