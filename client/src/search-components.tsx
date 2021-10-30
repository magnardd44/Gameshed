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
import taskService, { Task } from './task-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class Search extends Component {
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

export class SearchListings extends Component {
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

export class SearchResult extends Component {
  description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco...';
  render() {
    return (
      <Card title="Game Title">
        <h6 className="card-subtitle mb-2 text-muted">
          Terningkast:{' '}
          <ThumbNail small img="https://cdn-icons-png.flaticon.com/512/220/220725.png"></ThumbNail>
        </h6>
        <Row>
          <Column width={2}>
            <ThumbNail img="https://cdn-icons-png.flaticon.com/512/686/686589.png"></ThumbNail>
          </Column>
          <Column width={8}>
            Description: {this.description}
            <Linebreak></Linebreak>
          </Column>
          <Column width={2}>
            <Button.Success onClick={() => history.push('/games/1')}>Les mer</Button.Success>
          </Column>
        </Row>
      </Card>
    );
  }
}
