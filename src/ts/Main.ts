declare var angular: any;
declare var d3: any;

function translate(x0, y0, scale, angle){
  return 'translate('+ x0 + ',' + y0 + ')scale(' + scale + ')rotate(' + angle + ')'
}

module Main {
  var app = angular.module('mainApp', []);

  app.controller('mainCtrl', function($scope, $http, $q, $element) {
    var $d3element = d3.select($element[0]);

    $http({
      method : 'GET',
      url : 'assets/svg/roach.svg'
    }).then(function (response) {
      var strSVG = response.data
        , containerSVG = $d3element.append('div')
            .classed('hidden', true)
            .html(strSVG)
        , svgMovil = containerSVG.select('.movil')
        ;



      var board = $d3element.classed('board', true)
        .append('svg')
        .attr('width', '500')
        .attr('height', '500')
        ;


     var x0 = 0;

     var y0 = 0;
     var angle = 0;

      var movil = board.append('g')
        .attr('transform', translate(x0, y0, 0.1, angle))

      movil.html(svgMovil.html());



      d3.select('body')
        .on('keydown', function(a,b,c) {
          var a = d3.event.keyIdentifier;
          switch (d3.event.keyIdentifier) {
            case 'U+0057':
              y0++;
            break;
            case 'U+0053':
              y0--;
            break;
            case 'U+0044':
            break;
            case 'U+0041':
            break;
          }
          movil.attr('transform', translate(x0, y0, 0.1, angle));
        });
    });
  });
}
