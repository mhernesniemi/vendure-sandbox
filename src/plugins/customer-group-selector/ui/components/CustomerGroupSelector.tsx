import React from "react";
import { useFormControl, ReactFormInputOptions } from "@vendure/admin-ui/react";

export function CustomerGroupSelector({ readonly }: ReactFormInputOptions) {
  const { value, setFormValue } = useFormControl();

  return (
    <select
      value={value || ""}
      onChange={(e) => setFormValue(e.target.value)}
      disabled={readonly}
    >
      <option value="">Select a customer group</option>
      <option value="1">Retail</option>
      <option value="2">Wholesale</option>
    </select>
  );
}
