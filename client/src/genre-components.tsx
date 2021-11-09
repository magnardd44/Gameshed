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
              title="Adventure"
              img="https://cdn-icons.flaticon.com/png/512/2790/premium/2790402.png?token=exp=1636397351~hmac=497e2bcb1e7643ed7368aa6b09213aa8"
            ></CategoryCard>
          </ColumnCentre>
          <ColumnCentre smwidth={4} mdwidth={3}>
            <CategoryCard
              title="Adventure"
              img="https://cdn-icons.flaticon.com/png/512/2790/premium/2790402.png?token=exp=1636397351~hmac=497e2bcb1e7643ed7368aa6b09213aa8"
            ></CategoryCard>
          </ColumnCentre>
          <ColumnCentre smwidth={4} mdwidth={3}>
            <CategoryCard
              title="Adventure"
              img="https://cdn-icons.flaticon.com/png/512/2790/premium/2790402.png?token=exp=1636397351~hmac=497e2bcb1e7643ed7368aa6b09213aa8"
            ></CategoryCard>
          </ColumnCentre>
          <ColumnCentre smwidth={4} mdwidth={3}>
            <CategoryCard
              title="Adventure"
              img="https://cdn-icons.flaticon.com/png/512/2790/premium/2790402.png?token=exp=1636397351~hmac=497e2bcb1e7643ed7368aa6b09213aa8"
            ></CategoryCard>
          </ColumnCentre>
          <ColumnCentre smwidth={4} mdwidth={3}>
            <CategoryCard
              title="Adventure"
              img="https://cdn-icons.flaticon.com/png/512/2790/premium/2790402.png?token=exp=1636397351~hmac=497e2bcb1e7643ed7368aa6b09213aa8"
            ></CategoryCard>
          </ColumnCentre>
          <ColumnCentre smwidth={4} mdwidth={3}>
            <CategoryCard
              title="Adventure"
              img="https://cdn-icons.flaticon.com/png/512/2790/premium/2790402.png?token=exp=1636397351~hmac=497e2bcb1e7643ed7368aa6b09213aa8"
            ></CategoryCard>
          </ColumnCentre>
        </Row>
      </Container>
    );
  }
}
