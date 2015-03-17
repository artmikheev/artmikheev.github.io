/**
 * Created by mikheev on 16.03.15.
 */


var matrixTemplates = [
    [
        [0.1, 0.3, 0.6],
        [0.3, 0.5, 0.2],
        [0.6, 0.2, 0.2]
    ]
]; // Need to update

function OccurrenceModel(initialValue, total) {
    var self = this;
    self.total = total; // total is observable of total iteration count
    self.occurrence = ko.observable(initialValue);
    self.distribution = ko.computed(function() {
        var total = ko.unwrap(self.total);
        if(total==0) return 0;
        return (ko.unwrap(self.occurrence)/total).toFixed(3); // return rounded value
    }, self);
}


var ViewModel = function() {
    var self = this;
    self.matrixTemplates = matrixTemplates;
    self.matrix = ko.observable();
    self.current = ko.observable(1);
    self.totalCount = ko.observable(0);
    self.occurrence = ko.observableArray([]);
    self.editmatrix = ko.observable("");

    self.initMatrix = function(matrix) {
        self.matrix(matrix);
        self.current(1);
        self.totalCount(0);
        var dimension = matrix.length;
        self.occurrence.removeAll();
        for(var i=0; i<dimension; i++) {
            var z = new OccurrenceModel(0, self.totalCount);
            self.occurrence.push(z);
        }

        var tedit = [];
        for(var i=0; i<dimension; i++) {
            tedit.push(matrix[i].join("\t"));
        }

        self.editmatrix(tedit.join("\n"));
    };

    self.initMatrix(matrixTemplates[0]);


    // calculate next row if now we in current
    var calculateNext = function(currentLine) {
        var randomFloat = Math.random();
        var matrix = self.matrix();
        var dimension = matrix.length;

        var partialSum=0;
        for(var i=0; i<dimension; i++) {
            partialSum+=parseFloat(matrix[currentLine][i]);
            if(randomFloat <= partialSum) {
                return i;
            }
        }

    };

    self.next = function(cnt) {
        if(cnt==undefined) cnt=1;
        var currentLine = self.current()-1;
        for(var i=0; i<cnt; i++) {
            currentLine = calculateNext(currentLine);
            var t = self.occurrence()[currentLine].occurrence;
            t(ko.unwrap(t)+1);
        }
        self.current(currentLine+1);
        self.totalCount(ko.unwrap(self.totalCount)+cnt);
    };

    self.readMatrix = function() {
        var matrix=[];
        var nmatrix = ko.unwrap(self.editmatrix).trim().split("\n");
        for(var i=0; i<nmatrix.length; i++) {
            var z=nmatrix[i].trim().split(/\s+/);
            matrix.push(z);
        }
        self.initMatrix(matrix);
    };



};

var viewModel;

$(function() {
    viewModel = new ViewModel();
    ko.applyBindings(viewModel);
});