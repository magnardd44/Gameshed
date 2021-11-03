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
  render() {
    return (
      <Container>
        <Card title={this.game.game_title}>
          <h6 className="card-subtitle mb-2 text-muted">
            Terningkast:
            <ThumbNail
              small
              img="https://cdn-icons-png.flaticon.com/512/220/220725.png"
            ></ThumbNail>
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
        <Linebreak></Linebreak>
        <Row>
          <Column>
            <Button.Success onClick={() => this.addReview()}>Anmeld dette spillet</Button.Success>
          </Column>
          <Column right={true}>
            <Button.Danger onClick={() => history.push('/')}>Tilbake til søk</Button.Danger>
          </Column>
        </Row>
      </Container>
    );
  }

  mounted() {
    gameService.get(this.game.game_id).then((result) => {
      this.game = result;
      console.log(this.game);
    });
  }
  addReview() {
    history.push('/addReview');
  }
}
