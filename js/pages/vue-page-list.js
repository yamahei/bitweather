"use: strinct;";

(function(g){

/** list */
const list_page = g.list_page = "list_page";
const list_path = g.list_path = "/list";//"/list/:junme";
const list_conf = g.list_conf = {
    template: '#LIST_PAGE_TEMPLATE',
    data: function(){
        return {
            points_l: g.Store.load(STORAGEKEY_PLACESL, []),
            points_s: g.Store.load(STORAGEKEY_PLACESS, []),
            setting: g.Store.load(STORAGEKEY_SETTING, {}),
            weather_l: [],
            weather_s: [],
            render_flg: true,
            queue: [],
        };
    },
    computed: {
        temp_unit: function(){
            return {C: '°C', F: '°F', K: 'K'}[this.setting?.units] || ''
        },
    },
    beforeMount: function(){
        this.weather_l.push(...this.points_l.map(function(point){
            return { zipcode: point, now: {}, vdays: {} };
        }));
        this.weather_s.push(...this.points_s.map(function(point){
            return { zipcode: point, now: {}, vdays: {} };
        }));
    },
    mounted: function(){
        if(!this.setting.apikey){
            g.Modal.alert({
                message: "API Keyが ひつよう です",
                on_ok: this.jump_to_setting,
            });
        }else  if(this.points_l.length <= 0 && this.points_s.length <= 0 ){
            g.Modal.alert({
                message: "ばしょ が ありません",
                on_ok: this.jump_to_setting,
            });
        }else{
            this.load_large_weathers(this.points_l);
            this.load_small_weathers(this.points_s);
            this.sequential_load();
        }
    },
    methods: {
        jump_to_credits: function(){
            const param = {};
            this.clear_queue();
            this.$emit("jump_to_credits", param);
        },
        jump_to_setting: function(){
            const param = {};
            this.clear_queue();
            this.$emit("jump_to_setting", param);
        },
        load_large_weathers: function(points){
            const self = this;
            points.forEach(function(point){
                self.queue.push({type: TYPE_POINTNAME, zipcode: point});
                self.queue.push({type: TYPE_WEATHER_NOW, zipcode: point});
                self.queue.push({type: TYPE_WEATHER_5DAYS, zipcode: point});
            });
        },
        load_small_weathers: function(points){
            const self = this;
            points.forEach(function(point){
                self.queue.push({type: TYPE_POINTNAME, zipcode: point});
                self.queue.push({type: TYPE_WEATHER_NOW, zipcode: point});
            });
        },
        sequential_load: function(){
            const self = this;

            const entry = self.queue.shift();
            if(!entry){ return; }//おわり
            const weather_param = {
                zipcode: entry.zipcode,
                lang: self.setting.lang,
                country: self.setting.country,
                units: self.setting.units,
            };
            switch(entry.type){
                case TYPE_POINTNAME:
                    self.load_pointname(entry.zipcode);
                    break;
                case TYPE_WEATHER_NOW:
                    self.load_weather_now(weather_param); 
                    break;
                case TYPE_WEATHER_5DAYS:
                    self.load_weather_5days(weather_param); 
                    break;
                default:
                    throw new error(`unknown entry: ${g.JSON.stringify(entry)}`);
            }
        },
        load_pointname: function(zipcode){
            //TODO: CORSエラー
            this.sequential_load();
            // const self = this;
            // const url = `https://zipcloud.ibsnet.co.jp/api/search?limit=1&zipcode=${zipcode}`;
            // g.axios.get(url).then(function(response){
            //     console.log(response);
            //     self.sequential_load();
            // });
        },
        load_weather_now: function(params){
            const self = this;
            const zipcode = params.zipcode;
            const country = params.country;
            const lang = params.lang;
            const units = params.units;

            g.API.weather_now(self.setting.apikey, zipcode, country, lang, units).then(function(response){
                console.log(response);
                self.set_loaded_data(params.zipcode, "now", response.data);
            }).finally(function(){
                g.setTimeout(self.sequential_load, LOADING_INTERVAL_S_MSEC);
            });
        },
        load_weather_5days: function(params){
            const self = this;
            const zipcode = params.zipcode;
            const country = params.country;
            const lang = params.lang;
            const units = params.units;

            g.API.weather_5days(self.setting.apikey, zipcode, country, lang, units).then(function(response){
                console.log(response);
                self.set_loaded_data(params.zipcode, "vdays", response.data);
            }).finally(function(){
                g.setTimeout(self.sequential_load, LOADING_INTERVAL_L_MSEC);
            });
        },
        convert_5days_to_weathers: function(data){
            const list = data.vdays.list;
            const weathers = list.map(function(item){
                return {
                    dt: new Date(item.dt_txt),
                    weather: item.weather[0],
                };
            });
            return weathers;
        },
        get_todays_weather: function(vdays){
            const today = new Date();
            const list = this.convert_5days_to_weathers(vdays).filter(function(item){
                const yis = (today.getFullYear() == item.dt.getFullYear());
                const mis = (today.getMonth() == item.dt.getMonth());
                const dis = (today.getDate() == item.dt.getDate());
                return yis && mis && dis;
            });
            return list;
        },
        get_after_weather: function(vdays){
            const today = new Date();
            let last = -2;//day
            let now = -1;//day
            const list = this.convert_5days_to_weathers(vdays).filter(function(item){
                const yis = (today.getFullYear() == item.dt.getFullYear());
                const mis = (today.getMonth() == item.dt.getMonth());
                const dis = (today.getDate() == item.dt.getDate());
                if(yis && mis && dis){ return false; }
                last = now;
                now = item.dt.getDate();
                return last != now;
            });
            return list;
        },
        set_loaded_data: function(zipcode, key, data){
            const targetl = this.weather_l.find(function(item){ return item.zipcode == zipcode });
            const targets = this.weather_s.find(function(item){ return item.zipcode == zipcode });
            const target = targetl || targets;
            if(target){
                Object.assign(target[key], data);
                const self = this;
                this.render_flg = false;
                this.$nextTick(function(){ self.render_flg = true; });
            }
        },
        is_now_loaded: function(weather){
            return !!weather?.now?.cod;
        },
        is_vdays_loaded: function(weather){
            return !!weather?.vdays?.cod;
        },
        clear_queue: function(){
            this.queue.splice(0);
        },
    },
};

})(this);