import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Row, Button, Container, ColumnCentre, Linebreak } from './widgets';
import { createHashHistory } from 'history';
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
