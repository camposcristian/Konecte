angular.module('konecte.services', [])


/**
 * A simple example service that returns some data.
 */
.factory('BaseUrl', function () {
    return 'http://api.konecte.ridelnik.com';
})

.factory('Courses', function (BaseUrl, $http) {

    return {
        all: function () {
            return $http.post(BaseUrl + '/cursos/get')
        },
        get: function (id) {
            return $http.post(BaseUrl + '/cursos/get/' + id)
        }
    }
})

.factory('Teachers', function (BaseUrl, $http) {

    return {
        all: function () {
            return $http.post(BaseUrl + '/profesores/get')
        },
        get: function (id) {
            return $http.post(BaseUrl + '/profesores/get/'+id)
        }
    }
})

.factory('Students', function (BaseUrl, $http) {

    return {
        all: function (id) {
            if (id) {
                return $http.post(BaseUrl + '/alumnos/get', {curso_id: id})
            }
            else {
                return $http.post(BaseUrl + '/alumnos/get')

            }
        },
        get: function (id) {
            return $http.post(BaseUrl + '/alumnos/get/'+id)
        }
    }
})

.factory('Workers', function (BaseUrl, $http) {

    return {
        all: function (id) {
            if (id) {
                return $http.post(BaseUrl + '/personales/get', { curso_id: id })
            }
            else {
                return $http.post(BaseUrl + '/personales/get')

            }
        },
        get: function (id) {
            return $http.post(BaseUrl + '/personales/get/' + id)
        }
    }
})

.factory('Subjects', function (BaseUrl, $http) {

    return {
        all: function (id) {
            if (id) {
                return $http.post(BaseUrl + '/materias/get', { curso_id: id })
            }
            else {
                return $http.post(BaseUrl + '/materias/get')

            }
        },
        getPend: function () {
            return $http.post(BaseUrl + '/materias/get/')
        },
        get: function (id) {
            return $http.post(BaseUrl + '/materias/get/'+id)
        }
    }
})

.factory('AuthService', function (BaseUrl, $http, $q) {

    //var baseurl = 'http://api.konecte.ridelnik.com';
    var guid = localStorage["guid"];
    var token = localStorage["token"];

    if (guid && token) {
        $http.defaults.headers.common =
            {
                "X-KONECTE-APPNAME": "KonecteMobile",
                "X-KONECTE-GUID": guid,
                "X-KONECTE-TOKEN": token
            };
    }
    var login = function (user) {


        function success(response) {
            if (response.errores.length === 0) {
                token = response["x-konecte-token"];
                localStorage["token"] = token;

                var header = {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-KONECTE-APPNAME": "KonecteMobile",
                    "X-KONECTE-GUID": guid,
                    "X-KONECTE-TOKEN": token
                };

                $http.defaults.headers.common = header;

                $http.post(BaseUrl + "/check_session").success(function (result) {
                    deferred.resolve(result);
                })
            }
        }

        var deferred = $q.defer();

        if (localStorage["guid"]) {
            var header = {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-KONECTE-APPNAME": "KonecteMobile",
                "X-KONECTE-GUID": localStorage["guid"],
                "X-KONECTE-TOKEN": ''
            };
            $http.post(BaseUrl + "/login", user, { headers: header }).success(success)
        }
        else {
            getGuid().then(function (guid) {

                var header = {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-KONECTE-APPNAME": "KonecteMobile",
                    "X-KONECTE-GUID": guid,
                    "X-KONECTE-TOKEN": ""
                }
                $http.post(BaseUrl + "/login", user, { headers: header }).success(success)

            }
        )
        }

        return deferred.promise;
    }


    var getGuid = function () {
        var deferred = $q.defer();

        var header = {
            "X-KONECTE-APPNAME": "KonecteMobile",
            "X-KONECTE-GUID": "",
            "X-KONECTE-TOKEN": ""
        };
        $http.get(BaseUrl + "/get_auth", { headers: header }).then(function (response) {
            if (response.data.errores.length === 0) {
                guid = response.data["x-konecte-guid"];
                localStorage["guid"] = guid
                deferred.resolve(guid);

            }
        });
        return deferred.promise;

    }

    return {
        isAuthenticated: function () {
            return localStorage["token"];
        },

        getGuid: getGuid,

        login: login
    }
});
