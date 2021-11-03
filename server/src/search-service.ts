import axios from 'axios';

type Oauth_token = {
  access_token: string;
  expire_time: number;
  token_type: string;
};

class SearchService {
	token: Oauth_token = {
		access_token : '',
		expire_time : 0,
		token_type : ''
	};

	// Skaffar ny "Access Token" ved behov. Skal vare i 60 dager ifylgje dokumentasjon.
	async get_token() {
		if(Date.now() < this.token.expire_time) {
			return this.token;
		} else {
			await axios.post( 'https://id.twitch.tv/oauth2/token' 
							 + '?client_id=' + process.env.IGDB_CLIENT_ID 
							 + '&client_secret=' + process.env.IGDB_CLIENT_SECRET 
							 + '&grant_type=client_credentials')
			.then(res=>{ 
				this.token.access_token = res.data.access_token;
				this.token.expire_time = res.data.expires_in * 1000 + Date.now();
				this.token.token_type = res.data.token_type;
				console.log('Update token');
			})
			.catch(err=>console.log(err));
			return this.token;
		}
	}

	async search(game: string) {
		await this.get_token();
		return await axios({
			url: "https://api.igdb.com/v4/games",
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Client-ID': process.env.IGDB_CLIENT_ID,
				'Authorization': this.token.token_type + ' ' + this.token.access_token
			},
			data: 'search "' + game + '"; fields name,summary,cover.url,aggregated_rating;'
		})
		.then(response => {
			return response.data;
		})
		.catch(err => {
			console.error(err);
		});
	}

	async get(external_id: string) {
		await this.get_token();
		return await axios({
			url: "https://api.igdb.com/v4/games",
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Client-ID': process.env.IGDB_CLIENT_ID,
				'Authorization': this.token.token_type + ' ' + this.token.access_token
			},
			data: 'fields *; where id=' + external_id + ';'
			//data: 'fields name,summary,cover.url,aggregated_rating; where id=' + external_id + ';'
			})
		.then(response => {
			return response.data;
		})
		.catch(err => {
			console.error(err);
		});
	}
}

const searchService = new SearchService();
export default searchService;
