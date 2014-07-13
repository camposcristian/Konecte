angular.module('konecte.controllers', [])

.controller('AppCtrl', function ($scope) {
})

.controller('LoginCtrl', function ($scope, $rootScope, $state, AuthService, $ionicLoading, Institutions) {

    $scope.submit = function (user) {
        $rootScope.loadingIndicator = $ionicLoading.show({
            content: '<i class="icon ion-loading-c"></i><br/>Cargando',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });

        var promise = AuthService.login(user);
        promise.then(function (result) {
            $rootScope.loadingIndicator.hide();
            localStorage.img = result.perfil.imagen;
            localStorage.img_url = result.perfil.imagen_url;
            var user = result.usuario.perfil_id
            $rootScope.user = user;
            var tipo = result.usuario.tipo_usuario;
            localStorage.user = user;

            Institutions.getImg(result.usuario.colegio_id).then(function (result) {
                localStorage.logo = result.data.colegio.logo;
                localStorage.logo_url = result.data.colegio.logo_url;
                switch (tipo) {
                    case 'Profesor':
                        $state.transitionTo("profesor.courses", { teacherId: user });
                        break;
                    case 'Personal':
                        alert("El rol de Personal no posee acceso a la aplicacion");
                        break;
                    case 'Director':
                        $state.transitionTo("director.courses");
                        break;
                    case 'Alumno':
                        $state.transitionTo("alumno.subjects", { studentId: user });
                        break;
                    case 'Padre':
                        $state.transitionTo("padre.students", { fatherId: user });
                        break;
                    default:
                }
            });
        })

    };
})

.controller('CoursesCtrl', function ($scope, Courses, $rootScope) {
    $scope.url = '#/director/curso/';
    $rootScope.loadingIndicator.show();
    Courses.all().success(function (list) {
        $rootScope.loadingIndicator.hide();
        $scope.courses = list.cursos.rows;
    });
})

.controller('CoursesPerTeacherCtrl', function ($scope, Courses) {

    Courses.all({ profesor_id: localStorage.user }).success(function (list) {
        $scope.url = window.location.hash.slice(0, -1) + '/';

        $scope.courses = list.cursos.rows;
    });
})

.controller('CoursesPerStudentCtrl', function ($scope, Courses) {
    Courses.all({ profesor_id: localStorage.user }).success(function (list) {
        $scope.courses = list.cursos.rows;
    });
})

.controller('CourseDetailCtrl', function ($scope, $stateParams, Courses, Subjects, Students, $rootScope) {
    var url = window.location.hash.split("/");
    $scope.url = url[0] + url[1];
    $rootScope.loadingIndicator.show();

    Courses.get($stateParams.courseId).success(function (course) {
        $scope.course = course[$stateParams.courseId];
    });

    Subjects.all({ curso_id: $stateParams.courseId }).success(function (list) {
        $scope.subjects = list.materias.rows;;
    });

    Students.all({ curso_id: $stateParams.courseId }).success(function (list) {
        $rootScope.loadingIndicator.hide();
        $scope.students = list.alumnos.rows;
    });
})

.controller('SubjectDetailCtrl', function ($scope, $stateParams, Subjects, TeachersPerCourse, Materiales, $rootScope) {
    var url = window.location.hash.split("/");
    $scope.url = url[0] + url[1];
    $rootScope.loadingIndicator.show();
    Subjects.get($stateParams.subjectId).success(function (subject) {
        $scope.subject = subject.materia;
    });
    TeachersPerCourse.all({ materia_id: $stateParams.subjectId }).success(function (teachers) {
        $scope.teachers = teachers.cursos_materias_profesores.rows;
    });
    Materiales.all({ materia_id: $stateParams.subjectId }).success(function (content) {
        $scope.contents = content.materia_material.rows;
        $rootScope.loadingIndicator.hide();
    });
})

.controller('SubjectDetailPerTeacher', function ($scope, $stateParams, Subjects, TeachersPerCourse, Materiales, EvaluationResults, $rootScope) {
    var url = window.location.hash.split("/");
    $scope.url = url[0] + url[1];
    $rootScope.loadingIndicator.show();
    Subjects.get($stateParams.subjectId).success(function (subject) {
        $scope.subject = subject.materia;
    });
    EvaluationResults.all({ materia_id: $stateParams.subjectId }).success(function (inasistance) {
        $scope.evaluations = inasistance.notas.rows;
        var prom = 0;
        for (var i = 0; i < inasistance.notas.q_result; i++) {
            prom += parseInt(inasistance.notas.rows[i].nota);
        }
        $scope.prom = (prom / inasistance.notas.q_result).toFixed(2);
    });
    TeachersPerCourse.all({ materia_id: $stateParams.subjectId }).success(function (teachers) {
        $scope.teachers = teachers.cursos_materias_profesores.rows;
    });
    Materiales.all({ materia_id: $stateParams.subjectId }).success(function (content) {
        $scope.contents = content.materia_material.rows;
        $rootScope.loadingIndicator.hide();
    });
})

.controller('CalendarCtrl', function ($scope, $stateParams, Evaluations) {
    Evaluations.all({ materia_id: $stateParams.subjectId }).success(function (evaluations) {
        $scope.evaluations = evaluations.evaluaciones.rows;
    });
})

.controller('StudentDetailCtrl', function ($scope, $stateParams, Students, Inasistances, EvaluationResults, Subjects, $rootScope) {
    var url = window.location.hash.split("/");
    $scope.url = url[0] + url[1];
    $rootScope.loadingIndicator.show();
    Students.get($stateParams.studentId).success(function (student) {
        $scope.student = student.alumno;
    });
    Inasistances.all({ alumno_id: $stateParams.studentId }).success(function (inasistance) {
        $scope.inasistances = inasistance.inasistencias.rows;
    });
    EvaluationResults.all({ alumno_id: $stateParams.studentId }).success(function (inasistance) {
        $scope.evaluations = inasistance.notas.rows;
    });
    Subjects.getPend({ alumno_id: $stateParams.studentId }).success(function (subjects) {
        $scope.subjectsPend = subjects.materias_pendientes.rows;
        $rootScope.loadingIndicator.hide();
    });
})

.controller('WorkerDetailCtrl', function ($scope, $stateParams, Workers) {
    Workers.get($stateParams.workerId).success(function (worker) {
        $scope.worker = worker.personal;
    });
})

.controller('TeacherDetailCtrl', function ($scope, $stateParams, Teachers) {
    Teachers.get($stateParams.teacherId).success(function (worker) {
        $scope.teacher = worker.profesor;
    });
})

.controller('StudentsCtrl', function ($scope, Students) {
    $scope.url = window.location.hash.slice(0, -1) + '/';

    Students.all().success(function (list) {
        $scope.students = list.alumnos.rows;
    });
})

.controller('StudentsPerTeacherCtrl', function ($scope, Students) {
    $scope.url = window.location.hash.slice(0, -1) + '/';
    Students.all({ profesor_id: localStorage.user }).success(function (list) {
        $scope.students = list.alumnos.rows;
    });
})

.controller('ChildsCtrl', function ($scope, Students, $stateParams) {
    $scope.url = '#/padre/alumno/';

    Students.all({ padre_id: $stateParams.fatherId }).success(function (list) {
        $scope.students = list.alumnos.rows;
    });
})

.controller('SubjectsCtrl', function ($scope, Subjects) {
    $scope.url = window.location.hash.slice(0, -1) + '/';

    Subjects.all().success(function (subjects) {
        $scope.subjects = subjects.materias.rows;
    });
})

.controller('SubjectsPerStudentCtrl', function ($scope, Subjects, $stateParams) {
    $scope.url = '#/alumno/materia';

    Subjects.all({ alumno_id: $stateParams.studentId }).success(function (subjects) {
        $scope.subjects = subjects.materias.rows;
    });
})

.controller('SubjectsPendCtrl', function ($scope, Subjects, $stateParams) {
    Subjects.getPend({ alumno_id: $stateParams.studentId }).success(function (subjects) {
        $scope.subjects = subjects.materias_pendientes.rows;
    });
})

.controller('WorkersCtrl', function ($scope, Workers) {

    Workers.all().success(function (workers) {
        $scope.workers = workers.personales.rows;
    });
})

.controller('TeachersCtrl', function ($scope, Teachers) {

    Teachers.all().success(function (teachers) {
        $scope.workers = teachers.profesores.rows;
    });
})