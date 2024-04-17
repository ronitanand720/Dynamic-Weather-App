const http = require('http');
const fs = require('fs');
let requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");
const streaming = require('stream');

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
}
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Dehradun&appid=f0b553d561e286c1c05f5df79deb82b4",
            { streaming }
        )
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                console.log(arrData[0].main.temp);
                const realTimeData = arrData.map(val =>
                    replaceVal(homeFile, val)).join("");
                    res.write(realTimeData);
                    console.log(realTimeData);
                })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            })
    }
});

server.listen(3000, "127.0.0.1");