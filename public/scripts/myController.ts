namespace App {
    export class MyController {
        foo: string;
        game: SimpleGame;
        
        static $inject = ['myService'];
        constructor(myService: MyService) {
            this.foo = myService.getFoo();
            this.game = new SimpleGame();
        }
    }
    app.controller('myController', MyController);
}