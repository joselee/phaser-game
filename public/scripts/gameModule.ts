namespace Game {
    export let gameModule = angular.module('game', []);
    
    gameModule.controller('test', ['$rootScope', function(r) {
        this.test = () => {
            console.log("testcontroller ok emitting");
            r.$emit('test', 'yeees');
        };
    }])
}