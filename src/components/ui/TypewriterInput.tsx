import React from 'react';
import { cn } from '../../utils/cn';

interface TypewriterInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    className?: string;
}

export const TypewriterInput = React.forwardRef<HTMLInputElement, TypewriterInputProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full relative group">
                {label && (
                    <label className="font-courier font-bold uppercase text-xs tracking-wider opacity-60 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "bg-transparent transition-colors duration-300 focus:outline-none py-2 px-1 font-typewriter text-xl text-ink-black placeholder:text-ink-black/20",
                        props.readOnly
                            ? "border-b-0 cursor-default"
                            : "border-b-2 border-ink-black/10 focus:border-ink-black/60",
                        className
                    )}
                    {...props}
                />
                {/* Ink blot effect on focus could go here */}
            </div>
        );
    }
);

TypewriterInput.displayName = "TypewriterInput";
