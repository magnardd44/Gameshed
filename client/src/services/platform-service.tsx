import axios from 'axios';
import { sharedComponentData } from 'react-simplified';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Platform = {
  platform_id: number;
  platform_name: string;
};

class PlatformService {
  platform: Platform = {
    platform_id: 0,
    platform_name: '',
  };
  platforms: Platform[] = [];

  /**
   * Get platform with given id.
   */
  get(id: number) {
    return axios.get<Platform>('/platforms/' + id).then((response) => response.data);
  }

  /**
   * Get platform id with given name.
   */
  getId(name: string) {
    return axios.get<Platform>('/platforms/' + name).then((response) => response.data);
  }

  /**
   * Get all platforms.
   */
  getAll() {
    return axios.get<Platform[]>('/platforms').then((response) => response.data);
  }

  /**
   * Create new platform having the given name.
   *
   * Resolves the newly created platform id.
   */
  create(name: string) {
    return axios
      .post<{ id: number }>('/platforms', {
        name: name,
      })
      .then((response) => response.data.id);
  }

  /**
   * Update mappin_platform with platform_id and game_id.
   *
   * Resolves the newly created platform id.
   */
  updatePlatformMap(platform_id: number, game_id: number) {
    return axios.post<{ id: number }>('/platformMap', {
      platform_id: platform_id,
      game_id: game_id,
    });
  }
}

export let platformService = sharedComponentData(new PlatformService());
