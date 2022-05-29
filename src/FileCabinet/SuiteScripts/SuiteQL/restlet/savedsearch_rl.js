/**
 * @author Abdul Qadeer Mangrio
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope Public
 */


define(['N/log', 'N/search', 'N/runtime'], function (log, search, runtime) {

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
    log.debug({ title: 'Total governnce unit', details: scriptObj.getRemainingUsage() });
    const totalGU = scriptObj.getRemainingUsage();
    try {

      const searchObj = search.create({
        type: request.search_type,
        filters: request.filters || [],
        columns: request.columns || []
      });

      if (type === 'single') {
        let count = 0;
        searchObj.run().each(function (result) {
          count++;
          if (count == 4000) return false;
          response.data.push(result);
          return true;
        });
      } else {
        const myPagedData = searchObj.runPaged({ pageSize: 1000 });
        myPagedData.pageRanges.forEach(function (pageRange) {
          let myPage = myPagedData.fetch({ index: pageRange.index });
          let results = myPage.data;
          response.data = response.data.concat(results);
          // response.data.push(results[0]);
        });
      }

    } catch (e) {
      log.debug({ 'title': 'error', 'details': e });
      return { 'error': { 'type': e.type, 'name': e.name, 'message': e.message } }
    }
    log.debug({ title: 'Remaining governance units', details: scriptObj.getRemainingUsage() });
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