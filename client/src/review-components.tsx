import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import taskService, { Task } from './task-service';
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

  render() {
    return (
      <>
        <Card title="Skriv anmeldelse">
          <Row>
            <Column width={2}>Spill:</Column>
            <Column>Gloomhaven</Column>
          </Row>
          <Row>
            <Column width={2}>Sjanger:</Column>
            <Column>Adventure</Column>
          </Row>
          <Row>
            <Column width={2}>Plattform:</Column>
            <Column>PC (Microsoft Windows)</Column>
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
              <Form.Input
                type=""
                value={this.rating ?? ''}
                onChange={(event) => {
                  //this.rating = event.currentTarget.value;
                }}
                rows={20}
              />
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => {
            taskService
              .create(this.reviewTitle, this.text, this.rating)
              .then((id) => history.push('/tasks/' + id))
              .catch((error) => Alert.danger('Error creating task: ' + error.message));
          }}
        >
          Lagre
        </Button.Success>
      </>
    );
  }
}

// export class TaskDetails extends Component<{ match: { params: { id: number } } }> {
//   task: Task = { id: 0, title: '', done: false, description: '' };

//   render() {
//     return (
//       <>
//         <Card title="Task">
//           <Row>
//             <Column width={2}>Title:</Column>
//             <Column>{this.task.title}</Column>
//           </Row>
//           <Row>
//             <Column width={2}>Description:</Column>
//             <Column>{this.task.description}</Column>
//           </Row>
//           <Row>
//             <Column width={2}>Done:</Column>
//             <Column>
//               <Form.Checkbox checked={this.task.done} onChange={() => {}} disabled />
//             </Column>
//           </Row>
//         </Card>
//         <Button.Success
//           onClick={() => history.push('/tasks/' + this.props.match.params.id + '/edit')}
//         >
//           Edit
//         </Button.Success>
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
