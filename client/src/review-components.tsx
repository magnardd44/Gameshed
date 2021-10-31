import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import reviewService, { Review } from './review-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

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
  review: any = { id: 0, title: '', text: '', rating: 0 };

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
                <b>{this.review.title}</b>
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
              <Button.Success onClick={() => alert('ikke klar')}>Rediger</Button.Success>
            </Column>
            <Column>
              <Button.Success onClick={() => alert('ikke ferdig')}>Publiser</Button.Success>
            </Column>

            <Column>
              <Button.Danger onClick={() => alert('ikke ferdig')}>Slett</Button.Danger>
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
//  * Renders form to edit a specific task.
//  */
// export class TaskEdit extends Component<{ match: { params: { id: number } } }> {
//   task: Task = { id: 0, title: '', done: false, description: '' };

//   render() {
//     return (
//       <>
//         <Card title="Edit task">
//           <Row>
//             <Column width={2}>
//               <Form.Label>Title:</Form.Label>
//             </Column>
//             <Column>
//               <Form.Input
//                 type="text"
//                 value={this.task.title}
//                 onChange={(event) => (this.task.title = event.currentTarget.value)}
//               />
//             </Column>
//           </Row>
//           <Row>
//             <Column width={2}>
//               <Form.Label>Description:</Form.Label>
//             </Column>
//             <Column>
//               <Form.Textarea
//                 value={this.task.description ?? ''}
//                 onChange={(event) => {
//                   this.task.description = event.currentTarget.value;
//                 }}
//                 rows={10}
//               />
//             </Column>
//           </Row>
//           <Row>
//             <Column width={2}>Done:</Column>
//             <Column>
//               <Form.Checkbox
//                 checked={this.task.done}
//                 onChange={(event) => (this.task.done = event.currentTarget.checked)}
//               />
//             </Column>
//           </Row>
//         </Card>
//         <Row>
//           <Column>
//             <Button.Success
//               onClick={() => {
//                 alert('task saved');

//                 taskService
//                   .update(this.task.id, this.task.done, this.task.description)

//                   .catch((error) => Alert.danger('Error creating task: ' + error.message));
//               }}
//             >
//               Save
//             </Button.Success>
//           </Column>
//           <Column right>
//             <Button.Danger
//               onClick={() => {
//                 alert('task updated');
//                 taskService
//                   .delete(this.task.id)
//                   .then(() => {
//                     history.push('/tasks');
//                   })
//                   .catch((error) => Alert.danger('Error deleting task: ' + error.message));
//               }}
//             >
//               Delete
//             </Button.Danger>
//           </Column>
//         </Row>
//       </>
//     );
//   }

//   mounted() {
//     taskService
//       .get(this.props.match.params.id)
//       .then((task) => (this.task = task))
//       .catch((error) => Alert.danger('Error getting task: ' + error.message));
//   }
// }
