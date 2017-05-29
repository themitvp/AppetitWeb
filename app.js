angular
  .module('appetit', [])
  .controller('mainController', function ($http) {
    var vm = this;

    vm.favoriteRecipe = favoriteRecipe;
    vm.resetUser = resetUser;
    vm.isFavorited = isFavorited;
    vm.loading = false;

    init();

    function init () {
      vm.loading = true;
      loadUser()
        .then(getRecipes)
        .then(function () {
          flagFavorites();
          vm.loading = false;
        });
    }
    
    function resetUser () {
      localStorage.removeItem('userId');
      return loadUser()
        .then(flagFavorites);
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

    function favoriteRecipe (recipe) {
      if (!recipe.favorited)
        vm.user.recipeFavorite.push(recipe.id);
      else
        vm.user.recipeFavorite.splice(vm.user.recipeFavorite.indexOf(recipe.id), 1);

      recipe.favorited = isFavorited(recipe);

      return $http.put('http://52.42.210.120:8000/api/v1/users/update/' + vm.user.id + '/', vm.user)
        .then(function (response) {
          vm.user = response.data;
        });
    }

    function flagFavorites () {
      for (var i = 0; i < vm.recipes.length; i++) {
        var recipe = vm.recipes[i];
        recipe.favorited = isFavorited(recipe);
      }
    }
    
    function isFavorited (recipe) {
      for (var i = 0; i < vm.user.recipeFavorite.length; i++) {
        if (vm.user.recipeFavorite[i] === recipe.id)
          return true;
      }

      return false;
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
