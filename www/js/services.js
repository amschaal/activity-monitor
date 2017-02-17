angular.module('yaam.services', [])

.factory('Activity', function() {

  return {
    types: function() {
      return ['walk','bike'];
    },
    save: function(types) {
    }
  };
});
