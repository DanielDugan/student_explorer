'use strict';

/**
 * @ngdoc service
 * @name sespaApp.advisingService
 * @description
 * # advisingService
 * Factory in the sespaApp.
 */
angular.module('sespaApp')
  .factory('advisingData', function($http, $q, $httpParamSerializer) {
    var config = function() {
      return $http.get('api/', {
          'cache': true
        })
        .then(function(response) {
          return response.data;
        });
    };

    var getAdvisingData = function(url) {
      var deferred = $q.defer();
      var data = [];
      var getNext = function(url) {
        $http.get(url)
          .then(function(response) {
            if ((typeof response.data.results === 'object' &&
                (typeof response.data.next === 'string' ||
                  response.data.next === null)
              )) {
              // console.log('dealing with paginaged data');
              response.data.results.forEach(function(entry) {
                data.push(entry);
              });

              if (typeof response.data.count === 'number') {
                deferred.notify(data.length / response.data.count);
              }

              if (response.data.next !== null) {
                getNext(response.data.next);
              } else {
                deferred.resolve(data);
              }
            } else {
              // console.log('dealing with unpaginaged data');
              deferred.resolve(response.data);
            }
          }, function(reason) {
            deferred.reject(reason);
          });
      };

      config().then(function(config) {
        getNext(config.apiRootUrl + url);
      });

      return deferred.promise;
    };

    // Public API here
    return {
      config: function() {
        return config();
      },

      userInfo: function() {
        return getAdvisingData('users/me/');
      },

      allAdvisors: function() {
        return getAdvisingData('mentors/');
      },

      advisorDetails: function(advisorUsername) {
        return getAdvisingData('mentors/' + advisorUsername + '/');
      },

      advisorsStudents: function(advisorUsername) {
        return getAdvisingData('mentors/' + advisorUsername + '/students/');
      },

      searchStudents: function(search) {
        return getAdvisingData('students/?search=' + search);
      },

      filterStudents: function(params) {
        var qs = $httpParamSerializer(params);
        return getAdvisingData('students/?' + qs);
      },

      studentDetails: function(studentUsername) {
        return getAdvisingData('students/' + studentUsername + '/');
      },

      studentAdvisors: function(studentUsername) {
        return getAdvisingData('students/' + studentUsername + '/mentors/');
      },

      studentClassSites: function(studentUsername) {
        return getAdvisingData('students/' + studentUsername + '/class_sites/');
      },

      studentClassSiteDetails: function(studentUsername, classSiteCode) {
        return getAdvisingData('students/' + studentUsername + '/class_sites/' + classSiteCode + '/');
      },

      studentClassSiteAssignments: function(studentUsername, classSiteCode) {
        return getAdvisingData('students/' + studentUsername + '/class_sites/' + classSiteCode + '/assignments/');
      },

      studentClassSiteHistory: function(studentUsername, classSiteCode) {
        return getAdvisingData('students/' + studentUsername + '/class_sites/' + classSiteCode + '/history/');
      },

      classSites: function() {
        return getAdvisingData('class_sites/');
      },

      classSiteDetails: function(classSiteCode) {
        return getAdvisingData('class_sites/' + classSiteCode + '/');
      },

    };
  });
