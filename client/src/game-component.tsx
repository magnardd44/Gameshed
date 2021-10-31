import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Alert,
  Card,
  Row,
  Column,
  Form,
  Button,
  ThumbNail,
  Container,
  ColumnCentre,
  Linebreak,
} from './widgets';
import { NavLink } from 'react-router-dom';
import { gameService, reviewService, Game, Review } from './services';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class GameCard extends Component {
  game: Game = {
    game_id: 0,
    game_title: '',
    genre: [],
    genre_id: 0,
    platform: [],
    game_description: '',
  };
  description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco...';
  render() {
    return (
      <Card title={this.game.game_title}>
        <h6 className="card-subtitle mb-2 text-muted">
          Terningkast:
          <ThumbNail small img="https://cdn-icons-png.flaticon.com/512/220/220725.png"></ThumbNail>
        </h6>
        <Row>
          <Column width={2}>
            <ThumbNail img="https://cdn-icons-png.flaticon.com/512/686/686589.png"></ThumbNail>
          </Column>
          <Column width={6}>
            {this.game.game_description}
            <Linebreak></Linebreak>
          </Column>
          <Column width={2}></Column>
        </Row>
        <Linebreak></Linebreak>
        <Row>
          <Column>Sjanger: {this.game.genre}</Column>
        </Row>
        <Linebreak></Linebreak>
        <Row>
          <Column>Platform: {this.game.platform}</Column>
        </Row>
      </Card>
    );
  }
  /** return axios
   */
  mounted() {
    gameService.getAll().then((result) => {
      this.game = result[0];
      console.log(this.game);
    });
  }
}
