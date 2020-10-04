"use: strinct;";

(function(g){

    const component = {
        template: "#LOCATE_ROW_TEMPLATE",
        props: ["zipcode"],
        data: function(){
            return {};
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            on_delete: function($event){
                const param = {};
                this.$emit("delete", param);    
            },
            on_downto: function($event){
                const param = {};
                this.$emit("downto", param);    
            },
            on_upto: function($event){
                const param = {};
                this.$emit("upto", param);    
            },
        },
    };

    g.Vue.component('locate_row', component);
    
})(this);