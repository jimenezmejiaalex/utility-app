// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import { BankAccount } from "@prisma/client"

export type User = {
  id: number
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

interface BankAccountListItem extends BankAccount {
  amountNumber: number
}

export type BankAccountItem = Omit<BankAccountListItem, "id" | "userId" | "amount">

