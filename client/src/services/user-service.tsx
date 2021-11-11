import axios from 'axios';
import { sharedComponentData } from 'react-simplified';

export type Token= {
	id: number;
	token: string;
}

class UserService {
	name: string = 'Anonym';
	about: string = ''
	email: string = ''

	token: Token | null = null;

	login(email: String, password: String) {
		return axios.post('user/login', {email: email, password: password})
			.then((response)=>{
				this.token = response.data;
				this.get_user();
			})
			.catch(err=>{
					console.log(err)
					throw (err)
			})
	}

	logout() {
		if(this.token) {
			axios.post('user/logout', {token: this.token})
				.then(()=>{
						this.token = null;
						this.name = 'Anonym'
						this.about = ''
						this.email = ''
						})
				.catch(err=>console.log(err))
		}

		// Logg ut alltid uansett?
		// this.token = null;
		// this.name = 'Anonym'
		// this.about = ''
		// this.email = ''
	}

	get_user() {
		if(this.token) {
			return axios.post('user/get', {token: this.token})
				.then((response)=>{
						this.name = response.data.nick;
						this.about = response.data.about;
						this.email = response.data.email;
						})
			.catch(err=>{
					console.log(err)
			})
		} else {
			return Promise.reject();
		}

	}

	set_user() {
		if(this.token) {
			let user = {
				nick: this.name,
				email: this.email,
				about: this.about
			}
				
			return axios.put('user', {token: this.token, user: user})
			.catch(err=>{
					console.log(err)
					throw err
			})
		} else {
			return Promise.reject();
		}

	}

	register(email: string, password: string) {
		return axios.post('user/add', {email: email, password: password})
			.then((response)=>{
				this.token = response.data;

				this.get_user();
			})
			.catch(err=>{
					console.log(err)
					throw err
			})
	}

	delete() {
		if(this.token) {
			axios.post('user/delete', {token: this.token})
				.then((response)=>{
						this.token = null;
						this.name = 'Anonym'
						this.about = ''
						this.email = ''
						})
				.catch(err=>console.log(err))
		}
	}
}

const userService = sharedComponentData(new UserService());
export default userService;
