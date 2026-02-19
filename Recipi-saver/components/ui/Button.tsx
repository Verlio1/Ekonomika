import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={twMerge(
                    clsx(
                        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
                        {
                            'bg-primary text-white hover:bg-primary/90': variant === 'primary',
                            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
                            'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
                            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
                            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
                            'h-9 px-3 text-xs': size === 'sm',
                            'h-10 px-4 py-2': size === 'md',
                            'h-11 px-8': size === 'lg',
                        },
                        className
                    )
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)
Button.displayName = 'Button'

export { Button }
