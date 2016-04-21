namespace App {
    export class MyController {
        foo: string;
        
        static $inject = ['myService'];
        constructor(myService: MyService) {
            this.foo = myService.getFoo();
        }
    }
    app.controller('myController', MyController);
}