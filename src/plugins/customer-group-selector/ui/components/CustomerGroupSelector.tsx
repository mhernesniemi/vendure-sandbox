import React from "react";
import {
  useFormControl,
  ReactFormInputOptions,
  useInjector,
} from "@vendure/admin-ui/react";

export function CustomerGroupSelector({
  readonly,
  config,
}: ReactFormInputOptions) {
  const { value, setFormValue } = useFormControl();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    setFormValue(val);
  };
  return (
    <>
      <input
        type="range"
        readOnly={readonly}
        min={config.min || 0}
        max={config.max || 100}
        value={value}
        onChange={handleChange}
      />
      {value}
    </>
  );
}
