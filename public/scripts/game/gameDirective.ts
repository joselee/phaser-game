namespace PhaserGame {
    function GameDirective() {
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: 'gameController'
        };
    }

    app.directive('game', GameDirective);
}