/**
 * ownCloud - Calendar App
 *
 * @author Raghu Nayyar
 * @author Georg Ehrke
 * @copyright 2014 Raghu Nayyar <beingminimal@gmail.com>
 * @copyright 2014 Georg Ehrke <oc.list@georgehrke.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
var app = angular.module('Calendar', [
	'OC',
	'ngAnimate',
	'restangular',
	'ngRoute',
	'ui.bootstrap',
	'ui.calendar',
	'colorpicker.module'
]).config(['$provide', '$routeProvider', 'RestangularProvider', '$httpProvider', '$windowProvider',
	function ($provide,$routeProvider,RestangularProvider,$httpProvider,$windowProvider) {

		$httpProvider.defaults.headers.common.requesttoken = oc_requesttoken;

		$routeProvider.when('/:id', {
			templateUrl : 'calendar.html',
			controller : 'CalController',
			resolve : {
				calendar: ['$route', '$q', 'is', 'Restangular',
				function ($route, $q, is, Restangular) {
					var deferred = $q.defer();
					var id = $route.current.params.id;
					is.loading = true;
					Restangular.one('v1/calendars', id).get().then(function (calendar) {
						is.loading = false;
						deferred.resolve(calendar);
					}, function () {
						is.loading = false;
						deferred.reject();
					});

					return deferred.promise;
				}]
			}
		}).otherwise({
			redirectTo: '/'
		});

		var $window = $windowProvider.$get();
		var url = $window.location.href;
		var baseUrl = url.split('index.php')[0] + 'index.php/apps/calendar';
		RestangularProvider.setBaseUrl(baseUrl);
	}
]).run(['$rootScope', '$location', 'CalendarModel',
	function ($rootScope, $location, CalendarModel) {

	$rootScope.$on('$routeChangeError', function () {
		var calendars = CalendarModel.getAll();

		if (calendars.length > 0) {

			var calendar = calendars[calendars.length-1];
			$location.path('/' + calendar.id);
		} else {
			$location.path('/');
		}
	});
}]);
