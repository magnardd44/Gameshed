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
  FormContainer,
  FormGroup,
} from './widgets';
import { createHashHistory } from 'history';
import { Game, gameService } from './services/game-service';

export const history = createHashHistory();

export class SearchHotBar extends Component<{
  onClick: () => void;
  [prop: string]: any;
}> {
  render() {
    const { onClick, ...rest } = this.props;
    return (
      <div
        {...rest}
        role="option"
        className=" option"
        style={{
          borderRadius: '5px',
          border: '1px solid black',
          cursor: 'pointer',
          marginTop: '10px',
          backgroundColor: 'lightgray',
        }}
        onClick={onClick}
      >
        {this.props.children}
      </div>
    );
  }
}

export class Search extends Component {
  //Inverval function to avoid overloading IGDB server with search requests.
  igdbSearcher: ReturnType<typeof setInterval> | null = null;

  input: string = '';
  lastInput: string = '';

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
                    gameService.search_db(this.input);
                  }
                }}
                onKeyUp={(event: { key: string }) => {
                  if (event.key == 'Enter') {
                    this.search();
                  }
                }}
              />
              {gameService.db.concat(gameService.igdb).map((game, index) => {
                if (this.input != '') {
                  return (
                    <SearchHotBar
                      key={index}
                      onClick={() => this.setGame(game.game_id, game.igdb_id)}
                    >
                      {game.game_title}
                    </SearchHotBar>
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
    gameService.clear();

    //Start searching IGDB on search field
    this.igdbSearcher = setInterval(() => {
      if (this.input != this.lastInput) {
        if (this.input) {
          gameService.search_igdb(this.input);
        } else {
          gameService.igdb = [];
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
    gameService.set(db_id, igdb_id);
    history.push('/games/' + db_id + '/' + igdb_id);
  }

  search() {
    if (this.input.length > 0) {
      gameService.search_db_and_extra(this.input);
      gameService.search_igdb(this.input);
      history.push('/results');
    } else {
      Alert.info('Skriv inn et spill å søke etter.');
    }
  }
}

export class SearchListings extends Component {
  genre: string = 'alle';
  platform: string = 'alle';
  year: number = 0;

  render() {
    return (
      <>
        <Container>
          Filtrer dine søkeresultater:
          <FormContainer>
            <FormGroup>
              <Form.Label>Sjanger: </Form.Label>
              <Form.Select
                value={this.genre}
                onChange={(event) => (this.genre = event.currentTarget.value)}
              >
                {
                  //Get all unique genres from games i gameService
                  [<option key={-1}>alle</option>].concat(
                    [
                      ...new Set(
                        gameService.db
                          .concat(gameService.igdb)
                          .reduce((set, game) => set.concat(game.genre || []), new Array())
                      ),
                    ].map((genre, index) => <option key={index}>{genre}</option>)
                  )
                }
              </Form.Select>
              <Form.Label>Platform: </Form.Label>
              <Form.Select
                value={this.platform}
                onChange={(event) => (this.platform = event.currentTarget.value)}
              >
                {
                  //Get all unique platforms from games i gameService
                  [<option key={-1}>alle</option>].concat(
                    [
                      ...new Set(
                        gameService.db
                          .concat(gameService.igdb)
                          .reduce((set, game) => set.concat(game.platform || []), new Array())
                      ),
                    ].map((platform, index) => <option key={index}>{platform}</option>)
                  )
                }
              </Form.Select>
              <Form.Label>År: </Form.Label>
              <Form.Select
                value={this.year}
                onChange={(event) => {
                  this.year =
                    event.currentTarget.value == 'alle' ? 0 : Number(event.currentTarget.value);
                }}
              >
                {
                  //Get all unique years from games i gameService
                  [<option key={-1}>alle</option>].concat(
                    [
                      ...new Set(
                        gameService.db
                          .concat(gameService.igdb)
                          .reduce(
                            (set, game) =>
                              set.concat(
                                game.igdb?.release_date
                                  ? new Date(game.igdb?.release_date * 1000).getFullYear()
                                  : []
                              ),
                            new Array()
                          )
                      ),
                    ]
                      .sort((a, b) => a - b)
                      .map((year) => <option key={year}>{year.toString()}</option>)
                  )
                }
              </Form.Select>
            </FormGroup>
          </FormContainer>
        </Container>
        <Container>
          {
            //Filter the games on genre, platform and year
            gameService.db.concat(gameService.igdb).map((game, index) => {
              if (
                (this.genre == 'alle' || game.genre?.find((g) => g == this.genre)) &&
                (this.platform == 'alle' || game.platform?.find((p) => p == this.platform)) &&
                (this.year == 0 ||
                  new Date((game.igdb?.release_date || 0) * 1000).getFullYear() == this.year)
              )
                return <SearchResult game={game} key={index}></SearchResult>;
            })
          }
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
}

export class SearchResult extends Component<{ game: Game }> {
  render() {
    return (
      <Card title={this.props.game.game_title}>
        <h6 className="card-subtitle mb-2 text-muted">
          Terningkast:{' '}
          {this.props.game.igdb?.aggregated_rating != undefined ? (
            <ThumbNail
              small
              img={
                'https://helenaagustsson.github.io/INFT2002-images/images/dice-' +
                this.rating() +
                '.png'
              }
            ></ThumbNail>
          ) : (
            ' Ikke tilgjengelig'
          )}
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
        <Row>Sjanger: {this.props.game.genre?.join(', ')}</Row>
        <Row>Platformer: {this.props.game.platform?.join(', ')}</Row>
        <Row>
          Utgivelsesår:{' '}
          {this.props.game.igdb
            ? new Date(this.props.game.igdb?.release_date * 1000).getFullYear()
            : ''}{' '}
        </Row>
        <Linebreak></Linebreak>
      </Card>
    );
  }

  rating() {
    let terningkast = this.props.game.igdb
      ? Math.ceil((this.props.game.igdb?.aggregated_rating * 6) / 100)
      : '';
    return terningkast;
  }
}
