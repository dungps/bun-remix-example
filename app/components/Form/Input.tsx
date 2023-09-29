import type { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from "react"
import { ErrorMessage, useField } from "formik"

type Props = Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "name"
> & {
    name: string
    label?: string
}

export default function Input({
    name,
    id,
    label,
    type = "text",
    onChange: onChangeFunc,
    ...props
}: Props) {
    const [fieldProps, meta] = useField(name)
    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
        fieldProps.onChange(e)
        if (onChangeFunc) {
            onChangeFunc(e)
        }
    }

    return (
        <>
            {label && (
                <label className="label" htmlFor={id}>
                    <span className="label-text">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </span>
                </label>
            )}
            <input
                {...props}
                {...fieldProps}
                type={type}
                name={name}
                id={id}
                onChange={onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            />
            {meta.error && meta.touched && <p className="text-red-500 italic text-sm mt-1">{meta.error}</p>}
        </>
    )
}
