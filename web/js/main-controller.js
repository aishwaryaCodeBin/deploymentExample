/**
 * Created by manas on 04-06-2015.
 */
var skoolersApp = angular.module('skoolersApp', ['n3-line-chart']);

skoolersApp.controller('graphCtrl1', function ($scope) {
    $scope.data = [
        {
            x: 0,
            val_0: 0,
            val_1: 3,
            val_2: 0
        },
        {
            x: 1,
            val_0: 0.993,
            val_1: 3.894,
            val_2: 2
        },
        {
            x: 2,
            val_0: 1.947,
            val_1: 7.174,
            val_2: 2.981
        },
        {
            x: 3,
            val_0: 2.823,
            val_1: 9.32,
            val_2: 4.608
        },
        {
            x: 4,
            val_0: 3.587,
            val_1: 9.996,
            val_2: 4.132
        },
        {
            x: 5,
            val_0: 4.207,
            val_1: 11,
            val_2: 4.117
        },
        {
            x: 6,
            val_0: 4.66,
            val_1: 12,
            val_2: 4.638
        },
        {
            x: 7,
            val_0: 4,
            val_1: 13.35,
            val_2: 3.974
        },
        {
            x: 8,
            val_0: 4.998,
            val_1: 14,
            val_2: 4.942
        },
        {
            x: 9,
            val_0: 8,
            val_1: 14.425,
            val_2: 4.591
        },
        {
            x: 10,
            val_0: 10,
            val_1: 17.568,
            val_2: 4.191
        }
    ];

    $scope.options = {
        lineMode: "cardinal",
        series: [
            {
                y: "val_0",
                label: "Average",
                type: "area",
                striped: true,
                color: "#1f77b4"
            },
            {
                y: "val_1",
                label: "Chemistry",
                type: "area",
                striped: false,
                color: "#ff7f0e"
            },
            {
                y: "val_2",
                label: "Maths",
                type: "area",
                striped: false,
                color: "#2ca02c"
            }
        ]
    };
});

skoolersApp.controller('graphCtrl2', function($scope){
    $scope.data = [
        {
            x: 0,
            val_0: 2,
            val_1: 6,
            val_2: 2
        },
        {
            x: 1,
            val_0: 0.993,
            val_1: 3.894,
            val_2: 2
        },
        {
            x: 2,
            val_0: 1.947,
            val_1: 7.174,
            val_2: 2.981
        },
        {
            x: 3,
            val_0: 2.823,
            val_1: 4.32,
            val_2: 4.608
        },
        {
            x: 4,
            val_0: 3.587,
            val_1: 4.996,
            val_2: 4.132
        },
        {
            x: 5,
            val_0: 4.207,
            val_1: 5,
            val_2: 4.117
        },
        {
            x: 6,
            val_0: 4.66,
            val_1: 4,
            val_2: 4.638
        },
        {
            x: 7,
            val_0: 4,
            val_1: 3.35,
            val_2: 3.974
        },
        {
            x: 8,
            val_0: 3.998,
            val_1: 1,
            val_2: 4.942
        },
        {
            x: 9,
            val_0: 8,
            val_1: 2.425,
            val_2: 4.591
        },
        {
            x: 10,
            val_0: 10,
            val_1: 1.568,
            val_2: 4.191
        }
    ];

    $scope.options = {
        lineMode: "cardinal",
        series: [
            {
                y: "val_0",
                label: "Desired Progress",
                type: "area",
                color: "#bcbd22"
            },
            {
                y: "val_1",
                label: "Your Progress",
                type: "column",
                color: "red"
            },
            {y: "val_2", label: "General Trends", color: "#9467bd"}
        ]
    };
});