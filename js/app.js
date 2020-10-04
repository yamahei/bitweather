"use: strinct;";

(function(g){

/**
 * Hooks
 */
const loader_func = g.get_loader_func();
const api_start = function(){
    console.log("start loader");
    state.loader_visible = loader_func.show_loader();
};
const api_end = function(){
    console.log("start loader");
    state.loader_visible = loader_func.hide_loader();
};
const api_error = function(error){
    console.log("abort loader");
    console.log(error);
    const message = error?.response?.data?.message || error?.message || "unknown error.";
    g.Modal.alert({message: message});
    state.loader_visible = loader_func.abort_loader();
};

/**
 * Routes
 */
const router = new VueRouter({
    routes: [
        { path: '/', redirect: { name: g.list_page }},
        { name: g.list_page, path: g.list_path, component: g.list_conf },
        { name: g.setting_page, path: g.setting_path, component: g.setting_conf },
    ],
});
/**
 * Main
 */
const state = {
    loader_visible: false,
    menu_open: false,
};
g.STATE = state;
const main_page = {
    router: router,
    el: '#app',
    data: state,
    computed: {},
    beforeMount: function(){},
    mounted: function(){},
    methods: {
        toggle_menu: function(){
            this.menu_open = !this.menu_open;
        },
        close_menu: function(){
            this.menu_open = false;
        },
        /**
         * From Page
         */

        /**
         * Paging
         */
        jump_to_setting: function(){
            this.show_a_page(g.setting_page, {});
        },
        show_a_page: function(name, params){
            this.close_menu();
            this.$router.push({ name: name, params: params })
            .catch(err => { console.log(err); });
        },
        page_back: function(){
            if(window.history.length > 1){
                this.$router.go(-1);
            }else{
                this.$router.push('/');
            }
            //g.location.reload();
        }
    },
};
g.window.addEventListener('load', function(){
    g.API.set_hooks(api_start, api_end, api_error);
    const app = new Vue(main_page);
});

})(this);