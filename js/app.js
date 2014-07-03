// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('konecte', ['ionic', 'konecte.controllers', 'konecte.services'])

.run(function ($ionicPlatform, $rootScope, $state, AuthService) {
    $ionicPlatform.ready(function () {
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !AuthService.isAuthenticated()) {
            $state.transitionTo("login");
            event.preventDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.defaults.transformRequest = function (data) {
        var str = [];
        for (var p in data)
            if (data.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
            }
        return str.join("&");
    }

    $stateProvider
      .state("login", {
          url: "/login",
          templateUrl: "templates/login.html",
          controller: "LoginCtrl",
          authenticate: false
      })

    //#region Director
      .state('director', {
          url: "/director",
          abstract: true,
          templateUrl: "templates/director/menu.html",
          controller: 'AppCtrl'
      })

      .state('director.students', {
          url: '/alumnos',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/director/students.html',
                  controller: 'StudentsCtrl'
              }
          }
      })

      .state('director.student-detail', {
          url: '/alumno/:studentId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/director/student.html',
                  controller: 'StudentDetailCtrl'
              }
          }
      })

      .state('director.workers', {
          url: '/personal',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/director/workers.html',
                  controller: 'WorkersCtrl'
              }
          }
      })
        .state('director.teachers', {
          url: '/profesores',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/director/teachers.html',
                  controller: 'TeachersCtrl'
              }
          }
      })
      .state('director.courses', {
          url: '/cursos',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/director/courses.html',
                  controller: 'CoursesCtrl'
              }
          }
      })

      .state('director.course-detail', {
          url: '/curso/:courseId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/director/course.html',
                  controller: 'CourseDetailCtrl'
              }
          }
      })



      .state('director.student-detail1', {
          url: '/alumno1/:studentId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/director/student.html',
                  controller: 'StudentDetailCtrl'
              }
          }
      })

      .state('director.subject-detail', {
          url: '/materia/:subjectId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/director/subject.html',
                  controller: 'SubjectDetailCtrl'
              }
          }
      })

      .state('director.worker-detail', {
          url: '/personal/:workerId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/director/worker.html',
                  controller: 'WorkerDetailCtrl'
              }
          }
      })
        .state('director.teacher-detail', {
            url: '/profesor/:teacherId',
            authenticate: true,
            views: {
                'menuContent': {
                    templateUrl: 'templates/director/teacher.html',
                    controller: 'TeacherDetailCtrl'
                }
            }
        })
//#endregion

    //#region Profesor
      .state('profesor', {
          url: "/profesor",
          abstract: true,
          templateUrl: "templates/profesor/menu.html",
      })

      .state('profesor.students', {
          url: '/alumnos',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/profesor/students.html',
                  controller: 'StudentsCtrl'
              }
          }
      })

      .state('profesor.subjects', {
          url: '/materias',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/profesor/subjects.html',
                  controller: 'SubjectsCtrl'
              }
          }
      })

    .state('profesor.subjectspend', {
        url: '/materiaspend',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/profesor/subjectspend.html',
                controller: 'SubjectsPendCtrl'
            }
        }
    })

    .state('profesor.courses', {
        url: '/cursos',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/profesor/courses.html',
                controller: 'CoursesCtrl'
            }
        }
    })

    .state('profesor.course-detail', {
        url: '/curso/:courseId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/profesor/course.html',
                controller: 'CourseDetailCtrl'
            }
        }
    })
    .state('profesor.student-detail', {
        url: '/alumno/:studentId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/profesor/student.html',
                controller: 'StudentDetailCtrl'
            }
        }
    })

      .state('profesor.subject-detail', {
          url: '/materia/:subjectId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/profesor/subject.html',
                  controller: 'SubjectDetailCtrl'
              }
          }
      })
    //#endregion

    //#region Alumno
    .state('alumno', {
        url: "/alumno",
        abstract: true,
        templateUrl: "templates/alumno/menu.html",
    })

    .state('alumno.subjects', {
        url: '/materias',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/alumno/subjects.html',
                controller: 'SubjectsCtrl'
            }
        }
    })

    .state('alumno.subjectspend', {
        url: '/materiaspend',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/alumno/subjectspend.html',
                controller: 'SubjectsPendCtrl'
            }
        }
    })
    .state('alumno.subject-detail', {
        url: '/materia/:subjectId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/alumno/subject.html',
                controller: 'SubjectDetailCtrl'
            }
        }
    })
//#endregion

    //#region Padres
        .state('padre', {
            url: "/padre",
            abstract: true,
            templateUrl: "templates/padre/menu.html",
        })

    .state('padre.subjects', {
        url: '/materias',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/padre/subjects.html',
                controller: 'SubjectsCtrl'
            }
        }
    })

    .state('padre.students', {
        url: '/alumnos/:fatherId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/padre/students.html',
                controller: 'ChildsCtrl'
            }
        }
    })
    .state('padre.student', {
        url: '/alumno/:studentId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/padre/child.html',
                controller: 'ChildDetailCtrl'
            }
        }
    })

    .state('padre.subjectspend', {
        url: '/materiaspend',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/padre/subjectspend.html',
                controller: 'SubjectsPendCtrl'
            }
        }
    })
    .state('padre.subject-detail', {
        url: '/materia/:subjectId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/padre/subject.html',
                controller: 'SubjectDetailCtrl'
            }
        }
    })
    //#endregion





    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});

