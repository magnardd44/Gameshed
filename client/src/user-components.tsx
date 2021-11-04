import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import {
  Form,
  Button,
} from './widgets';

class UserService {
	name: String = 'Anonym';
	id: number = 0;
	token: String = '';
	logged: boolean = false;

	login(name: String, password: String) {
		this.name = name;
		this.logged = true;
		this.id = 1;
	}

	logout() {
		this.name = 'Anonym';
		this.logged = false;
		this.id = 0;
	}
}

let user = sharedComponentData(new UserService());

export class User extends Component {
	input: string = '';
	password: string = '';

	render() {
	    return (<>
	  		  <Form.Label>Brukernamn:</Form.Label>
	  		  <Form.Input
				  type='text'
				  value={this.input}
				  placeholder='Anonym'
				  disabled={user.logged}
				  onChange={(event) => { 
				  this.input = event.currentTarget.value;
				  }}
	  		  />
	  		  {user.id == 0 
			  ? // If not logged in
				  <>
				  <Form.Input
					  type='text'
					  value={this.password}
					  placeholder='Passord'
					  onChange={(event) => { 
					  this.password = event.currentTarget.value;
					  }}
				  />
	  			  <Button.Light onClick={()=>{
	  				  user.login(this.input, this.password);
	  				  this.password = '';
	  			  }}>Login</Button.Light>
				  </> 
			  : // else logged in
	  			  <Button.Light onClick={()=>{
	  				  user.logout();
	  				  this.input = '';
	  				  this.password = '';
	  			  }}>Logout</Button.Light>
	  		  }
	    </>)
	}
}
