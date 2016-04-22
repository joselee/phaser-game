namespace Game {
    function GameDirective() {
        return {
            restrict: 'E',
            scope: false,
            controller: 'gameController as ctrl',
            bindToController: true
        };
    }

    game.directive('game', GameDirective);
}