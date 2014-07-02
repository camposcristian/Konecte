angular.module('konecte.controllers', [])

.controller('AppCtrl', function($scope) {
})

.controller('LoginCtrl', function ($scope, $state, AuthService, $ionicLoading) {

    $scope.submit = function (user) {
        user.type = 'Personal';
        $scope.loadingIndicator = $ionicLoading.show({
            content: '<i class="icon ion-loading-c"></i><br/>Cargando',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });
        var promise = AuthService.login(user);
        promise.then(function (result) {
            $scope.loadingIndicator.hide();
            var tipo = result.usuario.tipo_usuario;
            switch (tipo) {
                case 'Profesor':
                    $state.transitionTo("profesor.courses");
                    break;
                case 'Personal':
                    alert("El rol de Personal no posee acceso a la aplicación");
                    //$state.transitionTo("personal.courses");
                    break;
                case 'Director':
                    $state.transitionTo("director.courses");
                    break;
                case 'Alumno':
                    $state.transitionTo("alumno.subjects");
                    break;
                case 'Padre':
                    $state.transitionTo("padre.students");
                    break;
                default:

            }
        })
        //$http.post('http://posttestserver.com/post.php?dir=jsfiddle', JSON.stringify(data)).success(function () {/*success callback*/ });

    };
})

.controller('CoursesCtrl', function ($scope, Courses) {
    Courses.all().success(function (list) {
        $scope.courses = list.cursos.rows;
    });
})

.controller('CourseDetailCtrl', function ($scope, $stateParams, Courses, Subjects, Students) {
    Courses.get($stateParams.courseId).success(function (course) {
        $scope.course = course[$stateParams.courseId];
    });

    Subjects.all($stateParams.courseId).success(function (list) {
        $scope.subjects = list.materias.rows;;
    });
    Students.all($stateParams.courseId).success(function (list) {
        $scope.students = list.alumnos.rows;
    });
})

.controller('SubjectDetailCtrl', function ($scope, $stateParams, Subjects) {
    Subjects.get($stateParams.subjectId).success(function (subject) {
        $scope.subject = subject.materia;
    });
})

.controller('StudentDetailCtrl', function ($scope, $stateParams, Students) {
    Students.get($stateParams.studentId).success(function (student) {
        $scope.student = student.alumno;
    });
    Inasistances.get($stateParams.studentId).success(function (inasistance) {
        $scope.inasistances = inasistance.inasistencias;
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
    Students.all().success(function (list) {
        $scope.students = list.alumnos.rows;
    });
})

.controller('SubjectsCtrl', function ($scope, Subjects) {
    Subjects.all().success(function (subjects) {
        $scope.subjects = subjects.materias.rows;
    });
})

.controller('SubjectsPendCtrl', function ($scope, Subjects) {
    Subjects.getPend().success(function (subjects) {
        $scope.subjects = subjects.materias.rows;
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