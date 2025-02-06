## start app

```bash
# unit tests
$ npm install
$ npm start
# ----->> OR << ----->
$ npm run start:first
```

## You might get and error because i faced it, some of moongoos dependancey and @nestjs/serve-static dependancy i have not investigated it
## I simply added --legacy-peer-deps  flage to install these 2 packages.
## I have added custome script if you run npm run start:first it will first install packages and then start the app
## I have added sample.env with default values set values according to your system.
## To make it easier for you to test all endpoints i added a simple react build to test all routes from browser

