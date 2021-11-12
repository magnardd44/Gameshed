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
import { gameService, Game } from './services/game-services';
import { Genre } from './services/genre-service';
import { createHashHistory } from 'history';
import axios from 'axios';
import { genreService } from './services/genre-service';

const history = createHashHistory();

export class Category extends Component {
  render() {
    return (
      <Container>
        Velg kategori/sjanger:
        <Row>
          <ColumnCentre smwidth={4} mdwidth={3}>
            <CategoryCard
              title="Eventyr"
              img="https://helenaagustsson.github.io/INFT2002-images/images/adventure-game.png"
            >
              {' '}
              <Button.Success onClick={() => console.log(' ')}>Eventyr</Button.Success>
            </CategoryCard>
          </ColumnCentre>
          <ColumnCentre smwidth={4} mdwidth={3}>
            <CategoryCard
              title="Plattform"
              img="https://helenaagustsson.github.io/INFT2002-images/images/002-platform.png"
            >
              <Button.Success onClick={() => console.log(' ')}>Eventyr</Button.Success>
            </CategoryCard>
          </ColumnCentre>
          <ColumnCentre smwidth={4} mdwidth={3}>
            <CategoryCard
              title="Indie"
              img="https://helenaagustsson.github.io/INFT2002-images/images/003-radio.png"
            ></CategoryCard>
          </ColumnCentre>
          <ColumnCentre smwidth={4} mdwidth={3}>
            <CategoryCard
              title="Strategy"
              img="https://helenaagustsson.github.io/INFT2002-images/images/012-strategy.png"
            ></CategoryCard>
          </ColumnCentre>
        </Row>
      </Container>
    );
  }
}
