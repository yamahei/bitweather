"use: strinct;";

(function(g){

/** list */
const setting_page = g.setting_page = "setting_page";
const setting_path = g.setting_path = "/setting";
const setting_conf = g.setting_conf = {
    template: '#SETTING_PAGE_TEMPLATE',
    data: function(){
        return {
            points_l: g.Store.load(STORAGEKEY_PLACESL, []),
            points_s: g.Store.load(STORAGEKEY_PLACESS, []),
            setting: g.Store.load(STORAGEKEY_SETTING, {}),
            form: {
                apikey: null,
                lang: 'ja',// en
                country: 'jp',//us
                units: 'C',//℃, ℉, K
                zipcode: "",
                points_l: [],//["731-0223", ...]
                points_s: [],//["731-0223", ...]
            },
        };
    },
    computed: {},
    beforeMount: function(){
        this.form.apikey = this.setting.apikey || null;
        this.form.lang = this.setting.lang || this.form.lang;
        this.form.country = this.setting.country || this.form.country;
        this.form.units = this.setting.units || this.form.units;
        if(this.points_l){
            this.form.points_l.push(...this.points_l);
        }
        if(this.points_s){
            this.form.points_s.push(...this.points_s);
        }
    },
    mounted: function(){},
    methods: {
        on_add: function(){
            const zipcode = this.form.zipcode;
            if(zipcode === ""){
                //ignore
                //g.Modal.alert({ message: "Zip Codeが ありません" });
            }else if(!zipcode.match(/^\d{3}-?\d{4}$/)){
                g.Modal.alert({ message: "けいしきは 000-0000 じゃ" });
            }else{
                this.form.points_l.unshift(zipcode.replace(/^(\d{3})-?(\d{4})$/, "$1-$2"));
                this.form.zipcode = "";
            }
        },
        on_delete_l: function(zipcode){
            const index = this.form.points_l.indexOf(zipcode);
            if(index >= 0){ this.form.points_l.splice(index, 1); }
        },
        on_upto_l: function(zipcode){
            const index = this.form.points_l.indexOf(zipcode);
            if(index > 0){//0は一番上なので何もしない
                const row = this.form.points_l.splice(index, 1).pop();
                this.form.points_l.splice(index - 1, 0, row);
            }
        },
        on_downto_l: function(zipcode){
            const index = this.form.points_l.indexOf(zipcode);
            if(index == this.form.points_l.length - 1){//0は一番下なのでSに移動
                const row = this.form.points_l.pop();
                this.form.points_s.unshift(row);
            }else{
                const row = this.form.points_l.splice(index, 1).pop();
                this.form.points_l.splice(index + 1, 0, row);
            }
        },
        on_delete_s: function(zipcode){
            const index = this.form.points_s.indexOf(zipcode);
            if(index >= 0){ this.form.points_s.splice(index, 1); }
        },
        on_upto_s: function(zipcode){
            const index = this.form.points_s.indexOf(zipcode);
            if(index === 0){//0は一番上なのでLに移動
                const row = this.form.points_s.splice(index, 1).pop();
                this.form.points_l.push(row);
            }else{
                const row = this.form.points_s.splice(index, 1).pop();
                this.form.points_s.splice(index - 1, 0, row);
            }
        },
        on_downto_s: function(zipcode){
            const index = this.form.points_s.indexOf(zipcode);
            if(index < this.form.points_s.length - 1){//0は一番下なので何もしない
                const row = this.form.points_s.splice(index, 1).pop();
                this.form.points_s.splice(index + 1, 0, row);
            }
        },

        on_ok: function(){
            if(!this.setting.apikey && !this.form.apikey){
                g.Modal.alert({ message: "API Keyを てにいれよ！" });
            }else{
                this.setting.apikey = this.form.apikey;
                this.setting.lang = this.form.lang;
                this.setting.country = this.form.country;
                this.setting.units = this.form.units;
                g.Store.save(STORAGEKEY_SETTING, this.setting),
    
                this.points_l.splice(0);
                this.points_l.push(...this.form.points_l);
                g.Store.save(STORAGEKEY_PLACESL, this.points_l),
                this.points_s.splice(0);
                this.points_s.push(...this.form.points_s);
                g.Store.save(STORAGEKEY_PLACESS, this.points_s),

                this.page_back();
            }
        },
        page_back: function(){
            const param = {};
            this.$emit("back_page", param);
        },
    },
};

})(this);