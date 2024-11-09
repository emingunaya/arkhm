const axios = require('axios');
const fs = require('fs');
const path = require('path');

let requestCount = 1; // Dosya adını artırmak için sayaç

// Klasörün var olup olmadığını kontrol et, yoksa oluştur
const folderPath = path.join(__dirname, 'transfers');
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

const fetchData = async () => {
  try {
    const response = await axios.get('https://api.arkm.com/transfers', {
      params: {
        base: 'cowswap',
        flow: 'all',
        usdGte: 0.1,
        sortKey: 'time',
        sortDir: 'desc',
        limit: 16,
        offset: 0
      },
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.7',
        'Cookie': 'arkham_is_authed=true; arkham_platform_session=4f60ca7c-aaec-4b01-9aa9-54c49779e801; mp_f32068aad7a42457f4470f3e023dd36f_mixpanel=%7B%22distinct_id%22%3A%20%221930c293822cbf-0fec1f8f684e16-26011951-323200-1930c293823186a%22%2C%22%24device_id%22%3A%20%221930c293822cbf-0fec1f8f684e16-26011951-323200-1930c293823186a%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22%24search_engine%22%3A%20%22google%22%7D',
        'Origin': 'https://intel.arkm.com',
        'Priority': 'u=1, i',
        'Referer': 'https://intel.arkm.com/',
        'sec-ch-ua': '"Chromium";v="130", "Brave";v="130", "Not?A_Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sec-gpc': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'x-payload': 'f1bb3cee161789944e1ee008bccd5f0cb3f03db53754819018cc0defbdb22294',
        'x-timestamp': '1731158626'
      }
    });

    // Dosya adını ve yolu belirle (tags klasörüne kaydediyoruz)
    const fileName = path.join(folderPath, `data_tf_${requestCount}.json`);
    fs.writeFileSync(fileName, JSON.stringify(response.data, null, 2), 'utf-8');
    console.log(`Data has been saved to ${fileName}`);

    requestCount++; // Sayaç bir sonraki istek için artır

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// İlk isteği hemen yap
fetchData();

// fetchData her 2 dakikada bir çağrılır
setInterval(fetchData, 120 * 1000);
