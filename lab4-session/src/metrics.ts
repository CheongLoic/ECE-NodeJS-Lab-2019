import { LevelDB } from './leveldb'
import WriteStream from 'level-ws'

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

  public getAll(key: string, callback: (error: Error | null, result: Metric[] | null) => void) {
    // Read
    let metrics: Metric[] = [];
    this.db.createReadStream()
      .on('data', function (data) {
        console.log(key)
        let id: string = data.key.split(':')[1]
        if( id == key )
        {
          let timestamp: string = data.key.split(':')[2]
          console.log('data.key.split2 : '+data.key.split(':')[2])
          let oneMetric: Metric = new Metric(timestamp, data.value)
          metrics.push(oneMetric)
        }
        
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
        callback(null, metrics)
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
  
}
