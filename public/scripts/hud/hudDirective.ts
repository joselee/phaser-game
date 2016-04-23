namespace PhaserGame {
    function HudDirective($rootScope: ng.IRootScopeService) {
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: 'hudController as hudCtrl',
            templateUrl: 'scripts/hud/hudTemplate.html',
            link : (scope) => {
                let gameCapturingInput = true;
                angular.element(document).on('keypress', (e)=> {
                    // Enter key toggles game key capture and chat HUD
                    if(e.keyCode === 13) {
                        gameCapturingInput = !gameCapturingInput;
                        $rootScope.$emit('toggleGameCaptureInput', gameCapturingInput);
                    }
                });
            }
        };
    }

    app.directive('hud', ['$rootScope', HudDirective]);
}