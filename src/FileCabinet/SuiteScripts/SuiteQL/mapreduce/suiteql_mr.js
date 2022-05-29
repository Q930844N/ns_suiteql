/**
 *@author Abdul Qadeer Mangrio
 *@NApiVersion 2.1
 *@NModuleScope Public
 *@NScriptType MapReduceScript
 */


define(['N/log', 'N/file', 'N/record', 'N/search', 'N/runtime'],
  function (log, file, record, search, runtime) {

    const getInputData = () => {
      const data = search.load({
        id: 'customsearch_NAME_OF_SEARCH'
      });

      return data;
    }

    const map = (context) => {

      try {
        const result = JSON.parse(context.value);
      }
      catch (e) {
        log.debug({ title: 'error in catch', details: e });
      }
    }

    const summarize = (context) => {

    }

    return {
      getInputData: getInputData,
      map: map,
      summarize: summarize
    }

  });