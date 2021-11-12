import axios from 'axios';
import { sharedComponentData } from 'react-simplified';

export type Token= {
	id: number;
	token: string;
}

class UserService {
	name: string = 'Anonym';
	about: string = '';
	email: string = '';

	token: Token | null = null;

	   axios;

	   constructor () {
		   this.axios = axios.create();
		   this.axios.interceptors.request.use((config)=>{
				   config.headers.common['Authorization'] = JSON.stringify(this.token)
				   return config;
				   }, (error) => Promise.reject(error))
	   }

	   login(email: String, password: String) {
		   return this.axios.post('user/login', {email: email, password: password})
			   .then((response)=>{
					   this.token = response.data;
					   })
		   .catch(err=>{
				   console.log(err)
				   throw (err)
				   })
	   }

	   logout() {
		   if(this.token) {
			   this.axios.post('user/logout')
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
			   return this.axios.post('user/get')
				   .then((response)=>{
						   if (this.name) this.name = response.data.nick;
						   if (this.about) this.about = response.data.about;
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
			   let user = { nick: this.name,
				   email: this.email,
				   about: this.about
			   };

			   return this.axios.put('user', {user: user})
				   .catch(err=>{
						   console.log(err)
						   throw err
						   })
		   } else {
			   return Promise.reject();
		   }

	   }

	   register(email: string, password: string) {
		   return this.axios.post('user/add', {email: email, password: password})
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
			   this.axios.post('user/delete')
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
