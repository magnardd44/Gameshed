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
  }

  async test() {
    this.axios.get('/test').then(function (response) {
      console.log(response.data);
    });
  }

  login(email: String, password: String) {
    return this.axios
      .post('user/login', { email: email, password: password })
      .then((response) => {
        this.token = response.data;
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
          this.token = null;
          this.name = '';
          this.about = '';
          this.email = '';
        })
        .catch((err) => console.log(err));
    }

    // Logg ut alltid uansett?
    // this.token = null;
    // this.name = 'Anonym'
    // this.about = ''
    // this.email = ''
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
          this.name = 'Anonym';
          this.about = '';
          this.email = '';
        })
        .catch((err) => console.log(err));
    }
  }
}

const userService = sharedComponentData(new UserService());
export default userService;
