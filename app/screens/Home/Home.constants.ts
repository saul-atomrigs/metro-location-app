import {SEOUL_METRO_API_KEY} from '@env';

const URL = `http://openapi.seoul.go.kr:8088/${SEOUL_METRO_API_KEY}/json/subwayStationMaster/1/8/`;
const INITIAL_POSITION = {latitude: 37.570161, longitude: 126.982923};

export {URL, INITIAL_POSITION};
