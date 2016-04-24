namespace PhaserGame {
    function ScrollChatBottomDirective ($rootScope, $timeout) {
        return {
            restrict: 'A',
            scope: {
                scrollChatBottom: '='
            },
            link: ($scope, $element) => {
                $scope.$watchCollection('scrollChatBottom', (newValue) => {
                    if(newValue)
                        $element.scrollTop($element[0].scrollHeight);
                });
            }
        };
    });

    app.directive('scrollChatBottom', ['$timeout', ScrollChatBottomDirective]);
}