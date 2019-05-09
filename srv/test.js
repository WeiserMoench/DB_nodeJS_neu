const parse = require('csv-parse')
const assert = require('assert')

/*const output = []
parse(`
  "1","2","3"
  "a","b","c"
`, {
    trim: true,
    skip_empty_lines: true
})
// Use the readable stream api
    .on('readable', function(){
        let record
        while (record = this.read()) {
            output.push(record)
        }
    })
    // When we are done, test that the parsed output matched what expected
    .on('end', function(){
        assert.deepEqual(
            output,
            [
                [ '1','2','3' ],
                [ 'a','b','c' ]
            ]
        )
    })
*/

/*const output = []
parse(`
  "1","2","3"
  "a","b","c"
`, {
    trim: true,
    skip_empty_lines: true
})
// Use the readable stream api
    .on('readable', function(){
        let record
        while (record = this.read()) {
            output.push(record)
        }
    })
    // When we are done, test that the parsed output matched what expected
    .on('end', function(){
        console.log(output)
    })
*/

var request = require('request');
request.get('https://wiki.htw-berlin.de/confluence/download/attachments/31623434/test.txt', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var csv = body;
        const output = []
        parse(
            csv
        , {
                trim: true,
                    skip_empty_lines: true,
                columns: true,
            })
        // Use the readable stream api
        .on('readable', function(){
                let record
                while (record = this.read()) {
                    output.push(record)
                }
            })
            // When we are done, test that the parsed output matched what expected
                .on('end', function(){
                    console.log(output)
                })
        }
});



