import { Formik, type FormikConfig, type FormikHelpers, type FormikValues } from "formik"
import { memo, type PropsWithChildren } from "react"
import { Form, useNavigate, useNavigation } from "@remix-run/react"
import type { HTMLFormMethod } from "@remix-run/router/utils"
import { error, info, success } from "~/components/Toast"

interface Props<T extends FormikValues = FormikValues> {
    initialValues: FormikConfig<T>["initialValues"]
    validationSchema?: FormikConfig<T>["validationSchema"]
    method?: HTMLFormMethod
}

const FormBase = memo<PropsWithChildren<Props<any>>>(
    ({ initialValues, validationSchema, children, method = "post" }) => {
        return (
            <Formik
                initialValues={initialValues}
                onSubmit={() => {
                    return Promise.resolve()
                }}
                enableReinitialize
                validationSchema={validationSchema}>
                {(props) => {
                    return (
                        <Form className="space-y-4 md:space-y-6" method={method}>
                            {children}
                        </Form>
                    )
                }}
            </Formik>
        )
    }
)

FormBase.displayName = "FormBase"

export default FormBase
