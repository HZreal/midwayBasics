import { Config, Provide } from "@midwayjs/decorator";
import { ClickHouse } from "clickhouse";
import * as aplaClickHouse from '@apla/clickhouse';
import * as _ from 'lodash';
import * as moment from 'moment';


@Provide()
export class CommonClickhouseService {
    @Config('clickhouseConfig')
    clickhouseConfig;

    // cli: ClickHouse;

    // @Init()
    // async init() {
    //   await new Promise((resolve) => {
    //     this.cli = new ClickHouse({
    //       url: 'http://192.168.19.128',
    //       port: 8123,
    //       basicAuth: {
    //         username: 'default',
    //         password: 'root123456',
    //       },
    //       config: {
    //         // session_id                              : 'session_id if neeed',
    //         session_timeout                         : 60,
    //         output_format_json_quote_64bit_integers : 0,
    //         enable_http_compression                 : 0,
    //         database                                : 'test',
    //       },
    //     });
    //     // resolve();
    //   });
    // }

    connectClickhouse () {
      const clickhouse = new ClickHouse({
        url: 'http://192.168.19.128',
        port: 8123,
        basicAuth: {
          username: 'default',
          password: 'root123456',
        },
        config: {
          // session_id                              : 'session_id if neeed',
          session_timeout                         : 60,
          output_format_json_quote_64bit_integers : 0,
          enable_http_compression                 : 0,
          database                                : 'test',
        },
      });

      return clickhouse
    }

    async selectLargeDataset() {
      const clickhouseClient = new aplaClickHouse(this.clickhouseConfig);
      const stream = await clickhouseClient.query("SELECT * FROM test.dish LIMIT 10")

      const rows = []

      stream.on('metadata', (columns) => {
        console.log("表的列-------", columns)
      }).on('data',  (row) => {
        rows.push(row)
        console.log('row--------', row);
      }).on('error', (err) => {
        console.log("err ----", err)
      }).on('end', () => {
        console.log(
          rows.length,
          stream.supplemental.rows,
          stream.supplemental.rows_before_limit_at_least, // how many rows in result are set without windowing
      )})

      return rows

    }

    async oper2() {
      const clickhouseClient = new aplaClickHouse(this.clickhouseConfig);
      clickhouseClient.query('select * from test.dish limit 10;', {format: 'JSONEachRow'}, (err, data) => {
        if(err) {
          console.log(" err --------------", err)
        }
        console.log(" data -------------", data)

      })
    }

    async insertOne() {
      const ch = new aplaClickHouse(this.clickhouseConfig)
      const writableStream = ch.query(`INSERT INTO test.tb_article`, (err) => {
        if (err) {
          console.error('err ---', err)
        }
        console.log('Insert complete!')
      })

      // data will be formatted for you
      writableStream.write([1, 'name', 'desc', 4, new Date(), 2.22, "erbgwerg", ])

      // prepare data yourself
      writableStream.write("1\t2.22\terbgwerg\t2017-07-17 17:17:17")

      writableStream.end()

    }

    async add(objects: any[]) {
        if (!_.isEmpty(objects)) {
            const ch = new aplaClickHouse(this.clickhouseConfig);
            const stream = ch.query('INSERT INTO tourist_card.card_raw', {
                format: 'JSONEachRow',
            });

            for (const item of objects) {
                stream.write(item); // 写入单行数据
            }
            stream.end();
            console.log(
                moment().format('YYYY-MM-DD HH:mm:ss') +
                    ' add to clickhouse. objects count: ' +
                    objects.length
            );
        }
    }

    // await获取
    async getArticleList() {
      const cli = this.connectClickhouse()

      const sql = 'select * from tb_article limit {limit: UInt16}'
      const rows = await cli.query(sql, {params: {limit: 10}}).toPromise();
      return rows

    }

    // 流传递，并await获取
   async getArticleList2() {
    const client = this.connectClickhouse()

    const sql = 'select * from tb_article'
    let rows = []
    for await (const row of client.query(sql).stream()) {
      console.log('row ------>   ', row);
      rows.push(row)
    }

    return rows
   }

   async insertWithStream() {
    const client = this.connectClickhouse()

    console.log('enter insertWithStream ----------------');


    const writeStream = client.insert('INSERT INTO tb_article("name", "description", "size")').stream();
    for(let i = 7; i <= 100; i++) {
      await writeStream.writeRow(
        [`nodejs ${i}`, `learn node ${i}`, i+1]
      );
    }

    //wait stream finish
    const result = await writeStream.exec();
    return result
   }

  //  async insertWithReadWritePipeStream() {
  //   const client = this.connectClickhouse()

  //   const sql = 'select * from tb_article'
  //   const readStream = client.query(sql).stream();

  //   const tf = new stream.Transform({
  //     objectMode : true,
  //     transform  : function (chunk, enc, cb) {
  //       cb(null, JSON.stringify(chunk) + '\n');
  //     }
  //   });

  //   const writeStream = client.insert('INSERT INTO tb_article("name", "description", "size")').stream();

  //   const result = await readStream.pipe(tf).pipe(writeStream).exec();
  //   return result

  // }

}
