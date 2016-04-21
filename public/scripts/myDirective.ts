namespace App {
    function MyDirective() {
        return {
            restrict: 'E',
            scope: false,
            controller: 'myController as ctrl',
            bindToController: true,
            template: '<h1>{{ctrl.foo}}</h1>'
        };
    }
    
    app.directive('myDirective', MyDirective);
}