import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Alert,
  Card,
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

//Renders overview of published reviews based on genre
export class Platform extends Component {
  state = { isHidden: true };

  review: Review = {
    review_id: 0,
    game_id: 0,
    game_title: '',
    review_title: '',
    text: '',
    user_id: 0,
    rating: 0,
    published: false,
    genre_id: 0,
    relevant: 0,
    platform_id: 0,
    likes: 0,
    user_nickname: '',
  };

  render() {
    return (
      <>
        <Container>
          <h3 className="text-center">Her kan du søke anmeldelser etter platform</h3>
          <div className="text-center">
            <Button.Success
              small
              onClick={() => {
                history.push('/reviews-by-genre');
              }}
            >
              Klikk her
            </Button.Success>{' '}
            for å søke etter sjanger
          </div>
          <Linebreak></Linebreak>
          <h5>Velg platform:</h5>
          <Row>
            <ColumnCentre width={6} smwidth={4} mdwidth={2}>
              <Card title="Play Station 4">
                <Button.Success onClick={() => this.platformCall(145)}>Vis</Button.Success>
              </Card>
              <Card title="Play Station 5">
                <Button.Success onClick={() => this.platformCall(146)}>Vis</Button.Success>
              </Card>
              <Card title="Nintendo Switch">
                <Button.Success onClick={() => this.platformCall(119)}>Vis</Button.Success>
              </Card>
              <Card title="XBox One">
                <Button.Success onClick={() => this.platformCall(186)}>Vis</Button.Success>
              </Card>
              <Card title="XBox 360">
                <Button.Success onClick={() => this.platformCall(185)}>Vis</Button.Success>
              </Card>
              <Card title="PC - Microsoft">
                <Button.Success onClick={() => this.platformCall(126)}>Vis</Button.Success>
              </Card>
              <Card title="Gameboy">
                <Button.Success onClick={() => this.platformCall(89)}>Vis</Button.Success>
              </Card>
              <Card title="Mac">
                <Button.Success onClick={() => this.platformCall(100)}>Vis</Button.Success>
              </Card>
              <Card title="IOS">
                <Button.Success onClick={() => this.platformCall(98)}>Vis</Button.Success>
              </Card>
              <Card title="Nintendo DS">
                <Button.Success onClick={() => this.platformCall(114)}>Vis</Button.Success>
              </Card>
              <Card title="Andre">
                <Button.Success onClick={() => this.platformCall(101 + 102)}>Vis</Button.Success>
              </Card>
            </ColumnCentre>
            <ColumnCentre>
              {' '}
              {this.state.isHidden ? (
                ' '
              ) : (
                <div className="sticky-top">
                  <Row>
                    <Column>Resultater:</Column>
                  </Row>
                  {reviewService.reviews.length == 0 ? (
                    <Row>
                      <Column>Ingen resultater</Column>
                    </Row>
                  ) : (
                    reviewService.reviews.map((review, index) => (
                      <Row key={index}>
                        <ReviewCard
                          title={review.review_title}
                          subtitle={review.game_title}
                          terningkast={review.rating}
                          relevanse={review.likes}
                          text={review.text}
                          user_nickname={review.user_nickname}
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
              )}
            </ColumnCentre>
          </Row>
        </Container>
      </>
    );
  }

  platformCall(id: number) {
    reviewService.reviews = [];
    reviewService
      .getPlatform(id)
      .then((res) => {
        reviewService.reviews = res;
        reviewService.reviews.map((review, i) => {
          reviewService
            .get(review.review_id)
            .then((res) => {
              //console.log(res);
              reviewService.reviews[i] = res;
            })
            .catch((err) => console.log(err));
        });
      })

      .catch((error) => Alert.danger('Error retrieving reviews: ' + error.message));
    this.setState({ isHidden: false });
  }
}

/**
 * 
export class Platform extends Component {
  platforms: Platform[] = [];
  genres: Genre[] = [];
  reviews: Review[] = [];

  review: Review = {
    review_id: 0,
    game_id: 0,
    game_title: '',
    review_title: '',
    text: '',
    user_id: 0,
    rating: 0,
    published: false,
    genre_id: 0,
    relevant: 0,
    platform_id: 0,
    likes: 0,
  };
  state = { isHidden: false };
  platformCall(id: number) {
    reviewService
      .getPlatform(id)
      .then((data) => {
        //this.setState({ isHidden: false });
        console.log(data);
        this.reviews = data;
      })
      .catch((error) => Alert.danger('Error retrieving reviews: ' + error.message));
  }
  render() {
    return (
      <>
        <Container>
          <h3 className="text-center">Her kan du søke anmeldelser etter platform</h3>
          <div className="text-center">
            <Button.Success
              small
              onClick={() => {
                history.push('/reviews-by-genre');
              }}
            >
              Klikk her
            </Button.Success>{' '}
            for å søke etter sjanger
          </div>
          <Linebreak></Linebreak>
          <h5>Velg platform:</h5>

          <Row>
            <Column width={1}>
              <Card title="Play Station 4">
                <Button.Success onClick={() => this.platformCall(145)}>Open</Button.Success>
              </Card>
            </Column>
            <ColumnCentre width={6} smwidth={4} mdwidth={2}>
              {this.genres.map((genre) => (
                <CategoryCard
                  key={genre.genre_id}
                  img={
                    genre.genre_img
                      ? 'https://helenaagustsson.github.io/INFT2002-images/images/' +
                        genre.genre_img +
                        '.png'
                      : 'https://helenaagustsson.github.io/INFT2002-images/images/' +
                        genre.genre_name +
                        '.png'
                  }
                >
                  <Button.Success
                    onClick={() => {
                      this.platformCall(genre.genre_id);
                    }}
                  >
                    {genre.genre_name}
                  </Button.Success>
                </CategoryCard>
              ))}
            </ColumnCentre>

            <ColumnCentre>
              {this.state.isHidden ? null : (
                <div className="sticky-top">
                  <div>Resultater:</div>
                  {this.reviews.map((review, index) => (
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
                  ))}
                </div>
              )}
            </ColumnCentre>
          </Row>
        </Container>
      </>
    );
  }
  mounted() {
    reviewService
      .getPublishedReviews()
      .then((reviews) => (this.reviews = reviews))
      .catch((error) => Alert.danger('Error getting reviews: ' + error.message));
    //platformService.getAll().then((platforms)=>{this.platforms = platforms})
  }
}

 * 
 */
