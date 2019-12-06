# ECE NodeJS Lab 3 2019-2020

## Authors
- CHEONG Loïc : huangloic@hotmail.com
- GUPTA Chirag : chiraggupta199806@gmail.com

ECE's students in the group ING 4 SI 03 Inter 

## About this work
In this lab, we use levelDB

Tasks :
- [x] Add a `get` function to `metrics` module
- [x] Add a route to get a metric (one of the metric, all the metrics)
- [x] Add a `delete` function to `metrics` module
- [ ] Add a route to delete a metric based on its key

Only id=loic has metrics
Go to http://localhost:8082/metrics/loic to show all his metrics
The route http://localhost:8082/metricsToDelete/loic doesn't work

## Run instructions
After you cloned the repository , execute those commands :
``` 
cd lab3-levelDB
npm install 
npm start
```
Then open a browser with the link below http://localhost:8082/


## Build

```bash
npm run build
```

## Development

```bash
npm run dev server.ts
```
