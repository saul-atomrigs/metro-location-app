# metro-location-app

## 기획 의도
지하철 타고 가다가 내려야되는 역을 듣지 못하고 지나쳐버린 개인 경험에서 비롯하여 이를 해결해줄 앱을 만들기로 결심하였습니다.

## 주요 개발 포인트
- 절대경로 세팅, 2023.03.15
```
// 상대경로 예시:
import ImportHell from '../../../../../src/screens/ImportHell'

// 절대경로 예시:
import ImportHeaven from 'screens/ImportHeaven'
```

- `locale` 설정 (react-native-localize), 2023.03.17

- 커스텀 폰트 적용, 2023.04.02

- `react-native-geolocation-service` 라이브러리를 활용하여 유저의 현재 위치 파악 기능 추가, 2023.04.03
    - 리액트 네이티브 위치 퍼미션 이슈 해결 (https://stackoverflow.com/questions/59892302/location-permission-not-granted-in-react-native)
    - 실기기에서 위치 실시간으로 반영되는지 백그라운드에서도 테스트

- `react-native-config`활용하여 `.env` 환경변수 설정 (ios, android 상이함) - https://github.com/luggit/react-native-config - April 5, 2023
    - [iOS 에러]: iOS에서만 환경 변수 못 읽어오는 이슈. 버전 reverted해서 임시적으로 해결 ([https://github.com/luggit/react-native-config/issues/737#issuecomment-1464954367](https://github.com/luggit/react-native-config/issues/737#issuecomment-1464954367)) April 16, 2023 -> 커밋: https://github.com/saul-atomrigs/metro-location-app/commit/94561207d995f2e8ae4b7c98cd535afd9f6202c3
    - [Babel 에러]: `.plugins 0 may only be a two-tuple or three-tuple`
    
        April 18, 2023 https://github.com/goatandsheep/react-native-dotenv 라이브러리로 대체 → Babel 설정 중 2개 이상의 `plugins` 설정 하는 법 배울 수 있었다([https://stackoverflow.com/questions/46937204/is-it-possible-to-use-more-than-one-babel-preset-in-a-project](https://stackoverflow.com/questions/46937204/is-it-possible-to-use-more-than-one-babel-preset-in-a-project)) 
        → 바벨 설정 커밋 링크 (https://github.com/saul-atomrigs/metro-location-app/commit/ad8613d7e233f0af01c614e0421dfdee41f5110d)

- 네이버지도 API 연동 (`react-native-naver-map`), 2023.04.04 ~ 05
    - RNNaverMapMarker을 UIManager가 찾지 못하는 이슈 해결 → node_modules 폴더와 yarn.lock 파일 삭제하고, ios 폴더로 이동해 pod deintegrate 후 다시 pod install(https://www.inflearn.com/questions/611165/rnnavermapmarker을-uimanager가-찾지-못하는-에러)
    - 리액트 네이티브에서 환경 변수 세팅하기 (react-native-config). iOS, Android 각각 설정 방식 다름. 2023.04.05
    - iOS에서 네이버 지도 셋업
    - Android에서 네이버 지도 셋업
        - [안드로이드 에러]: 라이브러리 추가 시 에러 (Build was configured to prefer settings repositories..)는 이 곳 (https://angelplayer.tistory.com/263) 에서 방법 2로 해결, 2023.04.05
    - [ios, Android 공통 타입 에러]: NaverMapViewProps에 children이 없어서 NaverMapView 컴포넌트의 자식 컴포넌트를 넣으면 타입 에러 (No overload matches this call…) 뜨는 이슈.
        https://github.com/QuadFlask/react-native-naver-map/pull/149 ← PR올라와 있지만, 아직 반영이 안 되어, 직접 node_modules 소스코드에 반영하여 patch package 하여 이슈 해결 April 16, 2023 -> 커밋: https://github.com/saul-atomrigs/metro-location-app/commit/af0ea303b12397ec98e97668574192bea2138df8
        
-  백그라운드에서도 실시간 geolocation 받아오기
    - [https://rob-coding.tistory.com/1](https://rob-coding.tistory.com/11)
    - https://github.com/Agontuk/react-native-geolocation-service/issues/352#issuecomment-1221372193
    - `Geolocation` 패키지의 `watchPosition` 메소드를 `notifee.registerForegroundService` 안에 추가. (`index.tsx` )May 19, 2023
        
        ```tsx
        // android
        notifee.registerForegroundService(() => {
          let currentLatitude = '';
          let currentLongitude = '';
          Geolocation.watchPosition(position => {
            console.log('got position', position);
            currentLatitude = position.coords.latitude;
            currentLongitude = position.coords.longitude;
          });
          return new Promise(() => {
            if (
              Math.abs(currentLatitude - P0.latitude) < 0.005 &&
              Math.abs(currentLongitude - P0.longitude) < 0.005
              //   true
            ) {
              notifee.displayNotification({
                title: 'Foreground Service',
                body: '이번 역에서 내리세요',
                android: {
                  channelId: 'default',
                },
              });
            }
          });
        });
        ```
        
    - 좌표데이터는 `number` 타입인데, 습관적으로 `let 변수명 = ''` 으로 초기화해서 (즉, `string` 타입으로) 오류 발생 May 25, 2023
