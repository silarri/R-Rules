import * as ExternalRequests from "./external-requests.json";
import oauth from "../oauth"; 
import * as Schemas from "../realmSchemas/schema";

export async function loginSensorizarServer(){
    console.log(`[NEW] -> loginSensorizarServer`);
    let sensorizarInfo = ExternalRequests.list.find((server) => server.name==='sensorizar');
    let loginResquest = sensorizarInfo.requests.find((r) => r.key === 'login');

    console.log(`[NEW] -> ${JSON.stringify(loginResquest)} | ${typeof loginResquest}`);

    const params = {
        headers: loginResquest.headers,
        body: JSON.stringify(loginResquest.body),
        method: loginResquest.requestType
    };

    const url = `${sensorizarInfo.url}${loginResquest.route}`;

    try{
        const response = await fetch(url, params);
        const res = await response.json();
        console.log(`[NEW] -> RESPONSE: ${response.status} + ${res.token}`);
        Schemas.storeServerToken(res.token, 'sensorizar', new Date());
        return res.token;
    }catch(error) {
        console.log(error);
    }
    
}

export async function getInfoServer(token){
    console.log(`[NEW] -> getInfoSensorizarServer`);
    const sensorizarInfo = ExternalRequests.list.find((server) => server.name==='sensorizar');
    const getInfoResquest = sensorizarInfo.requests.find((r) => r.key === 'data');

    console.log(`[NEW] -> ${JSON.stringify(getInfoResquest)} | ${typeof getInfoResquest}`);

    let params = {
        headers: { 'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Authorization' : 'Bearer ' + token},
        method: getInfoResquest.requestType
    };

    let url = `${sensorizarInfo.url}${getInfoResquest.route}${getInfoResquest.pathParams.ENTITY_VIEW}/${getInfoResquest.endRoute}`;

    console.log(`[NEW] -> URL ${url}`);

    try{
        const response = await fetch(url, params);
    console.log(`[NEW] -> URL ${url}`);

        const res = await response.text();

        console.log(`[NEW] -> RESPONSE: ${response.status} + ${res}`);
        Schemas.CreateContext("SENSORIZAR", JSON.stringify(res));

    return response;
    }catch(error) {
        console.log(error);
    }
    
}


export async function getDataOpenWeatherMap(){
    console.log(`[NEW] -> getDataOpenWeatherMap`);
    let openWeatherInfo = ExternalRequests.list.find((server) => server.name==='openweather');
    let weatherResquest = openWeatherInfo.requests.find((r) => r.key === 'weather');

    let params = weatherResquest.queryParams;
    let testLat = '39.31';
    let testLon = '-74.5';
    let appid = oauth.openweathermap;

    let url = `${openWeatherInfo.url}${weatherResquest.route}${params.lat}${testLat}${params.lon}${testLon}${params.units}${params.appid}${appid}`;
    console.log(`[NEW] -> URL: ${JSON.stringify(url)} | PARAMS: ${JSON.stringify(params)}`);
    // let response = fetch(url, params).then((data) => {console.log(`[NEW] -> REQUEST DONE`); console.log(`[NEW] -> DATA: ${data}`); return data.json();})
    //                 .then((res) => {console.log(`[NEW] -> RESPONSE: ${JSON.stringify(res)}`); return res;})
    //                 .catch((error) => console.log(error));
    try{
        let response = await fetch(url);
        console.log(`[NEW] -> RESPONSE: ${JSON.stringify}`);

    return response;
    }catch(error) {
        console.log(error);
    }
    
}