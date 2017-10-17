var app = angular.module('app', [
  'ngTouch', 'ui.grid',
  'ui.grid.pagination',
  'ui.bootstrap',
  'ngSanitize', 'ui.select']);

app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.edit = function (row) {
    //Get the index of selected row from row object
    var index = $scope.gridOptions.data.indexOf(row);
    //Use that to set the editrow attrbute value for seleted rows
    $scope.gridOptions.data[index].editrow = !$scope.gridOptions.data[index].editrow;
    $scope.gridOptions.data[index].workflows = $scope.workflows;
  };

  //Method to cancel the edit mode in UIGrid
  $scope.cancelEdit = function (row) {
    //Get the index of selected row from row object
    var index = $scope.gridOptions.data.indexOf(row);
    //Use that to set the editrow attrbute value to false
    $scope.gridOptions.data[index].editrow = false;
    //Display Successfull message after save
    $scope.alerts.push({
      msg: 'Row editing cancelled',
      type: 'info'
    });
  };

  $scope.saveRow = function (row) {
    //get the index of selected row 
    var index = $scope.gridOptions.data.indexOf(row);
    //Remove the edit mode when user click on Save button
    $scope.gridOptions.data[index].editrow = false;

    //Assign the updated value to Customer object
    $scope.Customer.customerID = row.CustomerID;
    $scope.Customer.companyName = row.CompanyName;
    $scope.Customer.contactName = row.ContactName;
    $scope.Customer.contactTitle = row.ContactTitle;

    //Call the function to save the data to database
    CustomerService.SaveCustomer($scope).then(function (d) {
      //Display Successfull message after save
      $scope.alerts.push({
        msg: 'Data saved successfully',
        type: 'success'
      });
    }, function (d) {
      //Display Error message if any error occurs
      $scope.alerts.push({
        msg: d.data,
        type: 'danger'
      });
    });
  };
  var selectBox = '<ui-select ng-model="MODEL_COL_FIELD" theme="selectize" style="width: 300px;" title="Choose a country" append-to-body="true">'
    + '<ui-select-match placeholder="Select or search a workflow in the list...">'
    + '{{$select.selected.name}}</ui-select-match>'
    + ' <ui-select-choices repeat="country.name as country in row.entity.workflows | filter: $select.search">'
    + '  <span ng-bind-html="country.name | highlight: $select.search"></span>'
    + '</ui-select-choices>'
    + '</ui-select>';

  var editCellTemplate = 
    
    '<div style="margin-left:4px;"  ng-if="!row.entity.editrow">'
    + '{{COL_FIELD}}</div>'
    + '<div ng-if="row.entity.editrow">'
    + selectBox;

  //<select style="height:30px;width:180px;" ng-options="workflow.name as workflow.name for workflow in row.entity.workflows" ng-model="MODEL_COL_FIELD"></select></div>'
  $scope.gridOptions = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    columnDefs: [{
      name: 'exceptionDefinitionName',
      displayName: "Exception Definition ",
      field: "exceptionDefinitionName",
      width: 400
    }, {
      name: "workflowDefinitionName",
      displayName: "Workflow Definition",
      field: "workflowDefinitionName",
      cellTemplate: editCellTemplate,
      width: 400
    }, {
      name: 'Actions',
      field: 'edit',
      enableFiltering: false,
      enableSorting: false,
      cellTemplate: '<div><button ng-show="!row.entity.editrow" class="btn primary" ng-click="grid.appScope.edit(row.entity)"><span class="glyphicon glyphicon-edit"></i></button>' + //Edit Button
      '<button ng-show="row.entity.editrow" class="btn primary" ng-click="grid.appScope.saveRow(row.entity)"><i class="fa fa-floppy-o"></i></button>' + //Save Button
      '<button ng-show="row.entity.editrow" class="btn primary" ng-click="grid.appScope.cancelEdit(row.entity)"><i class="fa fa-times"></i></button>' + //Cancel Button
      '</div>',
      width: 100
    }]
  };



  $http.get('wf-assignment.json')
    .success(function (data) {
      $scope.gridOptions.data = data;

    });

  $http.get('workflows.json')
    .success(function (data) {
      $scope.workflows = data;
    });


}]);