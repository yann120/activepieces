import {
  createAction,
  DynamicPropsValue,
  Property,
} from '@activepieces/pieces-framework';

import { airtableCommon } from '../common';
import { airtableAuth } from '../../index';

export const airtableUpdateRecordAction = createAction({
  auth: airtableAuth,
  name: 'airtable_update_record',
  displayName: 'Update Airtable Record',
  description: 'Update a record in airtable',
  props: {
    base: airtableCommon.base,
    tableId: airtableCommon.tableId,
    recordId: airtableCommon.recordId,
    fields: airtableCommon.fields,
  },
  async run(context) {
    const personalToken = context.auth;
    const { base: baseId, tableId, recordId, fields } = context.propsValue;

    const fieldsWithoutEmptyStrings: DynamicPropsValue = {};

    const isEmptyValue = (v: unknown): boolean =>
      v === '' ||
      v === null ||
      v === undefined ||
      (Array.isArray(v) && v.length === 0) ||
      (typeof v === 'object' && v !== null && Object.keys(v as Record<string, unknown>).length === 0);

    Object.keys(fields).forEach((k) => {
      if (!isEmptyValue(fields[k])) {
        fieldsWithoutEmptyStrings[k] = fields[k];
      }
    });
    const updatedFields: Record<string, unknown> =
      await airtableCommon.createNewFields(
        personalToken.secret_text,
        baseId,
        tableId as string,
        fieldsWithoutEmptyStrings
      );

    return await airtableCommon.updateRecord({
      personalToken: personalToken.secret_text,
      baseId: baseId as string,
      tableId: tableId as string,
      recordId: recordId as string,
      fields: updatedFields as Record<string, unknown>,
    });
  },
});
