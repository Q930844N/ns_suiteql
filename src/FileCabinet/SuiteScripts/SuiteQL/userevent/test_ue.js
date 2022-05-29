/**
 * @author Abdul Qadeer Mangrio
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 *
 */

define(['N/log', 'N/record', 'N/search', 'N/query'], (log, record, search, query) => {

  const afterSubmit = (context) => {
    const { type, newRecord, UserEventType } = context;
    const qry = 'select id from employee where firstname = ? and lastname = ?';
    const params = ['Abdul', 'Mangrio'];
    const result = query.runSuiteQL({ query: qry, params: params }).asMappedResults();
    log.debug({ title: 'result', details: result });

    const orderRec = record.load({
      type: newRecord.type,
      id: newRecord.id
    });

    orderRec.setValue({ fieldId: 'otherrefnum', value: result[0].id });
    orderRec.save();
  };

  return {
    afterSubmit,
  };
});
