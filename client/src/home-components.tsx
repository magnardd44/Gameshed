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
  CategoryCard,
} from './widgets';
import { NavLink } from 'react-router-dom';
import { Genre } from './services/genre-service';
import { createHashHistory } from 'history';
import axios from 'axios';
import { genreService } from './services/genre-service';
import userService from './services/user-service';

export const history = createHashHistory();

export class Home extends Component {
  render() {
    return (
      <Container textalign={'center'}>
        <Row>
          <ColumnCentre width={6}>
            <Card title={'Søk etter spill'}>
              <Button.Success
                onClick={() => {
                  history.push('/search');
                }}
              >
                Søk
              </Button.Success>
            </Card>
          </ColumnCentre>
          <ColumnCentre width={6}>
            <Card title={'Søk etter anmeldelser'}>
              <Button.Success
                onClick={() => {
                  history.push('/reviews');
                }}
              >
                Søk
              </Button.Success>
            </Card>
          </ColumnCentre>
        </Row>
        <Linebreak></Linebreak>
        <Row>
          <ColumnCentre width={userService.token ? 12 : 6}>
            <Card title={'Legg til nytt spill'}>
              <Button.Success
                onClick={() => {
                  history.push('/addGame');
                }}
              >
                Legg til spill
              </Button.Success>
            </Card>
          </ColumnCentre>
          {userService.token ? (
            ''
          ) : (
            <ColumnCentre width={6}>
              <Card title="Registrer ny konto">
                <Button.Success
                  onClick={() => {
                    history.push('/user');
                  }}
                >
                  Registrer deg
                </Button.Success>
              </Card>
            </ColumnCentre>
          )}
        </Row>
      </Container>
    );
  }
}

export class ReviewHome extends Component {
  render() {
    return (
      <Container textalign={'center'}>
        <Row>
          <ColumnCentre width={6}>
            <Card title={'Sorter etter sjanger'}>
              <Button.Success
                onClick={() => {
                  history.push('/reviews-by-genre');
                }}
              >
                Søk
              </Button.Success>
            </Card>
          </ColumnCentre>
          <ColumnCentre width={6}>
            <Card title={'Sorter etter plattform'}>
              <Button.Success
                onClick={() => {
                  history.push('/reviews-by-platform');
                }}
              >
                Søk
              </Button.Success>
            </Card>
          </ColumnCentre>
        </Row>
        <Linebreak></Linebreak>
        <Row>
          <ColumnCentre width={6}>
            <Card title={'Topp ti anmeldelser'}>
              <Button.Success
                onClick={() => {
                  history.push('/reviews-by-stars');
                }}
              >
                Søk
              </Button.Success>
            </Card>
          </ColumnCentre>
          <ColumnCentre width={6}>
            <Card title={'Siste ti anmeldelser?'}>
              <Button.Success
                onClick={() => {
                  history.push('/reviews-by-date');
                }}
              >
                Søk
              </Button.Success>
            </Card>
          </ColumnCentre>
        </Row>
        <Linebreak></Linebreak>
        <Row>
          <ColumnCentre width={12}>
            <Card title={'Alle anmeldelser'}>
              <Button.Success
                onClick={() => {
                  history.push('/publishedReviews');
                }}
              >
                Alle anmeldelser
              </Button.Success>
            </Card>
          </ColumnCentre>
        </Row>
      </Container>
    );
  }
}
