// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import { BankAccount, Budget, Category, Currency, Expense, Type } from "@prisma/client"

export type ShareWithUsersInput = {
  usersForAccount: Array<SelectOptions>
}

export type User = {
  id: string
  name: string
  email: string
}

export type Item = {
  id: string
  name: string
}

interface Account extends BankAccount {
  email: string
}

export type BankAccountCreate = Omit<Account, "id" | "userId">

export type AccountFormData = {
  name: string | null
  currency: string
  amount: number
  email: string
}

export type BankAccountType = Pick<BankAccount, "accountId" | "name">

export type CategoryFormData = {
  name: string | null
  type: Type
}

interface BankAccountListItem extends BankAccount {
  amountNumber: number
}

export type BankAccountItem = Omit<BankAccountListItem, "id" | "userId" | "amount">

export type CategoryItem = Omit<Category, "id">

export type CategoryType = Pick<Category, "categoryId" | "name">

export type SelectedItem = string | Currency | Type | Array<string>

export type SelectOptions = {
  label: string
  value: string
}

export type SelectData = Array<SelectOptions>

export type CategoryInput = Omit<Category, "id" | "categoryId">

export type BudgetFormData = {
  name: string
  amount: number
  startDate: string
  endDate: string
  accounts: Array<SelectOptions>
  categories: Array<SelectOptions>
  currency: Currency
}

export type ExpenseFormData = {
  name: string
  currency: Currency
  amount: number
  createdAt: string
  budgetId: string
  categories: Array<SelectOptions>
}

export type SettingsFormData = {
  usersForAccount: Array<SelectOptions>
}

interface BudgetI extends Budget {
  amountNumber: number
}

interface ExpenseI extends Expense {
  amountNumber: number
}

export type BudgetItem = Pick<BudgetI, "budgetId" | "name" | "amountNumber" | "currency">

export type ExpenseItem = Pick<ExpenseI, "expenseId" | "name" | "amountNumber" | "currency">

export type BudgetInput = BudgetFormData

export type ExpenseInput = ExpenseFormData

export type BudgetType = Pick<Budget, "budgetId" | "name">

export type UserSession = {
  name?: string | null
  email?: string | null
  image?: string | null
}