const max = require('max-api');
const cheerio = require('cheerio');
const request = require('request');


max.addHandler("bang", () => {
  const options = {
    uri: "http://www.naver.com",
  };
  request(options, (error, resp,body) => {
    if(!error && resp.statusCode == 200) {
      let $ = cheerio.load(body);
      let arr = $('.issue');
      for(let i = 0; i < arr.length; i++) {
	max.outlet([i, arr[i].children[0].data]);
      }
    }
  });
});

max.addHandler("version", () => {
  max.post(process.version);
});



