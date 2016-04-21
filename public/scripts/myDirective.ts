namespace App {
    function MyDirective() {
        return {
            restrict: 'E',
            scope: false,
            controller: 'myController as ctrl',
            bindToController: true,
            template: '<div id="game"></div>'
        };
    }

    app.directive('myDirective', MyDirective);
}