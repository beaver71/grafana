import React, { SyntheticEvent } from 'react';
import { EventsWithValidation, regexValidation, InlineFormLabel, LegacyForms } from '@grafana/ui';
const { Select, Input, FormField } = LegacyForms;
import { DataSourceSettings, SelectableValue } from '@grafana/data';
import { OpenTsdbOptions } from '../types';

const tsdbVersions = [
  { label: '<=2.1', value: 1 },
  { label: '==2.2', value: 2 },
  { label: '==2.3', value: 3 },
];

const tsdbResolutions = [
  { label: 'second', value: 1 },
  { label: 'millisecond', value: 2 },
];

interface Props {
  value: DataSourceSettings<OpenTsdbOptions>;
  onChange: (value: DataSourceSettings<OpenTsdbOptions>) => void;
}

export const OpenTsdbDetails = (props: Props) => {
  const { onChange, value } = props;

  return (
    <>
      <h5>OpenTSDB settings</h5>
      <div className="gf-form">
        <InlineFormLabel width={7}>Version</InlineFormLabel>
        <Select
          options={tsdbVersions}
          value={tsdbVersions.find((version) => version.value === value.jsonData.tsdbVersion) ?? tsdbVersions[0]}
          onChange={onSelectChangeHandler('tsdbVersion', value, onChange)}
        />
      </div>
      <div className="gf-form">
        <InlineFormLabel width={7}>Resolution</InlineFormLabel>
        <Select
          options={tsdbResolutions}
          value={
            tsdbResolutions.find((resolution) => resolution.value === value.jsonData.tsdbResolution) ??
            tsdbResolutions[0]
          }
          onChange={onSelectChangeHandler('tsdbResolution', value, onChange)}
        />
      </div>
      <div className="gf-form">
        <InlineFormLabel width={7}>Lookup Limit</InlineFormLabel>
        <Input
          type="number"
          value={value.jsonData.lookupLimit ?? 1000}
          onChange={onInputChangeHandler('lookupLimit', value, onChange)}
        />
      </div>
      <div className="gf-form-inline">
        <div className="gf-form">
          <FormField
            labelWidth={7}
            label="Min time interval"
            inputEl={
              <Input
                className={'width-6'}
                value={value.jsonData.interval || ''}
                onChange={onInputChangeHandler('interval', value, onChange)}
                placeholder="1m"
                validationEvents={{
                  [EventsWithValidation.onBlur]: [
                    regexValidation(
                      /^\d+(ms|[Mwdhmsy])$/,
                      'Value is not valid, you can use number with time unit specifier: y, M, w, d, h, m, s'
                    ),
                  ],
                }}
              />
            }
          />
        </div>
      </div>
    </>
  );
};

const onSelectChangeHandler = (key: keyof OpenTsdbOptions, value: Props['value'], onChange: Props['onChange']) => (
  newValue: SelectableValue
) => {
  onChange({
    ...value,
    jsonData: {
      ...value.jsonData,
      [key]: newValue.value,
    },
  });
};

const onInputChangeHandler = (key: keyof OpenTsdbOptions, value: Props['value'], onChange: Props['onChange']) => (
  event: SyntheticEvent<HTMLInputElement>
) => {
  onChange({
    ...value,
    jsonData: {
      ...value.jsonData,
      [key]: event.currentTarget.value,
    },
  });
};
