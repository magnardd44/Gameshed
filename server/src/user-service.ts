import pool from './mysql-pool';

export type User = {
  nick: string;
  about: string;
  email: string;
};

export type Token = {
  id: number;
  token: string;
};

// TODO: passportjs + bcrypt

class UserService {
  users_logged_in: Token[] = [];

  create_hash(password: string, salt: string) {
    let hashed: string = salt + password;
    if (hashed.length > 32) hashed = hashed.slice(0, 32);

    return hashed;
  }

  create_token(id: number) {
    return { id: id, token: 'randomstring' };
  }

  get(id: Number) {
    return new Promise<User>((resolve, reject) => {
      pool.query('SELECT * FROM users WHERE user_id=?', [id], (error, results) => {
        if (error) return reject(error);
        resolve({
          nick: results[0].user_nickname,
          about: results[0].user_about,
          email: results[0].email,
        });
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
      let salt: string = 'random';
      let hashed: string = this.create_hash(password, salt);

      pool.query(
        'INSERT INTO users SET email=?, salt=?, hash=?',
        [email, salt, hashed],
        (error, results) => {
          if (error) return reject(error);

          let new_token: Token = this.create_token(results.insertId);

          this.users_logged_in.push(new_token);
          resolve(new_token);
        }
      );
    });
  }

  // Login and get token
  login(email: string, password: string) {
    let salt: string = 'random';
    let hashed: string = this.create_hash(password, salt);

    return new Promise<Token>((resolve, reject) => {
      pool.query('SELECT * FROM users WHERE email=?', [email], (error, results) => {
        if (error) return reject(error);
        if (results[0]?.hash == this.create_hash(password, results[0]?.salt)) {
          let new_token: Token = this.create_token(results[0].user_id);

          // Log out any old token and add new token
          this.logout(new_token.id);
          this.users_logged_in.push(new_token);

          return resolve(new_token);
        } else return reject('No user or wrong password');
      });
    });
  }

  // Remove token from users logged in
  logout(user_id: number) {
    this.users_logged_in = this.users_logged_in.filter((token) => token.id != user_id);
  }

  // Check if user token is valid and logged in
  verify(authorization: string | undefined) {
    let token = JSON.parse(authorization || '{"id":0, "token":""}');
    return new Promise<number>((resolve, reject) => {
      let index: number = this.users_logged_in.findIndex(
        (t) => t.id == token?.id && token?.token == t.token
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

  get_login_debug() {
    return new Promise<Token[]>((resolve, reject) => {
      resolve(this.users_logged_in);
    });
  }

  get_debug(id: number) {
    return new Promise<User>((resolve, reject) => {
      pool.query('SELECT * FROM users WHERE user_id=?', [id], (error, results) => {
        if (error) return reject(error);
        resolve({
          nick: results[0].user_nickname,
          about: results[0].user_about,
          email: results[0].email,
        });
      });
    });
  }
}

const userService = new UserService();
export default userService;
