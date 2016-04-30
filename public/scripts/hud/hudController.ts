namespace PhaserGame {
    class HudController {
        message: string = '';
        messages: IChatMessage[] = [];

        static $inject = ['$rootScope', 'socketService'];
        constructor($rootScope: ng.IRootScopeService, private socketService: SocketService) {
            this.messages.push({ type: 'system', text: 'Welcome!' });

            $rootScope.$on('commandResponse', (event: ng.IAngularEvent, response: string) => {
                $rootScope.$apply(() => {
                    this.messages.push({ type: 'system', text: response });
                });
            });

            $rootScope.$on('addMessageToMessageBox', (event: ng.IAngularEvent, message: IChatMessage) => {
                $rootScope.$apply(() => {
                    this.messages.push(message)
                });
            });
        }

        chatFormSubmit() {
            if (this.message) {
                if (this.message.indexOf('/') === 0) {
                    if (this.message.trim() === '/clear') {
                        this.messages = [];
                    }
                    else if (this.message.indexOf('/nick ') === 0) {
                        let split = this.message.split('/nick ');
                        if (split.length === 2) {
                            let regex = /^[a-zA-Z0-9-_.]+$/;
                            let nick = split[1];
                            if (nick.search(regex) === 0) {
                                this.socketService.changeNick(nick);
                            }
                            else {
                                this.messages.push({
                                    type: 'system',
                                    text: 'Nicknames can only contain letters, numbers, hyphens, underscores, and dots!'
                                });
                            }
                        }
                        else {
                            this.messages.push({
                                type: 'system',
                                text: 'Wtf are you trying to do?'
                            });
                        }
                    }
                    else {
                        this.socketService.commandToServer(this.message);
                    }
                }
                else {
                    // Normal chat message
                    this.socketService.chatMessageToServer(this.message);
                }
            }
            this.message = '';
        }
    }

    app.controller('hudController', HudController);
}