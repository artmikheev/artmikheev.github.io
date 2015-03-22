/**
 * Created by mikheev on 16.03.15.
 */


var matrixTemplates = [
    [[1]]
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
    self.godmode = ko.observable(false);
    self.isEditVisible = ko.observable(false);

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
        for(i=0; i<dimension; i++) {
            tedit.push(matrix[i].join("\t"));
        }

        self.editmatrix(tedit.join("\n"));
    };

    self.initMatrix(matrixTemplates[0]);

    self.toggleEditVisibilityText = ko.computed(function() {
       if(ko.unwrap(self.isEditVisible)) {
           return "Спрятать";
       }
        else {
           return "Задать матрицу";
       }
    });

    self.toggleEditVisibility = function() {
        self.isEditVisible(!ko.unwrap(self.isEditVisible));
    };

    // calculate next row if now we in current
    var calculateNext = function(currentLine) {
        var randomFloat = Math.random();
        var matrix = self.matrix();
        var dimension = matrix.length;

        var partialSum=0;
        for(var i=0; i<dimension; i++) {
            partialSum+=parseFloat(matrix[i][currentLine]);
            if(randomFloat <= partialSum) {
                return i;
            }
        }

    };

    self.next = function(cnt) {
        if(cnt==undefined) cnt=1;
        var currentLine = self.current()-1;
        var i;
        var occ  = [];
        var occurrence = ko.unwrap(self.occurrence);
        for(i=0; i<occurrence.length; i++) {
            occ.push(ko.unwrap(occurrence[i].occurrence));
        }
        for(i=0; i<cnt; i++) {
            currentLine = calculateNext(currentLine);
            occ[currentLine]++;
        }
        for(i=0; i<occurrence.length; i++) {
            occurrence[i].occurrence(occ[i]);
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

    self.resultVector = ko.computed(function() {
        var occurence = self.occurrence();
        var result=[];
        for(var i=0; i<occurence.length; i++) {
            result.push(ko.unwrap(occurence[i].distribution));
        }
        return result;
    });

    function vectorView(vector) {
        var result = "{";
        for(var i=0; i<vector.length-1; i++) {
            result+=parseFloat(vector[i]).toFixed(3) + ",";
        }
        result+=parseFloat(vector[i]).toFixed(3) + "}";
        return result;
    }

    function matrixView(matrix) {
        var result = "{";
        for(var i=0; i<matrix.length-1; i++) {
            result+=vectorView(matrix[i]) + ",";
        }
        result+=vectorView(matrix[i]) + "}";
        return result;
    }

    function matrixVectorMultiplication(matrix, vector) {
        var resultVector = [];
        var dimension = matrix.length;
        var i, j;
        var cell;

        for(i=0; i<dimension; i++) {
            cell=0;
            for(j=0; j<dimension; j++) {
                cell+=parseFloat(matrix[i][j])*parseFloat(vector[j]);
            }
            resultVector.push(parseFloat(cell).toFixed(3));
        }

        return resultVector;
    }

    self.multiplicationResult = ko.computed(function() {
       return matrixVectorMultiplication(ko.unwrap(self.matrix), ko.unwrap(self.resultVector));
    });

    self.wolframView = ko.computed(function() {
        var matrix = self.matrix();
        return matrixView(matrix) + "   *   " + vectorView(ko.unwrap(self.resultVector));
    });

    var eggstatus=ko.observable(0);

    self.egg1 = function() {
        var s = ko.unwrap(eggstatus);
        if(s==0) eggstatus(1);
        else {
            if(s==2) eggstatus(3);
            else {
                eggstatus(0);
            }
        }

    };

    self.egg2 = function() {
        var s = ko.unwrap(eggstatus);
        if(s==3) {
            self.godmode(!ko.unwrap(self.godmode));
        }
        eggstatus(0);

    };

    self.egg3 = function() {
        var s = ko.unwrap(eggstatus);
        if(s==1) eggstatus(2);
        else {
            eggstatus(0);
        }
    };



};

var viewModel;

$(function() {
    viewModel = new ViewModel();
    ko.applyBindings(viewModel);
});