namespace PhaserGame {
    function HudDirective() {
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: 'hudController as hudCtrl',
            templateUrl: 'scripts/hud/hudTemplate.html'
        };
    }

    app.directive('hud', [HudDirective]);
}