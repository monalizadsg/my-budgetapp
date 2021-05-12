import React from "react";
import { MenuItem, ListSubheader } from "@material-ui/core";
import SelectInput from "../components/SelectInput";

const CategorySelectInput = ({
  categories,
  category,
  error,
  onChange,
  isBudgetForm,
}) => {
  let incomeCategories = [];
  let expenseCategories = [];
  if (categories) {
    categories.forEach((category) => {
      if (category.type === "EXPENSE") {
        expenseCategories.push(category);
      } else if (category.type === "INCOME") {
        incomeCategories.push(category);
      }
    });
  }

  return (
    <SelectInput
      name='category'
      label='Category'
      value={category}
      error={error}
      onChange={onChange}
    >
      <ListSubheader>Expense</ListSubheader>
      {categories &&
        expenseCategories.map((menu, index) => {
          return (
            <MenuItem key={index} value={menu.id}>
              {menu.name}
            </MenuItem>
          );
        })}
      {!isBudgetForm && (
        <div>
          <ListSubheader>Income</ListSubheader>
          {categories &&
            incomeCategories.map((menu, index) => {
              return (
                <MenuItem key={index} value={menu.id}>
                  {menu.name}
                </MenuItem>
              );
            })}
        </div>
      )}
    </SelectInput>
  );
};

export default CategorySelectInput;
