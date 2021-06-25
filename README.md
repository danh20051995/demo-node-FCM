# node-FCM-demo

## Prerequisites

### Create firebase app

- [Create your ownr firebase application](https://firebase.google.com/)

### Firebase SDK config

- Get [firebase SDK config](https://firebase.google.com/docs/web/setup#config-object) for javascript, convert to JSON format and save as `firebase-config.json` in folder [credentials](https://github.com/danh20051995/node-FCM-demo/tree/master/credentials)

### Service account

- Create a [service account](https://firebase.google.com/docs/admin/setup#initialize-sdk) and generate key, save as `service-account.json` in folder [credentials](https://github.com/danh20051995/node-FCM-demo/tree/master/credentials)

### Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

### Config FCM server key in `.env`

To [using the FCM legacy HTTP API](https://firebase.google.com/docs/cloud-messaging/send-message#send_using_the_fcm_legacy_http_api) your must replace `FCM_SERVER_KEY` in `.env` with your firebase server key

```bash
FCM_SERVER_KEY=[your-FCM-server-key]
```

## Execute below command

### Install node_modules

```bash
npm install
```

### Start node http server

```bash
npm run start
```

Open showed URL in CLI and get what you want.
