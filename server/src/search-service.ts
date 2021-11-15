import axios from 'axios';

type Oauth_token = {
  access_token: string;
  expire_time: number;
  token_type: string;
};

class SearchService {
  gameFields = 'name,genres.name,platforms.name,summary';
  extraFields =
    'cover.url,aggregated_rating,screenshots.image_id,similar_games.name,first_release_date';

  token: Oauth_token = {
    access_token: '',
    expire_time: 0,
    token_type: '',
  };

  // Skaffar ny "Access Token" ved behov. Skal vare i 60 dager ifylgje dokumentasjon.
  async get_token() {
    if (Date.now() < this.token.expire_time) {
      return this.token;
    } else {
      await axios
        .post(
          'https://id.twitch.tv/oauth2/token' +
            '?client_id=' +
            process.env.IGDB_CLIENT_ID +
            '&client_secret=' +
            process.env.IGDB_CLIENT_SECRET +
            '&grant_type=client_credentials'
        )
        .then((res) => {
          this.token.access_token = res.data.access_token;
          this.token.expire_time = res.data.expires_in * 1000 + Date.now();
          this.token.token_type = res.data.token_type;
          console.log('Update token');
        })
        .catch((err) => console.log(err));
      return this.token;
    }
  }

  async search(game: string) {
    await this.get_token();
    return await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': process.env.IGDB_CLIENT_ID,
        Authorization: this.token.token_type + ' ' + this.token.access_token,
      },
      data: 'search "' + game + '"; fields ' + this.gameFields + ',' + this.extraFields + ';', //cover.url,aggregated_rating;',
    })
      .then((response) => {
        return response.data.map((g: any) => {
          return {
            game_id: 0,
            igdb_id: g.id,
            game_title: g.name,
            genre: g.genres?.map((e: any) => e.name),
            platform: g.platforms?.map((e: any) => e.name),
            game_description: g.summary,
            igdb: {
              cover_url: 'http:' + g.cover?.url,
              aggregated_rating: g.aggregated_rating,
              screenshots_url: g.screenshots?.map(
                (e: any) =>
                  'https://images.igdb.com/igdb/image/upload/t_original/' + e.image_id + '.jpg'
              ),
              similar_games: g.similar_games?.map((e: any) => e),
              release_date: g.first_release_date,
            },
          };
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async get(external_id: string) {
    await this.get_token();
    return await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': process.env.IGDB_CLIENT_ID,
        Authorization: this.token.token_type + ' ' + this.token.access_token,
      },
      data: 'fields ' + this.gameFields + '; where id=' + external_id + ';',
    })
      .then((response) => {
        return {
          game_id: 0,
          igdb_id: response.data[0].id,
          game_title: response.data[0].name,
          genre: response.data[0].genres.map((e: any) => e.name),
          platform: response.data[0].platforms.map((e: any) => e.name),
          game_description: response.data[0].summary,
          igdb: null,
        };
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async get_extra(external_id: string) {
    await this.get_token();
    return await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': process.env.IGDB_CLIENT_ID,
        Authorization: this.token.token_type + ' ' + this.token.access_token,
      },
      data: 'fields ' + this.extraFields + '; where id=' + external_id + ';',
    })
      .then((response) => {
        return {
          cover_url: 'http:' + response.data[0].cover.url,
          aggregated_rating: response.data[0].aggregated_rating,
          screenshots_url: response.data[0].screenshots.map(
            (e: any) =>
              'https://images.igdb.com/igdb/image/upload/t_original/' + e.image_id + '.jpg'
          ),
          similar_games: response.data[0].similar_games.map((e: any) => e),
          release_date: response.data[0].first_release_date,
        };
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async get_game_and_extra(external_id: string) {
    await this.get_token();
    return await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': process.env.IGDB_CLIENT_ID,
        Authorization: this.token.token_type + ' ' + this.token.access_token,
      },
      data:
        'fields ' + this.gameFields + ',' + this.extraFields + '; where id=' + external_id + ';',
    })
      .then((response) => {
        return {
          game_id: 0,
          igdb_id: response.data[0].id,
          game_title: response.data[0].name,
          genre: response.data[0].genres.map((e: any) => e.name),
          platform: response.data[0].platforms.map((e: any) => e.name),
          game_description: response.data[0].summary,
          igdb: {
            cover_url: 'http:' + response.data[0].cover.url,
            aggregated_rating: response.data[0].aggregated_rating,
            screenshots_url: response.data[0].screenshots?.map(
              (e: any) =>
                'https://images.igdb.com/igdb/image/upload/t_original/' + e.image_id + '.jpg'
            ),
            similar_games: response.data[0].similar_games.map((e: any) => e),
            release_date: response.data[0].first_release_date,
          },
        };
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

const searchService = new SearchService();
export default searchService;
