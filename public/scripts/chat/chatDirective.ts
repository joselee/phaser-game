namespace PhaserGame {
    function ChatDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            bindToController: true,
            controller: 'chatController as chatCtrl',
            templateUrl: 'scripts/chat/chatTemplate.html'
        };
    }

    app.directive('chat', [ChatDirective]);
}