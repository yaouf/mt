# API Request Formats

All of these require X-API-KEY in header with proper API key, else you will receive 401 Unauthorized. 

## CreateDevice

Endpoint: /createDevice

Type: POST

Dev Endpoint: [https://createdevice-67ajya3bqq-uc.a.run.app](https://createdevice-67ajya3bqq-uc.a.run.app)

Prod Endpoint: https://createdevice-sjblykwjfa-uc.a.run.app

Body Parameters: 

---

```jsx
{
    "deviceType": "iOS",
    "Breaking News": true,
    "Weekly Summary": false,
    "Daily Summary": false,
    "expoPushToken": "ExpoPushToken[5012]", 
    "isPushEnabled": false
}
```

## ViewSettings

Endpoint: /viewSettings

Type: POST

Dev Endpoint: [https://viewsettings-h4fuv4ya3q-uc.a.run.app](https://viewsettings-h4fuv4ya3q-uc.a.run.app/)

Prod Endpoint: https://viewsettings-sjblykwjfa-uc.a.run.app

Body Parameters: 

---

```jsx
{
    "deviceId": "e8dedc94-a849-4b2e-ab53-f74515cc44d3"
}
```

## UpdateSettings

Endpint: /updateSettings

Type: POST

Dev Endpoint: [https://updatesettings-67ajya3bqq-uc.a.run.app](https://updatesettings-67ajya3bqq-uc.a.run.app)

Prod Endpoint: https://updatesettings-sjblykwjfa-uc.a.run.app

Body Parameters (Each one is required, in future will be optional):

When designing APIs think about future features and backwards compatibiility, here it is better to make them optional because we may add future sections. 

```jsx
{
"Breaking News": true,
"University News": true,
"Metro": false,
"isPushEnabled": false
}
```

---

## UpdateNotificationStatus

Endpoint: /updateNotificationStatus

Type: POST

Dev Endpoint: [https://updatenotificationstatus-h4fuv4ya3q-uc.a.run.app/](https://updatenotificationstatus-h4fuv4ya3q-uc.a.run.app/)

Prod Endpoint: https://updatenotificationstatus-sjblykwjfa-uc.a.run.app

Body Parameters: 

```jsx
{
    "deviceId": "2d5e1aeb-5106-49ef-96cb-e5cc68f22444",
    "isPushEnabled": true
}
```

## ViewEditorsPicks

Endpoint Suffix: /viewEditorsPicks

Type: GET

Dev Endpoint: [https://vieweditorspicks-67ajya3bqq-uc.a.run.app](https://vieweditorspicks-67ajya3bqq-uc.a.run.app/)

Prod Endpoint: [https://vieweditorspicks-sjblykwjfa-uc.a.run.app](https://vieweditorspicks-sjblykwjfa-uc.a.run.app/)

Body Parameters: None

 Return Format:

```jsx
[
    {
        "url": "https://www.browndailyherald.com/article/2024/10/how-acurms-revised-charge-means-brown-may-never-divest-again"
    },
    {
        "url": "https://www.browndailyherald.com/article/2024/10/a-mini-moon-joins-earths-orbit-brown-astronomers-explain"
    },
    {
        "url": "https://www.browndailyherald.com/article/2024/10/divestment-voted-down-by-brown-university-corporation"
    },
    {
        "url": "https://www.browndailyherald.com/section/science-research"
    }
]
```