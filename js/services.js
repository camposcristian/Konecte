angular.module('konecte.services', ['ionic'])

.factory('authHttpResponseInterceptor', ['$q', '$location', '$rootScope', '$injector', function ($q, $location, $rootScope, $injector) {
    return {
        response: function (response) {
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401", rejection);
                $rootScope.loadingIndicator.hide();
                $injector.get("$ionicLoading").show({
                    content: rejection.data.errores[0],
                    animation: 'fade-in',
                    showBackdrop: false,
                    duration: 2000
                });
            }
            return $q.reject(rejection);
        }
    }
}])

.factory('BaseUrl', function () {
    return 'http://api.konecte.ridelnik.com';
})

.factory('Courses', function (BaseUrl, $http) {

    return {
        all: function (teacherId) {
            return $http.post(BaseUrl + '/cursos/get', teacherId)
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
            return $http.post(BaseUrl + '/profesores/get/' + id)
        }
    }
})

.factory('TeachersPerCourse', function (BaseUrl, $http) {

    return {
        all: function (subjectId) {
            return $http.post(BaseUrl + '/cursos_materias_profesores/get', subjectId)
        }
    }
})


.factory('Evaluations', function (BaseUrl, $http) {

    return {
        all: function (subjectId) {
            return $http.post(BaseUrl + '/evaluaciones/get', subjectId)
        }
    }
})

.factory('EvaluationResults', function (BaseUrl, $http) {

    return {
        all: function (studentId) {
            return $http.post(BaseUrl + '/notas/get', studentId)
        }
    }
})

.factory('Materiales', function (BaseUrl, $http) {

    return {
        all: function (subjectId) {
            return $http.post(BaseUrl + '/materias_materiales/get', subjectId)
        }
    }
})

.factory('Institutions', function (BaseUrl, $http) {

    return {
        getImg: function (schoolId) {
            return $http.post(BaseUrl + '/colegios/get/' + schoolId);
        }
    }
})

.factory('Students', function (BaseUrl, $http) {

    return {
        all: function (id) {
            if (id) {
                return $http.post(BaseUrl + '/alumnos/get', id)
            }
            else {
                return $http.post(BaseUrl + '/alumnos/get')

            }
        },
        get: function (id) {
            return $http.post(BaseUrl + '/alumnos/get/' + id)
        }
    }
})

.factory('Inasistances', function (BaseUrl, $http) {

    return {
        all: function (id) {
            if (id) {
                return $http.post(BaseUrl + '/inasistencias/get', id)
            }
            else {
                return $http.post(BaseUrl + '/inasistencias/get')

            }
        },
        get: function (id) {
            return $http.post(BaseUrl + '/inasistencias/get/' + id)
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
                return $http.post(BaseUrl + '/materias/get', id)
            }
            else {
                return $http.post(BaseUrl + '/materias/get')

            }
        },
        getPend: function (studentId) {
            return $http.post(BaseUrl + '/materias_pendientes/get/', studentId)
        },
        get: function (id) {
            return $http.post(BaseUrl + '/materias/get/' + id)
        }
    }
})

.factory('AuthService', function (BaseUrl, $http, $q) {

    var guid = localStorage["guid"];
    var token = localStorage["token"];

    if (guid && token) {
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        $http.defaults.headers.common =
            {
                "X-KONECTE-APPNAME": "KonecteMobile",
                "X-KONECTE-GUID": guid,
                "X-KONECTE-TOKEN": token,
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
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
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
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
