/**
 *
 *
 *
 * @author Abdul Qadeer
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 *
 */

 define(['N/log', 'N/record', 'N/search'], (log, record, search) => {

    const afterSubmit = (context) => {
      const { type, newRecord, UserEventType } = context;
     // comments
    };
  
    return {
      afterSubmit,
    };
  });
  