import pool from '../mysql-pool';

export type User = {
  nick: string;
  about: string;
  email: string;
};

export type Token = {
  id: number;
  token: string;
};

class UserService {
  bcrypt = require('bcrypt');
  saltRounds = 10;

  users_logged_in: Token[] = [];
  axios: any;

  create_hash(password: string) {
    return new Promise<string>((resolve, reject) =>
      this.bcrypt.hash(password, this.saltRounds, function (err: any, hash: string) {
        resolve(hash);
      })
    );
  }

  compare_hash(password: string, hash: string) {
    return new Promise<void>((resolve, reject) =>
      this.bcrypt.compare(password, hash, function (err: any, result: boolean) {
        result ? resolve() : reject();
      })
    );
  }

  create_token(id: number) {
    return new Promise<Token>((resolve, reject) =>
      this.bcrypt.hash('token' + id, this.saltRounds, function (err: any, hash: string) {
        resolve({ id: id, token: hash });
      })
    );
  }

  get(id: Number) {
    return new Promise<User>((resolve, reject) => {
      pool.query('SELECT * FROM users WHERE user_id=?', [id], (error, results) => {
        if (error) return reject(error);
        try {
          resolve({
            nick: results[0].user_nickname,
            about: results[0].user_about,
            email: results[0].email,
          });
        } catch {
          reject('Userdata not found');
        }
      });
    });
  }

  get_all() {
    return new Promise<User[]>((resolve, reject) => {
      pool.query('SELECT * FROM users', (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  put(id: number, user: User) {
    return new Promise<User>((resolve, reject) => {
      pool.query(
        'UPDATE users SET user_nickname=?, user_about=? WHERE user_id=?',
        [user.nick, user.about, id],
        (error, results) => {
          if (error) return reject(error);
          resolve(user);
        }
      );
    });
  }

  add(email: string, password: string) {
    return new Promise<Token>((resolve, reject) => {
      this.create_hash(password).then((hash) => {
        pool.query('INSERT INTO users SET email=?, hash=?', [email, hash], (error, results) => {
          if (error) return reject(error);

          this.create_token(results.insertId).then((token) => {
            this.users_logged_in.push(token);
            resolve(token);
          });
        });
      });
    });
  }

  login(email: string, password: string) {
    let salt: string = 'random';

    return new Promise<Token>((resolve, reject) => {
      pool.query('SELECT * FROM users WHERE email=?', [email], (error, results) => {
        if (error) return reject(error);

        this.compare_hash(password, results[0]?.hash)
          .then(() => {
            this.create_token(results[0].user_id).then((token) => {
              // Log out any old token and add new token
              this.logout(token.id);
              this.users_logged_in.push(token);

              return resolve(token);
            });
          })
          .catch(() => reject('No users or wrong password'));
      });
    });
  }

  // Remove token from users logged in
  logout(user_id: number) {
    this.users_logged_in = this.users_logged_in.filter((token) => token.id != user_id);
  }

  verify(authorization: string | undefined) {
    let token = JSON.parse(authorization || '{"id":0, "token":""}');

    return new Promise<number>((resolve, reject) => {
      let index: number = this.users_logged_in.findIndex(
        (t) => t.id == token.id && t.token == token.token
      );

      if (index < 0) {
        reject();
      }
      resolve(token.id);
    });
  }

  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM users WHERE user_id = ?', [id], (error, results) => {
        if (error) return reject(error);

        this.logout(id);
        resolve();
      });
    });
  }
}

const userService = new UserService();
export default userService;
