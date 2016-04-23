namespace PhaserGame {
    function FocusChatInputDirective ($rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                let chatFocus = false;
                angular.element(document).on('keypress', (e)=> {
                    // Enter key toggles game key capture and chat HUD
                    if(e.keyCode === 13) {
                        if(!chatFocus){
                            chatFocus = true;
                            $timeout(() => { $element.focus(); });
                        }
                        else {
                            chatFocus = false;
                            $timeout(() => { $element.blur(); });
                        }
                    }
                });

                // Gets triggered when user clicks on/off input, or presses enter
                $element.on('focus blur', () => {
                    $rootScope.$emit('setFocusToChat', chatFocus);
                });

                // Disable tab key, so we dont lose focus while typing
                $element.on('keydown', (e) => {
                    if(e.keyCode === 9){
                        e.preventDefault();
                    }
                });
            }
        };
    });

    app.directive('focusChatInput', ['$rootScope', '$timeout', FocusChatInputDirective]);
}