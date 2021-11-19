import axios from 'axios';
import { Alert } from '../widgets';
import { sharedComponentData } from 'react-simplified';

export type Token = {
  id: number;
  token: string;
};

class UserService {
  name: string = '';
  about: string = '';
  email: string = '';

  token: Token | null = null;
  storage: any;

  axios;

  constructor() {
    this.axios = axios.create({
      baseURL: 'http://localhost:3000/api/v2',
    });
    this.axios.interceptors.request.use(
      (config) => {
        config.headers.common['Authorization'] = JSON.stringify(this.token);
        return config;
      },
      (error) => Promise.reject(error)
    );
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status == 401) {
          Alert.info('Vennligst logg inn.');
        }
        return Promise.reject(error);
      }
    );

    if (typeof Storage !== 'undefined') {
      this.storage = localStorage;
    }

    let token = this.storage?.getItem('userToken');
    if (token) {
      this.token = JSON.parse(token);
    }
  }

  login(email: String, password: String) {
    return this.axios
      .post('user/login', { email: email, password: password })
      .then((response) => {
        this.token = response.data;
        localStorage.setItem('userToken', JSON.stringify(this.token));
      })
      .catch((err) => {
        //console.log(err);
        throw err;
      });
  }

  logout() {
    if (this.token) {
      this.axios
        .post('user/logout')
        .then(() => {
          //      this.token = null;
          //      localStorage.removeItem('userToken');
          //      this.name = '';
          //      this.about = '';
          //      this.email = '';
        })
        .catch((err) => console.log(err));
    }

    this.token = null;
    localStorage.removeItem('userToken');
    this.name = '';
    this.about = '';
    this.email = '';
  }

  get_user() {
    if (this.token) {
      return this.axios
        .get('user')
        .then((response) => {
          this.name = response.data.nick || 'Anonym';
          this.about = response.data.about || '';
          this.email = response.data.email;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return Promise.reject();
    }
  }

  set_user() {
    if (this.token) {
      let user = { nick: this.name, email: this.email, about: this.about };

      return this.axios.put('user', { user: user }).catch((err) => {
        console.log(err);
        throw err;
      });
    } else {
      return Promise.reject();
    }
  }

  register(email: string, password: string) {
    return this.axios
      .post('user/add', { email: email, password: password })
      .then((response) => {
        this.token = response.data;
        localStorage.setItem('userToken', JSON.stringify(this.token));
        this.get_user();
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  delete() {
    if (this.token) {
      this.axios
        .delete('user')
        .then((response) => {
          this.token = null;
          localStorage.removeItem('userToken');
          this.name = 'Anonym';
          this.about = '';
          this.email = '';
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    }
  }
}

const userService = sharedComponentData(new UserService());
export default userService;
