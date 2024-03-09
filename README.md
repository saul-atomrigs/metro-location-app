# metro-location-app

## 💡 프로젝트 소개
지하철 타고 가다가 내려야되는 역을 듣지 못하고 지나쳐버린 개인 경험에서 비롯하여 이를 해결해줄 앱을 만들기로 결심하였습니다. 

사용자의 현재 위치를 실시간으로 파악하기 위해 모바일 디바이스의 geolocation 데이터를 추적하여 앱이 background 상태일 때도 내릴 역에 도착하면 푸쉬알림을 띄워줍니다

|                                                지하철역 검색 기능                                                 |                                                지하철 역 근처에 도착하면 푸시 알림 기능                                                  |
| :-----------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: |
| ![Screenshot_1696865246](https://github.com/saul-atomrigs/metro-location-app/assets/82362278/8b4f79f6-2c58-44ed-bfef-971b0defe5a0) | ![1233](https://github.com/saul-atomrigs/metro-location-app/assets/82362278/261df715-2c9e-4e40-aeac-4b745d8096a1) |

## 💡 Authors

- [@saul-atomrigs](https://www.github.com/saul-atomrigs)


## 💡 Installation

Android Studio (emulator) 또는 XCode (simulator) 또는 실기기 연결 후 로컬환경에서 다음 명령어를 실행해주세요.

```bash
  yarn start
  yarn run android // or yarn run ios
```

## 💡 Tech Stack

- **프론트엔드:** React Native, Styled-Components
- **상태관리:** Recoil

- **푸시알림:** notifee

- **지도:** React-native-nmap, react-native-geolocation-service

- **테스트:** jest

- **코드컨벤션:** eslint, prettier

## 💡 Performance (속도 및 성능 개선 코드)
### debounce 적용해서 input 타이핑 시 API 호출 줄이기

[문제] 기존 코드에는 한글자 타이핑 할 때 마다 지하철 데이터 API 함수를 호출하기 때문에 상당히 비효율적이었습니다.

[해결] `lodash` 라이브러리의 `debounce` 메서드를 이용하여 700ms 동안 호출을 지연시킵니다. 타이핑이 멈추고 (끝나고) 해당 시간이 지난 후에야 함수 호출을 하기 때문에 불필요한 호출 빈도를 줄일 수 있습니다. 

[코드]  

```tsx
import {debounce} from 'lodash';
...
const debouncedGetMetroData = debounce(getMetroData, 700);
...
// jsx
<SearchBarInput
	...
  onChangeText={text => {
    debouncedGetMetroData(text);
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  }}
/>
```
[출처] https://www.mrlatte.net/code/2020/12/15/lodash-debounce


## 💡 주요 개발 포인트 (이슈, 버그, 개선)
- ### 절대경로 세팅, 2023.03.15
  [커밋] https://github.com/saul-atomrigs/metro-location-app/commit/071a4dd0acd691baccdd73c14f2e8dc08683489f)
```
// 상대경로 예시:
import ImportHell from '../../../../../src/screens/ImportHell'

// 절대경로 예시:
import ImportHeaven from 'screens/ImportHeaven'
```

- ### `locale` 설정 (`react-native-localize`), 2023.03.17
  [커밋] https://github.com/saul-atomrigs/metro-location-app/commit/8826ecdfba7458bedfa17430ba7c1d7ac838b5d9)

- ### 커스텀 폰트 적용, 2023.04.02
  [커밋] https://github.com/saul-atomrigs/metro-location-app/commit/bc7fa6972b1f0d3aae658c3477f7f8c48f777ea5)

- ### `react-native-geolocation-service` 라이브러리를 활용하여 유저의 현재 위치 파악 기능 추가, 2023.04.03
    - 리액트 네이티브 위치 퍼미션 이슈 해결 (https://stackoverflow.com/questions/59892302/location-permission-not-granted-in-react-native)
    - 실기기에서 위치 실시간으로 반영되는지 백그라운드에서도 테스트

- ### `react-native-config`활용하여 `.env` 환경변수 설정 (ios, android 상이함)
  [참조] https://github.com/luggit/react-native-config - April 5, 2023
    - [iOS 에러]: iOS에서만 환경 변수 못 읽어오는 이슈. 버전 reverted해서 임시적으로 해결 ([https://github.com/luggit/react-native-config/issues/737#issuecomment-1464954367](https://github.com/luggit/react-native-config/issues/737#issuecomment-1464954367)) April 16, 2023 -> 커밋: https://github.com/saul-atomrigs/metro-location-app/commit/94561207d995f2e8ae4b7c98cd535afd9f6202c3
    - [Babel 에러]: `.plugins 0 may only be a two-tuple or three-tuple`
    
        April 18, 2023 https://github.com/goatandsheep/react-native-dotenv 라이브러리로 대체 → Babel 설정 중 2개 이상의 `plugins` 설정 하는 법 배울 수 있었다([https://stackoverflow.com/questions/46937204/is-it-possible-to-use-more-than-one-babel-preset-in-a-project](https://stackoverflow.com/questions/46937204/is-it-possible-to-use-more-than-one-babel-preset-in-a-project)) 
        → 바벨 설정 커밋 링크 (https://github.com/saul-atomrigs/metro-location-app/commit/ad8613d7e233f0af01c614e0421dfdee41f5110d)

- ### 네이버지도 API 연동 (`react-native-naver-map`), 2023.04.04 ~ 05
    - RNNaverMapMarker을 UIManager가 찾지 못하는 이슈 해결 → node_modules 폴더와 yarn.lock 파일 삭제하고, ios 폴더로 이동해 pod deintegrate 후 다시 pod install(https://www.inflearn.com/questions/611165/rnnavermapmarker을-uimanager가-찾지-못하는-에러)
    - 리액트 네이티브에서 환경 변수 세팅하기 (react-native-config). iOS, Android 각각 설정 방식 다름. 2023.04.05
    - iOS에서 네이버 지도 셋업
    - Android에서 네이버 지도 셋업
        - [안드로이드 에러]: 라이브러리 추가 시 에러 (Build was configured to prefer settings repositories..)는 이 곳 (https://angelplayer.tistory.com/263) 에서 방법 2로 해결, 2023.04.05
    - [ios, Android 공통 타입 에러]: NaverMapViewProps에 children이 없어서 NaverMapView 컴포넌트의 자식 컴포넌트를 넣으면 타입 에러 (No overload matches this call…) 뜨는 이슈.
        https://github.com/QuadFlask/react-native-naver-map/pull/149 ← PR올라와 있지만, 아직 반영이 안 되어, 직접 node_modules 소스코드에 반영하여 patch package 하여 이슈 해결 April 16, 2023 -> 커밋: https://github.com/saul-atomrigs/metro-location-app/commit/af0ea303b12397ec98e97668574192bea2138df8
 
- ### 포그라운드, 백그라운드 알림 (notification)
     - [Local notification vs Push (remote) notification]
        - local: 앱 자체에서 띄움. 예) 시간, 장소, 스케쥴 등에 따라 알림 등 ← metro-location-app에 더 적합
            - Notifee [https://velog.io/@2ast/React-Native-local-push-notification-셋팅하기-feat-notifee](https://velog.io/@2ast/React-Native-local-push-notification-%EC%85%8B%ED%8C%85%ED%95%98%EA%B8%B0-feat-notifee) April 27, 2023 안드로이드 알림이 오긴 하지만, 팝업 형식으로 하려면?
        - push: 외부 서버에서 띄움. 예) 실시간 안내, abandoned cart 알림 등
    - `Geolocation` 패키지의 `watchPosition` 메소드를 `notifee.registerForegroundService` 안에 추가. May 19, 2023:
    
    ```tsx
    notifee.registerForegroundService(() => {
      let currentLatitude = '';
      let currentLongitude = '';
      Geolocation.watchPosition(position => {
        currentLatitude = position.coords.latitude;
        currentLongitude = position.coords.longitude;
      });
      return new Promise(() => {
        if (
          Math.abs(currentLatitude - P0.latitude) < 0.005 &&
          Math.abs(currentLongitude - P0.longitude) < 0.005
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
- ### 안드로이드 aab 배포 파일 생성 시, keystore 비밀번호를 keychain에 저장 (보안 이슈 해결)
  ```build.gradle
  def getPassword(String currentUser, String keyChain) {
   def stdout = new ByteArrayOutputStream()
   def stderr = new ByteArrayOutputStream()
   exec {
       commandLine 'security', '-q', 'find-generic-password', '-a', currentUser, '-s', keyChain, '-w'
       standardOutput = stdout
       errorOutput = stderr
       ignoreExitValue true
   }
   //noinspection GroovyAssignabilityCheck
      stdout.toString().trim()
  }
    ```
  [참조] https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/

- ### not found 에러 July 13, 2023 

    [iOS 빌드 에러] module map file '/Users/atomrigslab/Library/Developer/Xcode/DerivedData/metro-goccvfvslwkmkmedzwsqgmqkcmim/Build/Products/Debug-iphonesimulator/YogaKit/YogaKit.modulemap' not found 
    
    [해결] 여기서 xcdoeproj 가 아닌 xcworkspace 파일을 통해서 xcode를 열어야한다.
    
    [출처] https://alpoxdev.tistory.com/18

- ### 안드로이드 앱 출시 August 5, 2023 

    [Android앱 출시 에러] Android 13(API 33)에 광고 ID 변경사항 도입광고 ID를 사용하고 Android 13 이상을 타겟팅하는 앱은 앱 매니페스트에서 com.google.android.gms.permission.AD_ID 권한을 선언해야 합니다.
    
    [해결] **(1) 광고가 없을 시** `AndroidManifest.xml`에 다음을 추가:
    
    ```jsx
    <uses-permission
            android:name="com.google.android.gms.permission.AD_ID"
            tools:node="remove" />
    
    <meta-data
                android:name="google_analytics_adid_collection_enabled"
                android:value="false" />
    ```
    
    **(2) 광고가 있다면** 콘솔에서 광고 사용을 '예'로 하고 Analytics를 체크
    
    [출처] [https://velog.io/@zinkiki/Android앱-출시-Android-13API-33에-광고-ID-변경사항-도입광고-ID를-사용하고-Android-13-이상을-타겟팅하는-앱은-앱-매니페스트에서-com.google.android.gms.permission.ADID-권한을-선언해야-합니다](https://velog.io/@zinkiki/Android%EC%95%B1-%EC%B6%9C%EC%8B%9C-Android-13API-33%EC%97%90-%EA%B4%91%EA%B3%A0-ID-%EB%B3%80%EA%B2%BD%EC%82%AC%ED%95%AD-%EB%8F%84%EC%9E%85%EA%B4%91%EA%B3%A0-ID%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B3%A0-Android-13-%EC%9D%B4%EC%83%81%EC%9D%84-%ED%83%80%EA%B2%9F%ED%8C%85%ED%95%98%EB%8A%94-%EC%95%B1%EC%9D%80-%EC%95%B1-%EB%A7%A4%EB%8B%88%ED%8E%98%EC%8A%A4%ED%8A%B8%EC%97%90%EC%84%9C-com.google.android.gms.permission.ADID-%EA%B6%8C%ED%95%9C%EC%9D%84-%EC%84%A0%EC%96%B8%ED%95%B4%EC%95%BC-%ED%95%A9%EB%8B%88%EB%8B%A4)

- ### Failed to start the app. Error: spawnSync adb ENOENT August 20, 2023

    [안드로이드 빌드 에러] 
    
    [원인] 미상
    
    [해결] 터미널에 `nano ~./zshrc` → 환경변수 재설정:
    
    ```
    export ANDROID_HOME={복사한 안드로이드 sdk 위치}
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```
    
    [출처] [https://velog.io/@minwoo129/React-Native-개발환경-설정mac-OS](https://velog.io/@minwoo129/React-Native-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EC%84%A4%EC%A0%95mac-OS)

- ### **'butter/map.h' error**

    [iOS 빌드 에러] 스크린샷

    <img width="270" alt="스크린샷 2023-09-27 오후 11 28 36" src="https://github.com/saul-atomrigs/metro-location-app/assets/82362278/c917b969-c4a2-4b59-be4f-5e84acfeede6">

    [해결] XCode 빌드 폴더 클린 후 다음 커맨드 실행:
    ```
    rm -rf ios/build
    rm -rf Pods
    pod install
    ```
    [출처] https://github.com/software-mansion/react-native-reanimated/issues/3823#issuecomment-1346687536
