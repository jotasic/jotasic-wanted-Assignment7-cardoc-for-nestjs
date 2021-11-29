# Assignment7-TW-NESJS
[![wakatime](https://wakatime.com/badge/user/3f950649-8abb-464a-875e-2597e17bedb1/project/8e949169-a515-477a-a536-edc80c1cbf5a.svg)](https://wakatime.com/badge/user/3f950649-8abb-464a-875e-2597e17bedb1/project/8e949169-a515-477a-a536-edc80c1cbf5a)

원티드x위코드 백엔드 프리온보딩 과제7 for NestJS
- 과제 출제 기업 정보
  - 기업명 : 카닥

> 이 과제를 django로도 구현하였습니다. 우측 링크를 참고해주세요 [github링크](https://github.com/Wanted-Preonboarding-Backend-1st-G5/Assignment7-TW)

## Member
| 이름  | github                                  |
|-------|-----------------------------------------|
|김태우 |[jotasic](https://github.com/jotasic)    | 


## TIL정리 (Blog)
- https://velog.io/@burnkim61/프리온보딩-과제-7


## 과제 내용
<details>
<summary><b>과제내용 자세히 보기</b></summary>
<div markdown="1">

### **[필수 포함 사항]**
- READ.ME 작성
    - 프로젝트 빌드, 자세한 실행 방법 명시
    - 구현 방법과 이유에 대한 간략한 설명
    - **서버 구조 및 디자인 패턴에 대한 개략적인 설명**
    - 완료된 시스템이 배포된 서버의 주소
    - 해당 과제를 진행하면서 회고 내용 블로그 포스팅
- Swagger나 Postman을 이용하여 API 테스트 가능하도록 구현
  
### 1. 배경 및 공통 요구사항

<aside>
😁 **카닥에서 실제로 사용하는 프레임워크를 토대로 타이어 API를 설계 및 구현합니다.**

</aside>

- 데이터베이스 환경은 별도로 제공하지 않습니다.
 **RDB중 원하는 방식을 선택**하면 되며, sqlite3 같은 별도의 설치없이 이용 가능한 in-memory DB도 좋으며, 가능하다면 Docker로 준비하셔도 됩니다.
- 단, 결과 제출 시 README.md 파일에 실행 방법을 완벽히 서술하여 DB를 포함하여 전체적인 서버를 구동하는데 문제없도록 해야합니다.
- 데이터베이스 관련처리는 raw query가 아닌 **ORM을 이용하여 구현**합니다.
- Response Codes API를 성공적으로 호출할 경우 200번 코드를 반환하고, 그 외의 경우에는 아래의 코드로 반환합니다.

| Response Code  | Description                     |
|-------|------------------------------------------|
|200 OK	|성공
|400 Bad Request	|Parameter가 잘못된 (범위, 값 등)|
|401 Unauthorized	|인증을 위한 Header가 잘못됨|
|500 Internal Server Error	|기타 서버 에러|

---

### 2. 사용자 생성 API

🎁 **요구사항**

- ID/Password로 사용자를 생성하는 API.
- 인증 토큰을 발급하고 이후의 API는 인증된 사용자만 호출할 수 있다.

```jsx
/* Request Body 예제 */

 { "id": "candycandy", "password": "ASdfdsf3232@" }
```

---

### 3. 사용자가 소유한 타이어 정보를 저장하는 API

🎁 **요구사항**

- 자동차 차종 ID(trimID)를 이용하여 사용자가 소유한 자동차 정보를 저장한다.
- 한 번에 최대 5명까지의 사용자에 대한 요청을 받을 수 있도록 해야한다. 즉 사용자 정보와 trimId 5쌍을 요청데이터로 하여금 API를 호출할 수 있다는 의미이다.

```jsx
/* Request Body 예제 */
[
  {
    "id": "candycandy",
    "trimId": 5000
  },
  {
    "id": "mylovewolkswagen",
    "trimId": 9000
  },
  {
    "id": "bmwwow",
    "trimId": 11000
  },
  {
    "id": "dreamcar",
    "trimId": 15000
  }
]
```

🔍 **상세구현 가이드**

- 자동차 정보 조회 API의 사용은 아래와 같이 5000, 9000부분에 trimId를 넘겨서 조회할 수 있다.
 **자동차 정보 조회 API 사용 예제**
  
📄 [https://dev.mycar.cardoc.co.kr/v1/trim/5000](https://dev.mycar.cardoc.co.kr/v1/trim/5000)
  
📄 [https://dev.mycar.cardoc.co.kr/v1/trim/9000](https://dev.mycar.cardoc.co.kr/v1/trim/9000)

📄 [https://dev.mycar.cardoc.co.kr/v1/trim/11000](https://dev.mycar.cardoc.co.kr/v1/trim/11000)

📄 [https://dev.mycar.cardoc.co.kr/v1/trim/15000](https://dev.mycar.cardoc.co.kr/v1/trim/15000)
  
  
- 조회된 정보에서 타이어 정보는 spec → driving → frontTire/rearTire 에서 찾을 수 있다.
- 타이어 정보는 205/75R18의 포맷이 정상이다. 205는 타이어 폭을 의미하고 75R은 편평비, 그리고 마지막 18은 휠사이즈로써 {폭}/{편평비}R{18}과 같은 구조이다.
 위와 같은 형식의 데이터일 경우만 DB에 항목별로 나누어 서로다른 Column에 저장하도록 한다.

  
### 4. 사용자가 소유한 타이어 정보 조회 API

🎁 **요구사항**

- 사용자 ID를 통해서 2번 API에서 저장한 타이어 정보를 조회할 수 있어야 한다.

</div>
</details>

## 사용 기술 및 tools
> - Back-End : <img src="https://img.shields.io/badge/Type Script-2762B9?style=for-the-badge&logo=typescript&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Nest_JS_8.1-d6003d?style=for-the-badge&logo=nestjs&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/PostgreSQL 14.0-0064a5?style=for-the-badge&logo=PostgreSQL&logoColor=white"/>
> - Deploy : <img src="https://img.shields.io/badge/AWS_EC2-232F3E?style=for-the-badge&logo=Amazon&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Docker-0052CC?style=for-the-badge&logo=Docker&logoColor=white"/>
> - ETC :  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white"/>&nbsp;

## 모델링
![image](https://user-images.githubusercontent.com/8219812/143773342-f3bb33c2-78a3-47bf-a828-774e5c8bbde9.png)


## API
- [Postman Doc](https://documenter.getpostman.com/view/16042359/UVJcjvyt)


## 서버구조 및 아키텍쳐

![image](https://user-images.githubusercontent.com/8219812/143772166-cf630868-3a19-4e0b-8af4-15392521f2c4.png)

### 모듈 구조
![image](https://user-images.githubusercontent.com/8219812/143772188-7daf32c5-8e8d-41a5-ad5b-aa6b11359322.png)

- 현재 구성으로는 user 모듈쪽에서 모든 endpoint를 처리합니다.
- 해당 id의 tire를 조회하는 기능도 user 중심이라고 생각하여, UserModule에 구현하였습니다.
- Car 모듈의 경우 TireRepository 만 있는 상태이며, Trie 단독 조회의 기능이 없었기 때문에 Car 모듈쪽에 서비스, 컨트롤러를 구현하지 않았습니다.
- 추후 기능기 추가되면 user모듈에서 인증부분만 빼서 새로운 모듈을 만들 수 있을것으로 생각됩니다.


## 구현 기능


### 사용자 생성 API
- id와 password를 입력받아서 유효성 체크 후, 회원가입을 합니다.
- 회원가입이 성공하면, AccessToken을 반환합니다.
- 인증 기능은 Passport를 사용하고, JwtStrategy를 구현하여 입력된 토큰이 올바른지와 복호화된 토큰의 정보가 존재하는 user인지 체크 합니다.


### 사용자가 소유한 타이어 정보를 저장하는 API
- API의 정보를 front rear trie 2종류의 정보가 존재하지만 동일한 타이어라고 가정하고 진행하였습니다. 즉 하나의 trim을 요청해도 frontTire rearTrie가 다르면 tires table에 2개의 row가 생기도록 하였습니다.
- 타이어 등록을 위해서 해야되는 작업중 외부 API를 요청하는 작업을 최대로 줄여야 겠다는 생각을 하였고, trimId 기준으로 어떠한 id가 존재하고, trimId 해당되는 타이어 정보를 data로 정하였습니다.
- ex : [{trimId : {id:[ids..], tires:[dto...]}}...]
```json
  [ 
    {
      "5000" : {
        "id":["cardoc", "cardoc2"],
        "tires":[
                 {"width": 260, "aspectRatio:60", "wheelSize":15}, 
                 {"width": 255, "aspectRatio:50", "wheelSize":16}
                ]
             }
     }
   ]
```
정리 후, Tire 및 UserTire에 값을 등록하였습니다.


### 사용자가 소유한 타이어 정보 조회 API
- TypeORM에서 제공해주는 Repository의 createQueryBuilder()를 사용해서 tires, user_tires 2개의 테이블을 조인하고, 조인한 결과에서 특정 id에 속한 data만 리턴하는 방식으로 로직을 작성하였습니다.
```ts
  this.tireRepository
      .createQueryBuilder('tire')
      .innerJoin('tire.userTires', 'userTire')
      .select(['tire.width', 'tire.aspectRatio', 'tire.wheelSize'])
      .where('userTire.user =:user', { user: user.pk })
      .getMany();
```

### 미흡한점
- 현재 외부 API호출 시, 없는 trim값을 입력해서 보내면 서버가 죽습니다.
- 이유는 현재 http 호출을 위해서 axios 모듈을 사용하는데, 이것에 대한 에러처리가 이루워지지 않았습니다.
- 왜냐면 호출되는 부분은 비동기 함수내에서 호출됩니다.
```ts
  private async getTireInfo(trimId: number): Promise<string[]> {
    const result = await axios.get(`${TRIM_API_URL}/${trimId}`, {
      timeout: 1000,
    });
```

- 그리고 이 함수는 reduce안에서 호출됩니다.
```ts
const organizedData = trimRegistrationDto.reduce((pre, cur) => {
      if (pre[cur.trimId]) {
        pre[cur.trimId].id.add(cur.id);
      } else {
        pre[cur.trimId] = {
          id: new Set([cur.id]),
          tires: this.getTireInfo(cur.trimId),
        };
      }
      return pre;
    }, {});
```
- 이런경우 어떻게 error처리를 하면 좋을지에 대해서 고민이 되여 아직 하지 못하였습니다.




## 배포정보
|구분   |  정보          |비고|
|-------|----------------|----|
|배포플랫폼 | AWS EC2    |    |
|API 주소 |http://18.188.189.173:8062/          |    |


## API TEST 방법

<details>
  <summary><b>API TEST 방법 자세히 보기</b></summary>
<div markdown="1">

1. 우측 링크를 클릭해서 Postman으로 들어갑니다. [링크](https://www.postman.com/wecode-21-1st-kaka0/workspace/assignment7-cardoc/collection/16042359-a366ebbd-8548-41b4-9793-986bd6d81a8a?ctx=documentation)

2. Postman 우측 상단에  ENVIRONMENT 설정 버튼를 클릭해서(눈 모양) `NEST_SERVER_URL` 설정이 올바른지 확인합니다. (http://18.188.189.173:8062) 올바르지 않으면 수정합니다.

![image](https://user-images.githubusercontent.com/8219812/143769822-5bc988b5-ccb0-410f-b680-77cab5d15f24.png)

3. 제공한 회원가입 API를 이용해서 `Cardoc-Nestjs` 탭에 있는 회원가입을 진행합니다. 회원가입이 성공하면 Access을 반환합니다.

  ![image](https://user-images.githubusercontent.com/8219812/143769854-3a25d3b2-5f8e-4923-93d6-031b74ffd473.png)

  
4. Access 토큰을 이미지를 참고해서 입력하고, 저장합니다.

![image](https://user-images.githubusercontent.com/8219812/143769885-878389d1-16df-4a75-835f-4b455d404400.png)
  
5. 이제 Access Token이 설정되었기 때문에, 다른 API를 호출할 수 있습니다.

6 만약 Send 버튼이 비활성화 이시면 fork를 이용해서 해당 postman project를 복사해서 시도하길 바랍니다.
  
  ![image](https://user-images.githubusercontent.com/8219812/143040169-cb3bbba5-7583-4937-b5b6-35489bcd5c7d.png)
  
</div>
</details>

## 설치 및 실행 방법
<details>
 <summary><b>설치 및 실행 방법 자세히 보기</b></summary>
<div markdown="1">
  
###  Local 개발 및 테스트용

1. 해당프로젝트를 clone 하고, 프로젝트 폴더로 들어간다.
    ```bash
    git clone https://github.com/Wanted-Preonboarding-Backend-1st-G5/Assignment7-TW-NESTJS
    cd Assignment7-TW-NESTJS
    ```
  
2. .env.example 파일을 복사해서 .env파일을 바꾸고 안의 내용을 변경한다.
    ```env
    #APP
    APP_PORT=3000

    #DATABASE
    #DB_HOST db 컨테이너 이름
    DB_HOST=cardoc-dev-db
    DB_TYPE=postgres
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_NAME=cardoc_dev
    DB_SYNCHRONIZE=true
    DB_PORT=5432

    #JWT
    JWT_KEY=secret
    JWT_EXPIRES_IN=7d
    ```
3. node.js를 설치합니다.
  
4. docker-compose를 실행해서 db를 구동 시킵니다.
  
    ```bash
    docker-compose -f docker-compose-dev.yml up -d
    ```
  
5. 아래 명령어로 node 패키지를 다운 받습니다.
  
   ```bash
   node install
   ```
6. 서버를 실행 시킵니다.
  
  ```bash
  node run start:dev
  ```
  
###  배포용 
1. 해당프로젝트를 clone 하고, 프로젝트 폴더로 들어간다.
  
    ```bash
    git clone https://github.com/Wanted-Preonboarding-Backend-1st-G5/Assignment7-TW-NESTJS
    cd Assignment7-TW-NESTJS
    ```
2. .env.example 파일을 복사해서 .env파일을 바꾸고 안의 내용을 변경한다.
    ```env
    #APP
    APP_PORT=3000

    #DATABASE
    #DB_HOST db 컨테이너 이름
    DB_HOST=cardoc-prod-db
    DB_TYPE=postgres
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_NAME=cardoc_prod
    DB_SYNCHRONIZE=false
    DB_PORT=5432

    #JWT
    JWT_KEY=secret
    JWT_EXPIRES_IN=7d
    ```
3. docker-compose명령어로 서버 및 db 컨테이너를 실행한다.
  
    ```bash
    docker-compose -f docker-compose-prod.yml up -d
    ```

</div>
</details>

## 폴더 구조
```bash
📦 ssignment7-TW-NESTJS
 ┣ 📂 src
 ┃ ┣ 📂 car
 ┃ ┃ ┣ 📂 dto
 ┃ ┃ ┃ ┗ 📜 tire-registration.dto.ts
 ┃ ┃ ┣ 📜 car.entity.ts
 ┃ ┃ ┣ 📜 car.module.ts
 ┃ ┃ ┗ 📜 car.repository.ts
 ┃ ┣ 📂 common
 ┃ ┃ ┣ 📂 classes
 ┃ ┃ ┃ ┗ 📜 advanced-repository.class.ts
 ┃ ┃ ┗ 📂 pips
 ┃ ┃ ┃ ┗ 📜 parse-array-max-min-len.pipe.ts
 ┃ ┣ 📂 database
 ┃ ┃ ┣ 📜 database.module.ts
 ┃ ┃ ┗ 📜 database.service.ts
 ┃ ┣ 📂 migrations
 ┃ ┃ ┣ 📜 1638078926052-UserTableCreate.ts
 ┃ ┃ ┣ 📜 1638078938422-TireTableCreate.ts
 ┃ ┃ ┗ 📜 1638078944324-UserTireTableCreate.ts
 ┃ ┣ 📂 user
 ┃ ┃ ┣ 📂 dto
 ┃ ┃ ┃ ┣ 📜 auth-credential.dto.ts
 ┃ ┃ ┃ ┗ 📜 trim-registration.dto.ts
 ┃ ┃ ┣ 📜 jwt.strategy.ts
 ┃ ┃ ┣ 📜 user.controller.ts
 ┃ ┃ ┣ 📜 user.entity.ts
 ┃ ┃ ┣ 📜 user.module.ts
 ┃ ┃ ┣ 📜 user.repository.ts
 ┃ ┃ ┣ 📜 user.service.spec.ts
 ┃ ┃ ┗ 📜 user.service.ts
 ┃ ┣ 📜 app.module.ts
 ┃ ┣ 📜 app.service.ts
 ┃ ┗ 📜 main.ts
 ┣ 📂 test
 ┃ ┣ 📜 app.e2e-spec.ts
 ┃ ┗ 📜 jest-e2e.json
 ┣ 📜 .dockerignore
 ┣ 📜 .env
 ┣ 📜 .env.example
 ┣ 📜 .eslintrc.js
 ┣ 📜 .gitignore
 ┣ 📜 .prettierrc
 ┣ 📜 Dockerfile.prod
 ┣ 📜 README.md
 ┣ 📜 docker-compose-dev.yml
 ┣ 📜 docker-compose-prod.yml
 ┣ 📜 nest-cli.json
 ┣ 📜 ormconfig.ts
 ┣ 📜 package-lock.json
 ┣ 📜 package.json
 ┣ 📜 pull_request_template.md
 ┣ 📜 tsconfig.build.json
 ┣ 📜 tsconfig.json
 ┗ 📜 tsconfig.paths.json
```

# Reference
- 이 프로젝트는 원티드x위코드 백엔드 프리온보딩 과제 일환으로 에서 출제한 과제를 기반으로 만들었습니다.
- 본 과제는 저작권의 보호를 받으며, 문제에 대한 정보를 배포하는 등의 행위를 금지 합니다.
