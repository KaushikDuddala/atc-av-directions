import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[4px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive shadow-sm",
  {
    variants: {
      variant: {
        default: 'border border-primary/80 bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-[0_14px_30px_-18px_rgba(185,97,34,0.7)]',
        destructive:
          'border border-destructive/80 bg-destructive text-white hover:-translate-y-0.5 hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border border-stone-300/80 bg-white/85 text-stone-700 hover:-translate-y-0.5 hover:bg-white hover:text-stone-900',
        secondary:
          'border border-emerald-200/80 bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/85',
        ghost:
          'bg-transparent text-stone-600 shadow-none hover:bg-white/70 hover:text-stone-900',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2.5 has-[>svg]:px-4',
        sm: 'h-9 gap-1.5 px-3.5 text-[13px] has-[>svg]:px-3',
        lg: 'h-12 px-6 text-base has-[>svg]:px-5',
        icon: 'size-11',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
