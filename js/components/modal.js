"use: strinct;";

(function(g){

    const state = {
        visible: false,
        show_cancel: false,
        show_prompt: false,
        text: "",
        messages: [],
        on_ok: null,
        on_cancel: null,
    };
    const component = {
        template: `
            <div ui="dialog" v-if="visible">
                <div class="nes-dialog">
                    <p></p>
                    <template v-for="message in messages">
                        <p>{{ message }}</p>
                    </template>
                    <p></p>
                    <menu class="dialog-menu" style="text-align: center; padding: 0;">
                        <button class="nes-btn" v-if="show_cancel" @click="click_cancel">Cancel</button>
                        <button class="nes-btn is-primary" @click="click_ok">OK</button>
                    </menu>

                </div>    
            </div>`,
        data: function(){
            return state;
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            click_cancel: function(){
                this.on_cancel && this.on_cancel();
                state.visible = false;
            },
            click_ok: function(){
                if(this.on_ok){
                    if(this.show_prompt && this.text){
                        this.on_ok(this.text);
                    }else{ this.on_ok(); }
                }
                state.visible = false;
            },
        },
    };

    g.Vue.component('modal', component);
    
    const func = function(){};
    func.prototype.alert = function(params){
        this.show_modal(Object.assign(params, {
            //on_ok: null,
            on_cancel: null,
            show_cancel: false,
            show_prompt: false,
        }));
    };
    func.prototype.confirm = function(params){
        this.show_modal(Object.assign(params, {
            //on_ok: null,
            //on_cancel: null,
            show_cancel: true,
            show_prompt: false,
        }));
    };
    func.prototype.prompt = function(params){
        this.show_modal(Object.assign(params, {
            //on_ok: null,
            //on_cancel: null,
            show_cancel: true,
            show_prompt: true,
        }));
    };
    func.prototype.show_modal = function(params){
        if(params.visible){ throw new Error("Modal is shown."); }
        if(!params.message){ throw new Error("Message is required."); }
        state.show_cancel = params.show_cancel;
        state.on_ok = params.on_ok || null;
        state.on_cancel = params.on_cancel || null;
        state.show_prompt = params.show_prompt;
        state.text = "";
        state.messages.splice(0);
        state.messages.push(...params.message.split("\n"));
        state.visible = true;
    };
    func.prototype.force_close = function(){
        state.visible = false;
    }

    g.Modal = new func();

})(this);