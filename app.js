angular
  .module('appetit', [])
  .controller('mainController', function ($http) {
    var vm = this;

    $http.get('http://52.42.210.120:8000/api/v1/recipes/listAll/?limit=100')
      .then(function (response) {
        vm.recipes = response.data;
      });
  });
