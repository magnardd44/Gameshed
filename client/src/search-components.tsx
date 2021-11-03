import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
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
import axios from 'axios';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

let shared = sharedComponentData({
  games: [],
});

export class Search extends Component {
  input: string = '';

  games: Game[] = [];
  filtered: Game[] = [];

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
                onChange={(event) => {
                  this.input = event.currentTarget.value;
                  this.filtered = this.games.filter((game) =>
                    game.game_title.toLowerCase().includes(this.input.toLowerCase())
                  );
                }}
                onKeyUp={(event: { key: string }) => {
                  if (event.key == 'Enter') {
                    this.search();
                  }
                }}
              />

              {this.filtered.map((game) => {
                if (this.input != '') {
                  return (
                    <div
                      id={game.game_title}
                      key={game.game_id}
                      role="option"
                      className=" option"
                      style={{
                        borderRadius: '5px',
                        border: '1px solid black',
                        cursor: 'pointer',
                        marginTop: '10px',
                        backgroundColor: 'lightgray',
                      }}
                      onClick={(event) => {
                        this.input = event.currentTarget.id;
                      }}
                    >
                      {game.game_title}
                    </div>
                  );
                }
              })}
            </ColumnCentre>
            <ColumnCentre width={4}>
              <Button.Danger
                onClick={() => {
                  this.mounted();
                }}
              >
                Tøm
              </Button.Danger>
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

  mounted() {
    /** */
    gameService.getAll().then((result) => {
      this.input = '';
      this.games = result;
      console.log(this.games);
    });
  }

  search() {
    console.log('search');
    shared.games = []; //Opprensking så ikkje gamle resultat forstyrrer.
    axios
      .post('search', { game: this.input })
      .then((response) => {
        shared.games = response.data;
        console.log(response.data);
      })
      .catch((err) => console.log(err));
    history.push('/results');
  }
}

export class SearchListings extends Component {
  render() {
    return (
      <Container>
        Søkeresultater:
        <SearchResult></SearchResult>
        {shared.games.map((game, index) => (
          <IGDBResult game={game} key={index}></IGDBResult>
        ))}
      </Container>
    );
  }
}

export class SearchResult extends Component {
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
      <Card title={this.game.game_title}>
        <h6 className="card-subtitle mb-2 text-muted">
          Terningkast:
          <ThumbNail small img="https://cdn-icons-png.flaticon.com/512/220/220725.png"></ThumbNail>
        </h6>
        <Row>
          <Column width={2}>
            <ThumbNail img="https://cdn-icons-png.flaticon.com/512/686/686589.png"></ThumbNail>
          </Column>
          <Column width={8}>
            {this.game.game_description}
            <Linebreak></Linebreak>
          </Column>
          <Column width={2}>
            {' '}
            <Button.Success onClick={() => history.push('/games/' + this.game.game_id)}>
              Les mer
            </Button.Success>
          </Column>
        </Row>
        <Linebreak></Linebreak>
      </Card>
    );
  }
  mounted() {
    gameService.get(this.game.game_id).then((result) => {
      this.game = result;
      console.log(this.game);
    });
  }
}

export class IGDBResult extends Component<{ game: any }> {
  render() {
    return (
      <Card title={this.props.game.name}>
        <h6 className="card-subtitle mb-2 text-muted">
          Terningkast:
          <ThumbNail small img="https://cdn-icons-png.flaticon.com/512/220/220725.png"></ThumbNail>
        </h6>
        <Row>
          <Column width={2}>
            <ThumbNail
              img={this.props.game.cover ? 'https:' + this.props.game.cover.url : ''}
            ></ThumbNail>
          </Column>
          <Column width={8}>
            {this.props.game.summary ? this.props.game.summary : 'Ingen beskrivelse'}
            <Linebreak></Linebreak>
          </Column>
          <Column width={2}>
            {' '}
            <Button.Success onClick={() => history.push('/games/' + this.props.game.name)}>
              Les mer
            </Button.Success>
          </Column>
        </Row>
        <Linebreak></Linebreak>
      </Card>
    );
  }
}
