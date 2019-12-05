import {LevelDB} from './leveldb'
//import WriteStream from 'level-ws'
//import WriteStream as request from 'level-ws';
//import * as request from 'level-ws'
import * as WriteStream from 'level-ws';
const WS = (WriteStream as any)();

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {

  private db: any

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }


  public getAll(key: string, callback: (error: Error | null, result: Metric[] | null) => void){
    let metric: Metric[] = [];
     this.db.createReadStream()
  .on('data', function (data) {
    console.log(key)
    let id: string = data.key.split(':')[1]
    if( id == key )
        {
          let timestamp: string = data.key.split(':')[2]
        let oneMetric: Metric = new Metric(timestamp, data.value)
        metric.push(oneMetric)
        }

  })
  .on('error', function (err) {
    console.log('Oh my!', err)
    callback(err,null)
  })
  .on('close', function () {
    console.log('Stream closed')
    callback(null,metric)
  })
  .on('end', function () {
    console.log('Stream ended')
  })
  }

  public delete(key: string, callback: (error: Error | null, result: Metric[] | null) => void){
    let metric: Metric[] = [];
     this.db.createReadStream()
  .on('data', function (data) {
    console.log(key)
    let id: string = data.key.split(':')[1]
    if( id == key )
        {
          //let timestamp: string = data.key.split(':')[2]
        //let oneMetric: Metric = new Metric(timestamp, data.value)
        metric.pop()
        }

  })
  .on('error', function (err) {
    console.log('Oh my!', err)
    callback(err,null)
  })
  .on('close', function () {
    console.log('Stream closed')
    callback(null,metric)
  })
  .on('end', function () {
    console.log('Stream ended')
  })
  }


  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
      const stream = WriteStream(this.db)
      stream.on('error', callback)
      stream.on('close', callback)
      metrics.forEach((m: Metric) => {
        stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
      })
      console.log(metrics);
      stream.end()
    }

}
