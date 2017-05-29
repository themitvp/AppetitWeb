angular
  .module('appetit', [])
  .controller('mainController', function ($http) {
    var vm = this;

    vm.favoriteRecipe = favoriteRecipe;
    vm.resetUser = resetUser;

    init();

    function init () {
      loadUser().then(getRecipes);
    }
    
    function loadUser () {
      var savedUserId = localStorage.getItem('userId')
        , userPromise = savedUserId ? getUser(savedUserId) : createUser();

      return userPromise
        .then(function (user) {
          if (!user.recipeFavorite)
            user.recipeFavorite = [];

          vm.user = user;
          localStorage.setItem('userId', user.id);
        })
    }

    function resetUser () {
      localStorage.removeItem('userId');
      return loadUser();
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

    function getUser (id) {
      return $http.get('http://52.42.210.120:8000/api/v1/users/list/?userId=' + id)
        .then(function (response) {
          return response.data[0];
        });
    }

    function createUser () {
      var data = {
        name: 'AlgoritmeTester',
        household: 1,
        allergies: [],
        foodDiet: 0,
        segment: 0,
        recipeFavorite: []
      };

      return $http.post('http://52.42.210.120:8000/api/v1/users/create/', data)
        .then(function (response) {
          return response.data;
        });
    }
  });
