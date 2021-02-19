# Vearch
## Google Developer Student Clubs

## 🔎Vearch = Video + Search
- 동영상 내 키워드 검색을 가능하게 하는 크롬 확장 프로그램입니다. 
- 웹에서 재생되는 동영상의 오디오를 추출하여 STT 변환 후, 키워드의 등장 시간과 횟수를 한 눈에 볼 수 있습니다.
- 한국어 컨텐츠만 이용가능합니다.

![Screenshot from 2021-02-19 05-35-45](https://user-images.githubusercontent.com/49135657/108418303-64550b80-7274-11eb-9714-921ce7a0b33a.png)
---

## Features

- 크롬 브라우저의 확장프로그램으로 동작
- Google Cloud STT(Speech To Text)를 이용하여 음성정보를 문자로 변환
- 변환된 문자로 스크립트 생성
- 동영상 내 키워드 검색 기능

## Installation

**1. 저장소 클론**
  ```bash
  git clone https://github.com/DSC-PKNU/Vearch
  ```

**2. `Vearch/nodejs2/` 디렉토리로 이동**
  ```bash
  cd Vearch/nodejs2/
  ```

**3. NPM Package설치**
  ```bash
  npm install
  ```
  - `추가적인 install이 필요할 수 있음`

**4. 구글 클라우드 인증 키 설정**
  - 본인 클라우드 계정 필요
  - 인증키 `.json` 받은 후
  - [문서](https://cloud.google.com/docs/authentication/getting-started) 참조하여 `GOOGLE_APPLICATION_CREDENTIALS` 환경변수 설정

**5. `Vearch/nodejs2/main-long_promise.js` 실행**
  ```bash
  node main-long_promise.js
  ```

**6. `Vearch/frontend` 폴더 크롬 확장프로그램으로 등록**

**7. 유튜브 링크 복사 후, 확장프로그램 실행**


## Usage

`2021/02/19 서버 닫힘`

**1. 확장 프로그램 다운로드**
  - [다운로드](https://drive.google.com/file/d/1IDAQMQAoe3UupcF-jF0xO4EUwquzoAd8/view?usp=sharing)

**2. 크롬 브라우저 `chrome://extensions` 접속**

**3. 개발자모드 켜고, 압축해제된 확장프로램 추가**

![image](https://user-images.githubusercontent.com/49135657/108422140-80a77700-7279-11eb-8fad-31db77cdefd1.png)


**4. 유튜브 링크 복사 후, 확장 프로그램 실행**

![image](https://user-images.githubusercontent.com/49135657/108422238-9f0d7280-7279-11eb-911d-6a2a50eee808.png)

## Members

**Chrome extensions**
- [박정빈](https://github.com/JeongbinPark)

**Back-end (Node.js)**
- [최대윤](https://github.com/Yoon6)

**Google Cloud Speech API**
- [황서영](https://github.com/dancing1emon)

## License

