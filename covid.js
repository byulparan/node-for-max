const max = require('max-api');
const request = require('request');
const cheerio = require('cheerio');
let service_key = ''; // insert your service_key(Decoding) from data.go.kr

function today(day) {
  let today = new Date();
  let year = String(today.getFullYear());
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let date = String(today.getDate() - day);
  return year + month + date;
}

let toggle = false;


max.addHandler('monitor', (v) => {
  toggle = v == 1 ? true : false;
});


function get_covid_data(day) {
  let options = {
    uri: 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson',
    qs:{
      pageNo: '1',
      numOfRows: '10',
      startCreateDt: today(day),
      endCreateDt: today(day),
      serviceKey: service_key
    }
  };
  request(options, (error, resp,body) => {
    if(!error && resp.statusCode == 200) {
      if (toggle) {
	max.post(body);
      }
      let $ = cheerio.load(body);
      max.outlet([
	$('createDt')[18].children[0].data,
	//$('gubun')[18].children[0].data, // 지역
	Number($('incDec')[18].children[0].data), // 전일대비 증감수
	Number($('isolclearCnt')[18].children[0].data), // 격리해제
	Number($('isolIngCnt')[18].children[0].data), // 격리중
	Number($('deathCnt')[18].children[0].data), // 사망자 수
      ]); 
    }
  });
}



max.addHandler('bang', () => {
  get_covid_data(0);
});

max.addHandler('number', (n) => {
  get_covid_data(n);
});




