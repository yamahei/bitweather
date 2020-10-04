"use: strinct;";

(function(g){

    const state = {
        hook: {
            start: null,
            end: null,
            error: null,
        },
    };
    const cache = {};//TODO

    //axios.defaults.baseURL = "http://localhost:4567";
    axios.interceptors.request.use(function (request) {
        state.hook.start && state.hook.start();
        return request;
    }, function (error) {
        state.hook.error && state.hook.error(error);
        state.hook.end && state.hook.end();
        return Promise.reject(error);
    });
    axios.interceptors.response.use(function (response) {
        if(response.request.status == 200){
            state.hook.end && state.hook.end();
            return response;
        }else{
            state.hook.error && state.hook.error(response);
            state.hook.end && state.hook.end();
            return Promise.reject(response);//あってんのかな？
        }
    }, function (error) {
        state.hook.error && state.hook.error(error);
        state.hook.end && state.hook.end();
        return Promise.reject(error);
    });

    const ADMIN_BASE_URI = "/api/admin";
    const build_queries = function(params){
        return '?' + Object.keys(params).map(function(key){
            return `${key}=${params[key]}`;
        }).join('&');
    };
    const api = function(){};

    //General
    // api.prototype.set_base_url = function(url){
    //     //ATTENTION: 末尾に"/"いらない
    //     axios.defaults.baseURL = url;
    // };
    api.prototype.set_hooks = function(start, end, error){
        state.hook.start = start;
        state.hook.end = end;
        state.hook.error = error;
    };

    api.prototype.weather_now = function(apikey, zipcode, country, lang, units){
        const url = URL_OPEN_WEATHER_NOW;
        const params = { appid: apikey, zip: `${zipcode},${country}`, lang: lang };
        params['units'] = VALUE_UNITS[units];
        return axios.get(url, {params: params});//クエリパラメータで渡す場合
    };
    api.prototype.weather_5days = function(apikey, zipcode, country, lang, units){
        const url = URL_OPEN_WEATHER_5DAYS;
        const params = { appid: apikey, zip: `${zipcode},${country}`, lang: lang };
        params['units'] = VALUE_UNITS[units];
        return axios.get(url, {params: params});//クエリパラメータで渡す場合
    };



    g.API = new api();

})(this);