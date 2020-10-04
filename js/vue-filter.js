"use: strinct;";

(function(g){

    g.Vue.filter('date_to_date', function (date) {//Date
        if(!date || date == NaN){ return '--'; }
        const yo = date.getDay();
        const hi = date.getDate();
        const youbis = { '0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土' };
        return `${youbis[yo]} ${("0" + hi).slice(-2)}日`;
    });
    
    g.Vue.filter('date_to_time', function (date) {//Date
        if(!date || date == NaN){ return '--'; }
        const hour = date.getHours();
        return `${("0" + hour).slice(-2)}じ`;
    });

    g.Vue.filter('weather_to_location', function (weather) {//{ zipcode: point, now: {}, vdays: {} }
        const zipcode = weather.zipcode;
        const city = weather?.vdays?.city?.name;
        return city || zipcode;
    });

    g.Vue.filter('iconid_to_url', function (id) {//weather.icon
        return `http://openweathermap.org/img/wn/${id}.png`;        
    });
    g.Vue.filter('deg_to_dir', function (deg) {//wind.deg
        const index = Math.round(Math.round(deg * 1 + 0.4) / 22.5);
        return [
            '北', '北北東', '北東', '東北東',
            '東', '東南東', '南東', '南南東', 
            '南', '南南西', '南西', '西南西', 
            '西', '西北西', '北西', '北北西',
        ][index];
    });
    g.Vue.filter('nodot_kanji_to_kana', function (text) {//String
        const pairs = [
            {f: '適度な', t: 'てきどな'},
            {f: '厚い', t: 'あつい'},
            {f: '薄い', t: 'うすい'},
            {f: '強い', t: 'つよい'},
            {f: '曇り', t: 'くもり'},
            {f: '晴天', t: 'せいてん'},
            {f: '雷雨', t: 'らいう'},
            {f: '暴風', t: 'ぼうふう'},
            {f: '雲', t: 'くも'},
            {f: '霧', t: 'きり'},
            {f: '雹', t: 'ひょう'},
            {f: '雷', t: 'かみなり'},            
        ].sort(function(a, b){ return b.length - a.length; });
        let result = text;
        pairs.forEach(function(pair){
            result = result.replace(pair.f, pair.t);
        });
        return result;
    });

    ///////////////////////////////


    /**
     * Filter - Biz
     */
    /** 巡目の表記 */
    g.Vue.filter('n2_junme_short', function (num) {//number
        if (!num && num !== 0) {return '';}
        return `${num}巡目`;
    });
    // g.Vue.filter('to_junme_short', function (work) {//g.STATE.work.globals[n]
    //     if (!work) {return '';}
    //     return `${work.junme}巡目`;
    // });
    // g.Vue.filter('to_junme_long', function (work) {//g.STATE.work.globals[n]
    //     if (!work) {return '';}
    //     return `${work.junme}巡目（${work.from_year}年～${work.to_year}年）`;
    // });

    /** 判定区分の表記 */
    g.Vue.filter('n2_judge_kbn', function (num) {//number
        switch(num){
            case 1: return "Ⅰ";
            case 2: return "Ⅱ";
            case 3: return "Ⅲ";
            case 4: return "Ⅳ";
            default: return "-";
        }
    });

    /** 橋梁情報 */
    g.Vue.filter('f2_umu', function (value) {
        if (!value && value !== false) {return '-';}
        return value ? 'あり' : 'なし';
    });
    g.Vue.filter('f2_ox', function (value) {
        if (!value && value !== false) {return '-';}
        return value ? '〇' : '×';
    });
    g.Vue.filter('n2_m', function (num) {
        if (!num && num !== 0) {return '-';}
        return `${num} m`;
    });
    g.Vue.filter('n2_kg', function (num) {
        if (!num && num !== 0) {return '-';}
        return `${num} kg`;
    });
    g.Vue.filter('n2_y', function (num) {
        if (!num && num !== 0) {return '-';}
        return `${num} 年`;
    });
    g.Vue.filter('n2_dfb', function (num) {//度°分′秒″	
        if (!num && num !== 0) {return '-';}
        const d = Math.floor(num);
        const f = Math.floor((num - d) * 60);
        const b = Math.floor((num - d - (f / 60)) * 3600);
        return `${d}° ${f}′ ${b}″`;
    });
    g.Vue.filter('n2_road_type', function (num) {
        switch(num){
            case 1: return "一般道";
            case 2: return "高速道路";
            default: return "-";
        }
    });
    /**
     * Filter - General
     */
    g.Vue.filter('date_ymd', function (d) {
        const date = new Date(d);
        if(!d || isNaN(date)){ return "-"; }
        var f = new DateFormat("yyyy/MM/dd");
        return f.format(new Date(date));
    });


})(this);