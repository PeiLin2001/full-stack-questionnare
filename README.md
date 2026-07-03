# DynamiQ – Dynamic Survey Frontend

This is my first fullstack project, built during a vocational training program.

DynamiQ is a fullstack survey (questionnaire) project, built with Angular and Spring boot. This project could be split into a user-facing side and an admin side. After logging in, users can browse a list of surveys, filter them by keyword/date, and fill out any survey that is currently open. Admins can log in to a separate console to manage surveys. Survey questions are provided by a backend API, and the frontend renders the appropriate input type based on each question's type.

The frontend is written in Angular, the backend in Java Spring Boot, and the full UI/UX and visual design system was designed in Figma.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Pages & Features](#pages--features)
- [Routing](#routing)
- [API Services](#api-services)
- [API Endpoints](#api-endpoints)
- [Login State](#login-state)
- [Survey Answer Data Handling](#survey-answer-data-handling)
- [Global Styles](#global-styles)
- [Related Projects](#related-projects)
- [TODO](#todo)

## Tech Stack

- Frontend: Angular (Standalone Components)
- Routing: Angular Router (with route guards via `CanActivateFn`)
- HTTP: Angular HttpClient
- Form binding: FormsModule / ngModel
- Icons & fonts: Google Fonts, Material Symbols / Material Icons
- Backend API currently points to: `http://localhost:8080`

## Getting Started

```bash
# install dependencies
npm install

# start the dev server
ng serve
```

Once running, open `http://localhost:4200`.

> Note: all API calls currently point to `http://localhost:8080`. You'll need to run the backend (Spring Boot) separately for login, data fetching, and survey submission to work.

## Pages & Features

### Home
Displays the DynamiQ welcome text and a Start button. Clicking Start routes the user based on login state:
- Logged in: goes to the survey list page
- Not logged in: goes to the "start reminder" page

The home page also has a hidden keyboard-triggered shortcut that navigates to the admin login page (for internal testing only).

### Navbar
Shows different content depending on login state:
- Logged in: shows a welcome message with the user's name
- Not logged in: shows "Log in" and "Register" buttons

Login state is determined by whether `userToken` exists in `sessionStorage`.

### Start Reminder
Reminds a not-logged-in user that they need to log in before answering any survey, with "Sign in" and "Create account" call-to-action buttons.

### Register
Collects name, age (dropdown, 1–130), email (used as the account), and password. On submit, calls the register API — on success, navigates to the survey list page; on failure, shows an error message based on the HTTP status code (connection failure / 404 / 500 / other).

### Sign In
Regular user login page. On submit with email and password:
- On success, stores the token in `sessionStorage`, then calls the "get user info" API to also store the user's name and email in `sessionStorage`
- If fetching user info fails, falls back to using the local part of the email as the display name
- After 3 failed attempts, the login button is disabled and an error-count message is shown

### Admin Login
A login page reserved for administrators, with a clear authorization warning banner. Logic is similar to the regular login page (credential check, error-count lockout); on success, navigates to the admin console.

### Quiz List (User-facing)
Fetches the list of public surveys from the backend and displays them. Current features:
- Keyword search by survey title
- Filter by date range
- Quick filters for "last 7 days" / "last 30 days"
- Reset filters
- Splits surveys into "Recent" and "Past" sections based on start date
- Checks whether a survey is currently open (`isAvaliable`) — only open surveys are clickable
- Shows a "No results" empty state when nothing matches the filters

### Quiz Page (Answer a Survey)
Based on the survey id in the URL, fetches from the backend:
- Basic survey info (title, description)
- The list of questions

Each question renders a different input based on its type:

| Question Type | Rendered As |
| --- | --- |
| Single choice | radio button |
| Multiple choice | checkbox |
| Other | text input |

On submit, answers are assembled into this shape and sent to the backend:

```ts
{
  quizId: number,
  email: string,
  answersVoList: [
    {
      questionId: number,
      answerList: string[]
    }
  ]
}
```

If the survey is not currently open, or is invalid, the user sees an alert and is redirected back to the survey list.

### Admin Console
Once logged in, admins can see all surveys (including unpublished drafts), with:
- Keyword search, date range filter, and reset (same logic as the user-facing list)
- "Recent" / "Past" grouping by start date
- Publish status badge per survey (Published / Draft)
- Click the title to go to the edit page
- Icons to view statistics or delete a survey (delete asks for confirmation first)
- A "Create New Survey" button

## Routing

| Path | Page | Notes |
| --- | --- | --- |
| `/` | Home | |
| `/home` | Home | |
| `/start-reminder` | Start Reminder | |
| `/register` | Register | |
| `/sign-in` | Sign In | |
| `/quizlist` | Quiz List | Route guard |
| `/quiz-page/:id` | Quiz Page | Route guard |
| `/admin/login` | Admin Login | |
| `/adminconsole` | Admin Console | |
| `/admin/create` | Create Survey | |
| `/admin/edit/:id` | Edit Survey | |

`/quizlist` and `/quiz-page/:id` are protected by the `quizStatusGuard` route guard — if the user isn't logged in, they're prompted to log in and redirected back to the home page.

## API Services

| Service | Description |
| --- | --- |
| `UserHttp` | Login, register, check login state, get user info, read the user's name / email from sessionStorage |
| `QuizHttp` | Get (public) survey list, get question list by id, get survey info by id |
| `FillinHttp` | Submit survey answers |
| `AdminQuizHttp` | Get (admin) survey list, get question list, get survey info, create, update, and delete a survey |
| `AdminFillinHttp` | Submit answers, get feedback data, get statistics data |

This README only documents the API calls currently wrapped in these services; it doesn't cover admin page behaviors beyond what's shown here.

## API Endpoints

### User API
| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/user/login` | User login |
| POST | `/user/register` | User registration |
| GET | `/user/getInfo` | Get user info |

### Quiz API
| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/quiz/get_quiz_list` | Get survey list |
| GET | `/quiz/get_question_list` | Get question list |
| GET | `/quiz/get_quiz_information` | Get survey info |
| POST | `/quiz/fillin` | Submit survey answers |
| POST | `/quiz/create` | Create a survey |
| POST | `/quiz/update` | Update a survey |
| GET | `/quiz/delete` | Delete a survey |
| POST | `/quiz/feedback` | Get feedback data |
| POST | `/quiz/statistics` | Get statistics data |

## Login State

The frontend stores login-related data in `sessionStorage`, and determines login state by whether `userToken` exists. Keys currently used:

- `userToken`
- `userName`
- `userEmail`

## Survey Answer Data Handling

After fetching questions, the frontend adds a `userAnswer` field to each question:

- Single choice: stored in `userAnswer[0]`
- Multiple choice: stored as an array in `userAnswer`
- Text answer: stored in `userAnswer[0]`

On submit, this is converted into the `answersVoList` format expected by the backend.

## Global Styles

Current global styles include:

- Zeroed-out page margins
- Site-wide background color `#FFFEEC`
- Site-wide font settings
- `html, body` height set to 100%

## Related Projects

Backend repo: [link TBD]

## TODO

- [ ] Survey results / statistics page
- [ ] Admin-side "create survey" functionality

# DynamiQ 動態問卷前端專案

這是我在職訓期間完成的第一份 fullstack 專案。

DynamiQ 是一個以 Angular 與 Spring boot 建立的問卷全端專案，分為使用者端和管理者端。使用者登入後可以查看問卷列表、依條件篩選問卷、進入開放期間內的問卷並進行填答；管理者則可以登入後台管理問卷。問卷題目由後端 API 提供，前端會依照題型顯示對應的輸入介面。

前端使用 Angular 撰寫，後端使用 Java Spring Boot，並以 Figma 進行完整的 UI/UX 與視覺設計系統。

## 目錄

- [技術架構](#技術架構)
- [快速開始](#快速開始)
- [頁面與功能](#頁面與功能)
- [路由設定](#路由設定)
- [API Service 封裝](#api-service-封裝)
- [API 路徑整理](#api-路徑整理)
- [登入狀態說明](#登入狀態說明)
- [問卷填答資料處理](#問卷填答資料處理)
- [樣式設定](#樣式設定)
- [相關專案](#相關專案)
- [TODO](#todo)

## 技術架構

- Frontend：Angular（Standalone Component）
- Routing：Angular Router（含路由守衛 CanActivateFn）
- HTTP：Angular HttpClient
- 表單綁定：FormsModule / ngModel
- 圖示與字體：Google Fonts、Material Symbols / Material Icons
- 後端 API 目前指向：`http://localhost:8080`

## 快速開始

```bash
# 安裝套件
npm install

# 啟動開發伺服器
ng serve
```

啟動後開啟 `http://localhost:4200`。

> 注意：前端目前所有 API 都指向 `http://localhost:8080`，需要另外啟動後端服務（Spring Boot）才能正常取得資料、登入及填答。

## 頁面與功能

### 首頁（Home）
顯示 DynamiQ 的歡迎文字與 Start 按鈕。按下 Start 後，系統會依登入狀態決定導向：
- 已登入：進入問卷列表頁
- 未登入：進入開始提醒頁

首頁也包含一組鍵盤輸入觸發的隱藏導向邏輯，用於快速進入管理員登入頁（僅供內部測試使用）。

### 導覽列（Navbar）
依使用者登入狀態顯示不同內容：
- 已登入：顯示歡迎文字與使用者名稱
- 未登入：顯示登入（Log in）與註冊（Register）按鈕

登入狀態透過 `sessionStorage` 中是否存在 `userToken` 判斷。

### 開始提醒頁（Start Reminder）
提示尚未登入的使用者需要先登入才能填寫問卷，提供「Sign in」與「Create account」兩個導引按鈕。

### 註冊頁（Register）
提供姓名、年齡（下拉選單 1–130 歲）、email（作為帳號）、密碼欄位。送出後呼叫註冊 API，成功則導向問卷列表頁；失敗則依 HTTP 狀態碼顯示對應錯誤訊息（連線失敗 / 404 / 500 / 其他）。

### 登入頁（Sign In）
一般使用者登入頁，輸入 email、密碼後呼叫登入 API：
- 登入成功後將 token 寫入 `sessionStorage`，並接著呼叫取得使用者資訊 API，將使用者名稱、email 一併存入 `sessionStorage`
- 若取得使用者資訊失敗，則以 email 前綴作為顯示名稱備援
- 帳號或密碼錯誤達 3 次後鎖定登入按鈕，並顯示錯誤次數提示

### 管理員登入頁（Admin Login）
僅供管理者使用的登入介面，畫面上有明確的授權警示文字。邏輯與一般登入頁類似（帳密驗證、錯誤次數限制），驗證通過後導向管理後台。

### 問卷列表頁（Quizlist）
向後端取得前台問卷清單並顯示，目前包含：
- 關鍵字搜尋問卷標題
- 依日期區間篩選問卷
- 快速設定「最近 7 天 / 最近 30 天」篩選
- 清除篩選條件
- 依開始日期將問卷分為 Recent 與 Past 顯示
- 判斷問卷是否在可填答期間內（`isAvaliable`），僅開放期間內的問卷可以點擊進入填答頁
- 無符合結果時顯示 No results 提示畫面

### 問卷填答頁（Quiz Page）
依網址中的問卷 id 向後端取得：
- 問卷基本資訊（標題、說明）
- 問卷題目清單

題目依後端回傳的題型產生對應輸入介面：

| 題型 | 前端顯示方式 |
| --- | --- |
| 單選 | radio button |
| 多選 | checkbox |
| 其他 | text input |

送出時整理成以下格式送到後端：

```ts
{
  quizId: number,
  email: string,
  answersVoList: [
    {
      questionId: number,
      answerList: string[]
    }
  ]
}
```

若問卷不在開放填答期間內或不是有效問卷，會提示訊息並導回問卷列表頁。

### 管理後台頁（Admin Console）
管理者登入後可檢視所有問卷（含未發布 Draft），功能包含：
- 關鍵字搜尋、日期區間篩選、重置篩選（邏輯與使用者端問卷列表相同）
- 依開始日期分為 Recent / Past 顯示
- 顯示每筆問卷的發布狀態（Published / Draft）
- 點擊標題可進入編輯頁
- 點擊圖示可查看統計資料，或刪除問卷（刪除前會跳出確認視窗）
- 提供「Create New Survey」按鈕建立新問卷

## 路由設定

| 路徑 | 對應頁面 | 備註 |
| --- | --- | --- |
| `/` | 首頁 | |
| `/home` | 首頁 | |
| `/start-reminder` | 開始提醒頁 | |
| `/register` | 註冊頁 | |
| `/sign-in` | 登入頁 | |
| `/quizlist` | 問卷列表頁 | 有路由守衛 |
| `/quiz-page/:id` | 問卷填答頁 | 有路由守衛 |
| `/admin/login` | 管理員登入頁 | |
| `/adminconsole` | 管理後台頁 | |
| `/admin/create` | 建立問卷頁 | |
| `/admin/edit/:id` | 編輯問卷頁 | |

`/quizlist` 與 `/quiz-page/:id` 使用 `quizStatusGuard` 路由守衛，未登入時會提示使用者登入並導回首頁。

## API Service 封裝

| Service | 說明 |
| --- | --- |
| `UserHttp` | 登入、註冊、檢查登入狀態、取得使用者資訊、從 sessionStorage 取得使用者名稱／email |
| `QuizHttp` | 取得（前台）問卷列表、依 id 取得題目列表、依 id 取得問卷資訊 |
| `FillinHttp` | 送出問卷填答資料 |
| `AdminQuizHttp` | 取得（後台）問卷列表、取得題目列表、取得問卷資訊、建立、更新、刪除問卷 |
| `AdminFillinHttp` | 送出填答資料、取得回饋資料、取得統計資料 |

本 README 僅說明目前 service 中出現的 API 呼叫封裝，不額外描述本次檔案中未呈現的操作細節。

## API 路徑整理

### User API
| 方法 | 路徑 | 用途 |
| --- | --- | --- |
| GET | `/user/login` | 使用者登入 |
| POST | `/user/register` | 使用者註冊 |
| GET | `/user/getInfo` | 取得使用者資訊 |

### Quiz API
| 方法 | 路徑 | 用途 |
| --- | --- | --- |
| GET | `/quiz/get_quiz_list` | 取得問卷列表 |
| GET | `/quiz/get_question_list` | 取得題目列表 |
| GET | `/quiz/get_quiz_information` | 取得問卷資訊 |
| POST | `/quiz/fillin` | 送出問卷填答 |
| POST | `/quiz/create` | 建立問卷 |
| POST | `/quiz/update` | 更新問卷 |
| GET | `/quiz/delete` | 刪除問卷 |
| POST | `/quiz/feedback` | 取得回饋資料 |
| POST | `/quiz/statistics` | 取得統計資料 |

## 登入狀態說明

前端使用 `sessionStorage` 儲存登入相關資料，並透過 `userToken` 是否存在判斷登入狀態。目前使用到的 key 包含：

- `userToken`
- `userName`
- `userEmail`

## 問卷填答資料處理

前端取得題目後，會替每一題加入 `userAnswer` 欄位：

- 單選題：使用 `userAnswer[0]` 保存答案
- 多選題：使用 `userAnswer` 陣列保存多個答案
- 文字題：使用 `userAnswer[0]` 保存輸入內容

送出時會轉換成後端需要的 `answersVoList` 格式。

## 樣式設定

目前全域樣式包含：

- 頁面邊距歸零
- 全站背景色設定為 `#FFFEEC`
- 設定全站字體
- 設定 `html, body` 高度為 100%

## 相關專案

本專案後端 Repo：[待補上連結]

## TODO

- [ ] 問卷結果統計頁面
- [ ] 管理者端新增問卷的功能
