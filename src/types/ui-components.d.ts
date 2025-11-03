// Type declarations for UI components that must be provided by consuming project
// These components should be installed via shadcn/ui in the consuming Next.js project

declare module '@/components/ui/table' {
  import * as React from 'react'

  export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
  export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
  export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
  export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
  export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}
  export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

  export const Table: React.ForwardRefExoticComponent<TableProps & React.RefAttributes<HTMLTableElement>>
  export const TableHeader: React.ForwardRefExoticComponent<TableHeaderProps & React.RefAttributes<HTMLTableSectionElement>>
  export const TableBody: React.ForwardRefExoticComponent<TableBodyProps & React.RefAttributes<HTMLTableSectionElement>>
  export const TableRow: React.ForwardRefExoticComponent<TableRowProps & React.RefAttributes<HTMLTableRowElement>>
  export const TableHead: React.ForwardRefExoticComponent<TableHeadProps & React.RefAttributes<HTMLTableCellElement>>
  export const TableCell: React.ForwardRefExoticComponent<TableCellProps & React.RefAttributes<HTMLTableCellElement>>
}

declare module '@/components/ui/button' {
  import * as React from 'react'

  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
  }

  export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>
}

declare module '@/components/ui/input' {
  import * as React from 'react'

  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

  export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>
}

declare module '@/components/ui/select' {
  import * as React from 'react'

  export interface SelectProps {
    value?: string
    onValueChange?: (value: string) => void
    children?: React.ReactNode
  }

  export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
  export interface SelectValueProps {
    placeholder?: string
  }
  export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}
  export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
  }

  export const Select: React.FC<SelectProps>
  export const SelectTrigger: React.ForwardRefExoticComponent<SelectTriggerProps & React.RefAttributes<HTMLButtonElement>>
  export const SelectValue: React.FC<SelectValueProps>
  export const SelectContent: React.ForwardRefExoticComponent<SelectContentProps & React.RefAttributes<HTMLDivElement>>
  export const SelectItem: React.ForwardRefExoticComponent<SelectItemProps & React.RefAttributes<HTMLDivElement>>
}
