import {SEOUL_METRO_API_KEY} from '@env';

const URL = `http://openapi.seoul.go.kr:8088/${SEOUL_METRO_API_KEY}/json/subwayStationMaster/1/800/`;

const INITIAL_POSITION = {latitude: 37.570161, longitude: 126.982923};

const ZERO_COORDS = {coords: {latitude: 0, longitude: 0}};

const TARGET_LOCATION_DISTANCE = 0.005;

export {URL, INITIAL_POSITION, ZERO_COORDS, TARGET_LOCATION_DISTANCE};
