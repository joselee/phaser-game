namespace App {
    export class MyService {
        getFoo(){
            return 'foo';
        }
    }
    app.service('myService', MyService);
}