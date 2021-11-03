import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import { Review, reviewService } from './services/review-service';

import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class PublishedReviews extends Component {
  reviews: Review[] = [];

  render() {
    return (
      <>
        <Card title="Publiserte anmeldelser">
          {this.reviews.map((review) => (
            <Row key={review.review_id}>
              <Column>
                <NavLink to={'/publishedReviews/' + review.review_id}>
                  {review.review_title}
                </NavLink>
              </Column>
            </Row>
          ))}
        </Card>
      </>
    );
  }

  mounted() {
    reviewService
      .getPublisedReviews()
      .then((reviews) => (this.reviews = reviews))
      .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
  }
}

/**
 * Renders form to create new task.
 */
export class AddReview extends Component {
  reviewTitle = '';
  gameTitle = '';
  genre = '';
  platform = '';
  text = '';
  rating = 1;
  showAlert = false;

  render() {
    return (
      <>
        <Card title="Skriv anmeldelse">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>

          <Row>
            <Column width={2}>
              <Form.Label>Overskrift:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.reviewTitle}
                onChange={(event) => (this.reviewTitle = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Anmeldelse:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                value={this.text ?? ''}
                onChange={(event) => {
                  this.text = event.currentTarget.value;
                }}
                rows={20}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Terningkast:</Form.Label>
            </Column>
            <Column>
              <Form.Select
                value={this.rating}
                onChange={(event) => {
                  this.rating = Number(event.currentTarget.value);
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </Form.Select>
            </Column>
          </Row>
        </Card>

        <Button.Success
          onClick={() => {
            reviewService
              .create(this.reviewTitle, this.text, this.rating)

              .then((id) => {
                alert('Anmeldelsen er lagret');
                history.push('/publishReview/' + id);
              })
              .catch((error) => Alert.danger('Error creating task: ' + error.message));
          }}
        >
          Lagre
        </Button.Success>
      </>
    );
  }
}

export class PublishReview extends Component<{ match: { params: { id: number } } }> {
  review: Review = {
    review_id: 0,
    review_title: '',
    text: '',
    rating: 0,
    published: false,
    game_id: '',
    user_id: 0,
  };

  render() {
    return (
      <>
        <Card title="Anmeldelse til publisering">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>Hentes fra IGDB</Column>
          </Row>

          <Row>
            <Column width={12}>
              <div>
                <b>{this.review.review_title}</b>
              </div>
            </Column>
          </Row>
          <Row>
            <Column width={12}>
              <div>{this.review.text}</div>
            </Column>
          </Row>
          <Row>
            <Column width={12}>
              <div>Terningkast: {this.review.rating}</div>
            </Column>
          </Row>
          <Row>
            <Column>
              <Button.Success
                onClick={() => history.push('/editReview/' + this.props.match.params.id)}
              >
                Rediger
              </Button.Success>
            </Column>
            <Column>
              <Button.Success
                onClick={() => {
                  reviewService.publish(Number(this.props.match.params.id)).then(() => {
                    history.push('/publishedReviews');
                  });
                }}
              >
                Publiser
              </Button.Success>
            </Column>

            <Column>
              <Button.Danger
                onClick={() => {
                  reviewService
                    .delete(
                      this.review.review_id,
                      this.review.review_title,
                      this.review.text,
                      this.review.rating
                    )
                    .then(() => {
                      history.push('/reviews');
                    })
                    .catch((error) => Alert.danger('Error deleting task: ' + error.message));
                }}
              >
                Slett
              </Button.Danger>
            </Column>
          </Row>
        </Card>
      </>
    );
  }

  mounted() {
    reviewService
      .get(this.props.match.params.id)
      .then((review) => (this.review = review))
      .catch((error) => Alert.danger('Error getting review: ' + error.message));
  }
}

// /**
//  * Renders form to edit an existing review
//  */
export class EditReview extends Component<{ match: { params: { id: number } } }> {
  review: Review = {
    review_id: 0,
    review_title: '',
    text: '',
    rating: 0,
    game_id: '',
    user_id: 0,
    published: false,
  };

  render() {
    return (
      <>
        <Card title="Edit review">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.review.review_title}
                onChange={(event) => (this.review.review_title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Text:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                value={this.review.text ?? ''}
                onChange={(event) => {
                  this.review.text = event.currentTarget.value;
                }}
                rows={10}
              />
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success
              onClick={() => {
                alert('review saved');

                reviewService
                  .edit(
                    this.review.review_id,
                    this.review.review_title,
                    this.review.text,
                    this.review.rating
                  )
                  .then(() => history.push('/publishReview/' + this.review.review_id))
                  .catch((error) => Alert.danger('Error editing review: ' + error.message));
              }}
            >
              Save
            </Button.Success>
          </Column>
        </Row>
      </>
    );
  }

  mounted() {
    reviewService
      .get(this.props.match.params.id)
      .then((review) => (this.review = review))
      .catch((error) => Alert.danger('Error getting review: ' + error.message));
  }
}
