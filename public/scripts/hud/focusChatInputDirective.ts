namespace PhaserGame {
    function FocusChatInputDirective ($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                $scope.$watch($attr.ngShow, (newValue) => {
                    if(newValue){
                        $timeout(() => {
                            $element.find('.chat-input').focus();
                        }, 0);
                    }
                });
            }
        };
    });

    app.directive('focusChatInputOnShow', ['$timeout', FocusChatInputDirective]);
}