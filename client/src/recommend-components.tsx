import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Alert,
  Row,
  Column,
  Button,
  Container,
  ColumnCentre,
  Linebreak,
  ReviewCard,
} from './widgets';

import { createHashHistory } from 'history';

import { Review, reviewService } from './services/review-service';

export const history = createHashHistory();

export class TopTenStars extends Component {
  reviews: Review[] = [];
  render() {
    return (
      <>
        <Container>
          <h3 className="text-center">Her kan du se de best likte anmeldelsene</h3>
          <Linebreak></Linebreak>
          <Row>
            <ColumnCentre>
              <ReviewList reviews={this.reviews}></ReviewList>
            </ColumnCentre>
          </Row>
        </Container>
      </>
    );
  }
  mounted() {
    reviewService
      .getTopTen()
      .then((reviews) => {
        this.reviews = reviews;
      })
      .catch((error) => Alert.danger('Error getting top ten reviews: ' + error.message));
  }
}

export class LastTen extends Component {
  reviews: Review[] = [];
  render() {
    return (
      <>
        <Container>
          <h3 className="text-center">Her kan du se de siste publiserte anmeldelsene</h3>
          <Linebreak></Linebreak>
          <Row>
            <ColumnCentre>
              <ReviewList reviews={this.reviews}></ReviewList>
            </ColumnCentre>
          </Row>
        </Container>
      </>
    );
  }
  mounted() {
    reviewService
      .getLastTen()
      .then((reviews) => {
        this.reviews = reviews;
      })
      .catch((error) => Alert.danger('Error getting top ten reviews: ' + error.message));
  }
}

export class ReviewList extends Component<{ reviews: Review[] }> {
  render() {
    return (
      <div className="sticky-top">
        {this.props.reviews.length == 0 ? (
          <Row>
            <Column>Ingen resultater</Column>
          </Row>
        ) : (
          this.props.reviews.map((review, index) => (
            <Row key={index}>
              <ReviewCard
                title={review.review_title}
                subtitle={review.game_title}
                terningkast={review.rating}
                relevanse={review.likes}
                text={review.text}
              >
                <Button.Success
                  small
                  onClick={() => {
                    history.push('/publishedReviews/' + review.review_id);
                  }}
                >
                  Les mer
                </Button.Success>
              </ReviewCard>
            </Row>
          ))
        )}
      </div>
    );
  }
}
