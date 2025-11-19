/**
 * Type declarations for external shadcn/ui components
 * These components are provided by the consumer's project
 */

declare module '@/components/ui/button' {
  import * as React from 'react';

  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }

  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;

  export const buttonVariants: any;
}

declare module '@/components/ui/input' {
  import * as React from 'react';

  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

  export const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >;
}

declare module '@/components/ui/select' {
  import * as React from 'react';

  export const Select: React.FC<any>;
  export const SelectContent: React.FC<any>;
  export const SelectItem: React.FC<any>;
  export const SelectTrigger: React.FC<any>;
  export const SelectValue: React.FC<any>;
}

declare module '@/components/ui/table' {
  import * as React from 'react';

  export const Table: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableElement> & React.RefAttributes<HTMLTableElement>
  >;
  export const TableBody: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>
  >;
  export const TableCell: React.ForwardRefExoticComponent<
    React.TdHTMLAttributes<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>
  >;
  export const TableHead: React.ForwardRefExoticComponent<
    React.ThHTMLAttributes<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>
  >;
  export const TableHeader: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>
  >;
  export const TableRow: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableRowElement> & React.RefAttributes<HTMLTableRowElement>
  >;
  export const TableCaption: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableCaptionElement> & React.RefAttributes<HTMLTableCaptionElement>
  >;
  export const TableFooter: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>
  >;
}
