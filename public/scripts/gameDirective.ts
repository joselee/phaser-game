namespace Game {
    function GameDirective() {
        return {
            restrict: 'E',
            scope: false,
            controller: 'gameController as ctrl',
            bindToController: true
        };
    }

    gameModule.directive('game', GameDirective);
}