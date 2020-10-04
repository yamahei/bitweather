"use: strinct;";

(function(g){

    const store = function(){};

    store.prototype.load = function(key, default_value){
        const value = g.localStorage.getItem(key);
        return (value === null)? default_value : g.JSON.parse(value);
    };
    store.prototype.save = function(key, value){
        g.localStorage.setItem(key, g.JSON.stringify(value));
    };
    //TODO: remove?

    g.Store = new store();

})(this);