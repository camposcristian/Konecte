// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('konecte', ['ionic', 'konecte.controllers', 'konecte.services'])

.run(function ($ionicPlatform, $rootScope, $state, AuthService, $ionicLoading) {
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
    $rootScope.localStorage = localStorage;
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
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
          templateUrl: "templates/menu/menu_director.html",
          controller: 'AppCtrl'
      })

      .state('director.students', {
          url: '/alumnos',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/student/students.html',
                  controller: 'StudentsCtrl'
              }
          }
      })

      .state('director.student-detail', {
          url: '/alumno/:studentId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/student/student.html',
                  controller: 'StudentDetailCtrl'
              }
          }
      })

      .state('director.workers', {
          url: '/personal',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/worker/workers.html',
                  controller: 'WorkersCtrl'
              }
          }
      })

    .state('director.worker-detail', {
        url: '/personal/:workerId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/worker/worker.html',
                controller: 'WorkerDetailCtrl'
            }
        }
    })

        .state('director.teachers', {
            url: '/profesores',
            authenticate: true,
            views: {
                'menuContent': {
                    templateUrl: 'templates/teacher/teachers.html',
                    controller: 'TeachersCtrl'
                }
            }
        })

        .state('director.teacher-detail', {
            url: '/profesor/:teacherId',
            authenticate: true,
            views: {
                'menuContent': {
                    templateUrl: 'templates/teacher/teacher.html',
                    controller: 'TeacherDetailCtrl'
                }
            }
        })
      .state('director.courses', {
          url: '/cursos',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/course/courses.html',
                  controller: 'CoursesCtrl'
              }
          }
      })

      .state('director.course-detail', {
          url: '/curso/:courseId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/course/course.html',
                  controller: 'CourseDetailCtrl'
              }
          }
      })

      .state('director.subject-detail', {
          url: '/materia/:subjectId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/subject/subject.html',
                  controller: 'SubjectDetail'
              }
          }
      })
      .state('director.calendar', {
          url: '/calendar/:subjectId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/calendar/calendar.html',
                  controller: 'CalendarCtrl'
              }
          }
      })


//#endregion

    //#region Profesor
      .state('profesor', {
          url: "/profesor",
          abstract: true,
          templateUrl: "templates/menu/menu_profesor.html",
      })

      .state('profesor.students', {
          url: '/alumnos',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/student/students.html',
                  controller: 'StudentsPerTeacherCtrl'
              }
          }
      })

      .state('profesor.subjects', {
          url: '/materias',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/subject/subjects.html',
                  controller: 'SubjectsCtrl'
              }
          }
      })

    .state('profesor.courses', {
        url: '/cursos',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/course/courses.html',
                controller: 'CoursesPerTeacherCtrl'
            }
        }
    })

    .state('profesor.course-detail', {
        url: '/curso/:courseId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/course/course.html',
                controller: 'CourseDetailCtrl'
            }
        }
    })
    .state('profesor.student-detail', {
        url: '/alumno/:studentId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/student/student.html',
                controller: 'StudentDetailCtrl'
            }
        }
    })

      .state('profesor.subject-detail', {
          url: '/materia/:subjectId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/subject/subject_teacher.html',
                  controller: 'SubjectDetailPerTeacher'
              }
          }
      })

      .state('profesor.calendar', {
          url: '/calendar/:subjectId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/calendar/calendar.html',
                  controller: 'CalendarCtrl'
              }
          }
      })
    //#endregion

    //#region Alumno
    .state('alumno', {
        url: "/alumno",
        abstract: true,
        templateUrl: "templates/menu/menu_alumno.html",
    })
    .state('alumno.student-detail', {
        url: '/alumno/:studentId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/student/student.html',
                controller: 'StudentDetailCtrl'
            }
        }
    })
    .state('alumno.subjects', {
        url: '/materias/:studentId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/subject/subjects.html',
                controller: 'SubjectsPerStudentCtrl'
            }
        }
    })
    .state('alumno.subjectspend', {
        url: '/materiaspend/:studentId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/subject/subjectspend.html',
                controller: 'SubjectsPendCtrl'
            }
        }
    })

    .state('alumno.subject-detail', {
        url: '/materia/:subjectId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/subject/subject.html',
                controller: 'SubjectDetailCtrl'
            }
        }
    })
      .state('alumno.calendar', {
          url: '/calendar/:subjectId',
          authenticate: true,
          views: {
              'menuContent': {
                  templateUrl: 'templates/calendar/calendar.html',
                  controller: 'CalendarCtrl'
              }
          }
      })
//#endregion

    //#region Padres
        .state('padre', {
            url: "/padre",
            abstract: true,
            templateUrl: "templates/menu/menu_padre.html",
        })
    .state('padre.subjects', {
        url: '/materias',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/subject/subjects.html',
                controller: 'SubjectsCtrl'
            }
        }
    })

    .state('padre.students', {
        url: '/alumnos/:fatherId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/student/students.html',
                controller: 'ChildsCtrl'
            }
        }
    })
    .state('padre.student', {
        url: '/alumno/:studentId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/student/student.html',
                controller: 'StudentDetailCtrl'
            }
        }
    })

    .state('padre.subjectspend', {
        url: '/materiaspend',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/subject/subjectspend.html',
                controller: 'SubjectsPendCtrl'
            }
        }
    })
    .state('padre.subject-detail', {
        url: '/materia/:subjectId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/subject/subject.html',
                controller: 'SubjectDetailCtrl'
            }
        }
    })

    .state('padre.calendar', {
        url: '/calendar/:subjectId',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/calendar/calendar.html',
                controller: 'CalendarCtrl'
            }
        }
    })
    //#endregion





    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});

