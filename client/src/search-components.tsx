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
  FormContainer,
  FormGroup,
} from './widgets';
import { NavLink } from 'react-router-dom';
import { gameService, Game } from './services/game-services';
import { Genre } from './services/genre-service';
import { createHashHistory } from 'history';
import axios from 'axios';
import { genreService } from './services/genre-service';
import { history } from './index';
import { Game2, gameService3 } from './services/game-services';

type gameType = {
  id: number;
  name: string;
};

class SharedGame {
  game: gameType = {
    id: 0,
    name: '',
  };
  games: gameType[] = [];
}

//let shared = sharedComponentData(new SharedGame());

export class Search extends Component {
  igdbSearcher: ReturnType<typeof setInterval> | null = null;

  input: string = '';
  lastInput: string = '';

  //games: Game[] = [];
  filtered: Game2[] = [];

  game: Game = {
    game_id: 0,
    igdb_id: 0,
    game_title: '',
    genre: 0,
    genres: [],
    genre_id: 0,
    platform: 0,
    platforms: [],
    game_description: '',
  };

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
                  if (this.input.length > 0) {
                    gameService3.search_db(this.input);
                  }
                }}
                onKeyUp={(event: { key: string }) => {
                  if (event.key == 'Enter') {
                    this.search();
                  }
                }}
              />
              {gameService3.db.concat(gameService3.igdb).map((game, index) => {
                if (this.input != '') {
                  return (
                    <div
                      //id={game.game_id.toString()}
                      key={index}
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
                        //                        this.input = event.currentTarget.innerHTML;
                        //                        this.game = game;
                        this.setGame(game.game_id, game.igdb_id);
                      }}
                    >
                      {game.game_title}
                    </div>
                  );
                }
              })}
            </ColumnCentre>
            <ColumnCentre width={4}>
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
    gameService3.clear();

    this.igdbSearcher = setInterval(() => {
      if (this.input != this.lastInput) {
        if (this.input) {
          gameService3.search_igdb(this.input);
        } else {
          gameService3.igdb = [];
        }

        this.lastInput = this.input;
      }
    }, 300);
  }

  beforeUnmount() {
    if (this.igdbSearcher) {
      clearInterval(this.igdbSearcher);
      this.igdbSearcher = null;
    }
  }

  setGame(db_id: number, igdb_id: number) {
    gameService3.set(db_id, igdb_id);
    history.push('/games/' + db_id + '/' + igdb_id);
  }

  search() {
    if (this.input.length > 0) {
      gameService3.search_db_and_extra(this.input); // = this.filtered;
      gameService3.search_igdb(this.input);
      history.push('/results');
    } else {
      Alert.info('Skriv inn et spill å søke etter.');
    }
  }
}

export class SearchListings extends Component {
  genres: Genre[] = [];
  render() {
    return (
      <>
        <Container>
          Filtrer dine søkeresultater:
          <FormContainer>
            <FormGroup>
              <Form.Label>Sjanger: </Form.Label>
              <Form.Select value={'Adventure'} onChange={() => console.log('sjanger')}>
                {this.genres.map((genre) => (
                  <option key={genre.genre_id}>{genre.genre_name}</option>
                ))}
              </Form.Select>

              <Form.Label>Platform: </Form.Label>
              <Form.Select value={'Adventure'} onChange={() => console.log('sjanger')}>
                <option value="1">Playstation</option>
              </Form.Select>

              <Form.Label>År: </Form.Label>
              <Form.Select value={'Adventure'} onChange={() => console.log('sjanger')}>
                <option value="1">2020</option>
              </Form.Select>
            </FormGroup>
          </FormContainer>
        </Container>
        <Container>
          {gameService3.db.map((game, index) => (
            <SearchResult game={game} key={index}></SearchResult>
          ))}
          {gameService3.igdb.map((game, index) => (
            <SearchResult game={game} key={index}></SearchResult>
          ))}
        </Container>

        <Container>
          Fant du ikke det du lette etter?
          <Linebreak></Linebreak>
          <Button.Success onClick={() => history.push('/addGame')}>
            Legg til nytt spill
          </Button.Success>
        </Container>
      </>
    );
  }
  mounted() {
    genreService.getAll().then((results) => {
      this.genres = results;
    });
  }
}

export class SearchResult extends Component<{ game: Game2 }> {
  render() {
    return (
      <Card title={this.props.game.game_title}>
        <h6 className="card-subtitle mb-2 text-muted">
          Terningkast:
          <ThumbNail small img="https://cdn-icons-png.flaticon.com/512/220/220725.png"></ThumbNail>
        </h6>
        <Row>
          <Column width={2}>
            <ThumbNail
              img={this.props.game.igdb?.cover_url ? this.props.game.igdb.cover_url : ''}
            ></ThumbNail>
          </Column>
          <Column width={8}>
            {this.props.game.game_description
              ? this.props.game.game_description
              : 'Ingen beskrivelse'}
            <Linebreak></Linebreak>
          </Column>
          <Column width={2}>
            {' '}
            <Button.Success
              onClick={() =>
                history.push('/games/' + this.props.game.game_id + '/' + this.props.game.igdb_id)
              }
            >
              Les mer
            </Button.Success>
          </Column>
        </Row>
        <Row>
          Sjanger: {this.props.game.genre?.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
        </Row>
        <Row>
          Platform: {this.props.game.platform?.reduce((p, c) => (p == '' ? c : p + ', ' + c), '')}
        </Row>
        <Row>
          År:{' '}
          {this.props.game.igdb
            ? new Date(this.props.game.igdb?.release_date * 1000).getFullYear()
            : ''}{' '}
        </Row>
        <Linebreak></Linebreak>
      </Card>
    );
  }
}
