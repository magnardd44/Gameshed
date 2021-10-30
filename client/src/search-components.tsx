import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, ThumbNail } from './widgets';
import { NavLink } from 'react-router-dom';
import taskService, { Task } from './task-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class SearchResult extends Component {
  render() {
    return (
      <Card title="Game Title">
        <h6 className="card-subtitle mb-2 text-muted">
          Rating:{' '}
          <ThumbNail small img="https://cdn-icons-png.flaticon.com/512/220/220725.png"></ThumbNail>
        </h6>
        <Row>
          <Column width={2}>
            <ThumbNail img="https://cdn-icons-png.flaticon.com/512/686/686589.png"></ThumbNail>
          </Column>
          <Column width={8}>Description:</Column>
          <Column>Details</Column>
        </Row>
      </Card>
    );
  }
}
