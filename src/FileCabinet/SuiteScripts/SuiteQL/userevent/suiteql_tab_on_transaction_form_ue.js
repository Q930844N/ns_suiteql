/**
* @NApiVersion 2.1
* @NScriptType UserEventScript
* @NModuleScope Public
*/

/* 

------------------------------------------------------------------------------------------
Script Information
------------------------------------------------------------------------------------------

Name:
SuiteQL Tab

ID:
_suiteql_tab

Description
Adds a tab w/ query results to a transaction form.

Applies To
• Sales Order (_suiteql_tab_so)


------------------------------------------------------------------------------------------
MIT License
------------------------------------------------------------------------------------------

Copyright (c) 2022 Timothy Dietrich.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


------------------------------------------------------------------------------------------
Developer
------------------------------------------------------------------------------------------

Tim Dietrich
• timdietrich@me.com
• https://timdietrich.me


------------------------------------------------------------------------------------------
History
------------------------------------------------------------------------------------------

20220511 - Tim Dietrich
• Initial version.


*/

var log, query, serverWidget;
	
define( [ 'N/log', 'N/query', 'N/ui/serverWidget' ], main );

function main( logModule, queryModule, serverWidgetModule ) {

	log = logModule;
	query = queryModule;
	serverWidget = serverWidgetModule;
	
    return {    
    	beforeLoad: beforeLoad				        
    }          

}

function beforeLoad( context ) {
	
	if( context.type !== context.UserEventType.VIEW ) { return; }
	
	var suiteqlTab = context.form.addTab(
		{
			id : 'custpage_sql_tab',
			label : 'SuiteQL Tab'
		}
	);
	
	// context.form.insertTab(
	// 	{
	// 		tab: suiteqlTab,
	// 		nexttab:'items'
	// 	}
	// );	

	var suiteqlField = context.form.addField(
		{
			id: 'custpage_suiteql_field',
			type: serverWidget.FieldType.TEXT,
			label: 'SuiteQL Query Results',
			container: 'custpage_sql_tab'	
		}
	);	
	
	var records = sqlQueryRun();
		
	context.newRecord.setValue(
		{ 
			fieldId: 'custpage_suiteql_field', 
			value: sqlResultsTableGenerate( records )
		}
	);

}

function sqlQueryRun() {

	var sql= `	
		SELECT
			ID,
			LastName,
			FirstName,
			Phone,
			Email
		FROM
			Employee
		WHERE
			Email LIKE ?
		ORDER BY
			LastName,
			FirstName		
	`;
	
	return query.runSuiteQL( { query: sql, params: ['%folio3.com'] } ).asMappedResults();	

}

function sqlResultsTableGenerate( records ) {

	if ( records.length === 0 ) {	
		return '<div><p>No records were found.</p></div>';	
	}

	let thead = `
		<thead>
			<tr>
				<th>Last Name</th>			
				<th>First Name</th>
				<th>Email</th>
				<th>Phone #</th>
			</tr>
		</thead>`;	
		
		
	var tbody = '<tbody>';
	
		for ( r = 0; r < records.length; r++ ) {
	
			var record = records[r];

			tbody += `
				<tr>			
					<td>${record.lastname}</td>
					<td>${record.firstname}</td>
					<td><a href="mailto: ${record.email}">${record.email}</a></td>
					<td><a href="tel: ${record.phone}">${( record.phone || '' )}</a></td>
				</tr>`;	

		}	
	
	tbody += '</tbody>';	
	
	let stylesheet = `
		<style type = "text/css"> 
	
			/* Styled Table */
			/* https://dev.to/dcodeyt/creating-beautiful-html-tables-with-css-428l */
	
			.styled-table {
				border-collapse: collapse;
				margin: 25px 0;
				font-size: 0.9em;
				font-family: sans-serif;
				min-width: 400px;
				box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
				width: 100%;
			}			
	
			.styled-table th,
			.styled-table td {
				padding: 6px;
			}
	
			.styled-table thead tr {
				background-color: #607799;
				color: #ffffff;
				text-align: left;
			}			
	
			.styled-table tbody tr {
				border-bottom: thin solid #dddddd;
			}

			.styled-table tbody tr:nth-of-type(even) {
				background-color: #f3f3f3;
			}
	
			.styled-table tbody tr.active-row {
				font-weight: bold;
				color: #009879;
			}	
	
			.styled-table tbody tr:hover {
				background-color: #ffff99;
			}	
			
		</style>
	`;	
	
				
	return `
		
		${stylesheet}
	
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.25/css/jquery.dataTables.css">
		<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.js"></script>	
		
		<div style="margin-top: 6px; border: 1px solid #ccc; padding: 24px;">
	
			<table id="sqlResultsTable" class="styled-table" style="width: 100%;">
				${thead}
				${tbody}
			</table>
		
		</div>
		
		<script>
		
			window.jQuery = window.$ = jQuery;	
			
			$('#sqlResultsTable').DataTable( { "pageLength": 10, "lengthMenu": [ 10, 25, 50, 75, 100 ] } );
			
		</script>
	
	`;		

}