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

- 네이버지도 API 연동 (`react-native-naver-map`), 2023.04.04 ~ 05
    - RNNaverMapMarker을 UIManager가 찾지 못하는 이슈 해결 → node_modules 폴더와 yarn.lock 파일 삭제하고, ios 폴더로 이동해 pod deintegrate 후 다시 pod install(https://www.inflearn.com/questions/611165/rnnavermapmarker을-uimanager가-찾지-못하는-에러)
    - 리액트 네이티브에서 환경 변수 세팅하기 (react-native-config). iOS, Android 각각 설정 방식 다름. 2023.04.05
    - iOS에서 네이버 지도 셋업
    - Android에서 네이버 지도 셋업
        - [안드로이드 에러]: 라이브러리 추가 시 에러 (Build was configured to prefer settings repositories..)는 이 곳 (https://angelplayer.tistory.com/263) 에서 방법 2로 해결, 2023.04.05
