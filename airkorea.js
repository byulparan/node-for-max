const max = require('max-api');
const request = require('request');
const cheerio = require('cheerio');
let service_key = ''; // insert your service_key(Decoding) from data.go.kr


let toggle = false;


max.addHandler('monitor', (v) => {
  toggle = v == 1 ? true : false;
});



max.addHandler('air', (station) => {
  let options = {
    uri: 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty',
    qs:{
      stationName: station,
      dataTerm: 'month',
      pageNo: '1',
      numOfRows: '1',
      serviceKey: service_key
    }
  };
  request(options, (error, resp,body) => {
    if (toggle) {
      max.post(resp.statusCode);
    }

    if(!error && resp.statusCode == 200) {
      if (toggle) {
	max.post(body);
      }
      let $ = cheerio.load(body);
      max.outlet([$('dataTime').text(),
		  Number($('so2Value').text()),
		  Number($('khaiValue').text()),
		  Number($('pm10Value').text()),
		  Number($('coValue').text())]);
    }
  });
});



