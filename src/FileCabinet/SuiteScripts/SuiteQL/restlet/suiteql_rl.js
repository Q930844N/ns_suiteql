/**
 * @author Abdul Qadeer Mangrio
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope Public
 */

var define;

define(['N/log', 'N/query', 'N/runtime'], function (log, query, runtime) {

  /**
   *
   * @param {*} request
   */

  const post = (request) => {
    log.audit({ title: 'Execution Start Time', details: new Date() });
    const start = new Date();

    let response = {
      data: []
    };
    let type = request.type || 'single';

    log.debug({ title: 'request', details: request });

    const scriptObj = runtime.getCurrentScript();
    log.debug('Total governnce unit: ' + scriptObj.getRemainingUsage());
    const totalGU = scriptObj.getRemainingUsage();

    try {

      if ((typeof request.sql == 'undefined') || (request.sql === null) || (request.sql == '')) {
        throw { 'type': 'error.SuiteAPIError', 'name': 'INVALID_REQUEST', 'message': 'No query was specified.' }
      }

      if (type === 'single') {
        // return query.runSuiteQL(request['sql']).asMappedResults();
        const result = query.runSuiteQL(request.sql).asMappedResults();
        response.data = result;
      } else {
        const qryPagedResults = query.runSuiteQLPaged({ query: request['sql'], pageSize: 1000 });
        for (let i = 0; i < qryPagedResults.pageRanges.length; i++) {
          const currentPage = qryPagedResults.fetch(i);
          const results = currentPage.data.results;
          results.forEach(function (result) {
            response.data.push(result)
          });
        }
      }


    } catch (e) {
      log.debug({ 'title': 'error', 'details': e });
      return { 'error': { 'type': e.type, 'name': e.name, 'message': e.message } }
    }
    log.debug('Remaining governance units: ' + scriptObj.getRemainingUsage());
    const remainingGU = scriptObj.getRemainingUsage();

    log.audit({ title: 'Execution End Time', details: new Date() });
    const end = new Date();
    const dif = end.getTime() - start.getTime();
    response.count = response.data.length;
    response.time_taken_in_seconds = dif / 1000;
    response.governace_units_consumed = totalGU - remainingGU;

    return response;

  };


  const get = (request) => {

  };

  return {
    get: get,
    post: post
  };

});