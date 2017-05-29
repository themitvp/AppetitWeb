angular
  .module('appetit', [])
  .controller('mainController', function ($http) {
    var vm = this;

    vm.favoriteRecipe = favoriteRecipe;

    init();

    function init () {
      createUser().then(getRecipes);
    }

    function favoriteRecipe (recipe) {
      vm.user.recipeFavorite.push(recipe.id);

      return $http.put('http://52.42.210.120:8000/api/v1/users/update/' + vm.user.id, vm.user)
        .then(function (response) {
          vm.user = response.data
        });
    }

    function getRecipes () {
      return $http.get('http://52.42.210.120:8000/api/v1/recipes/listAll/?limit=100')
        .then(function (response) {
          vm.recipes = response.data.results;
        });
    }

    function createUser () {
      var data = {
        name: 'AlgoritmeTester',
        household: 1,
        allergies: [],
        foodDiet: 'none',
        segment: 'single/couple',
        recipeFavorite: []
      };

      return $http.post('http://52.42.210.120:8000/api/v1/users/create/', data)
        .then(function (response) {
          vm.user = response.data;

          if (!vm.user.recipeFavorite)
            vm.user.recipeFavorite = [];
        });
    }
  });
