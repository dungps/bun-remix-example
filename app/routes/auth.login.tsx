import * as yup from "yup"
import Input from "~/components/Form/Input"
import { type ActionFunctionArgs, json, type LoaderFunctionArgs, redirect } from "@remix-run/node"
import Form from "~/components/Form/Form"
import { useActionData } from "@remix-run/react"
import { useEffect } from "react"
import { error, success } from "~/components/Toast"
import { createUserSession, getUserId, login, type LoginForm } from "~/server/session.server"

const validator = yup.object().shape({
    username: yup
        .string()
        .email("Hãy điền email")
        .trim("Hãy điền email")
        .required("Hãy điền email"),
    password: yup.string().required("Hãy nhập password")
})

export async function loader({ request }: LoaderFunctionArgs) {
    const user_id = await getUserId(request)
    if (user_id) {
        return redirect("/")
    }

    return json({})
}

export async function action({ request }: ActionFunctionArgs) {
    if (request.method === "POST") {
        try {
            const loginFrom = await request.formData()
            const data = Object.fromEntries<any>(loginFrom.entries())
            const { id } = await login(data as LoginForm)
            return await createUserSession(request, { user_id: id })
        } catch (err: any) {
            return json(
                {
                    type: "error",
                    message: err.message
                },
                {
                    status: 400
                }
            )
        }
    }

    return json(
        {
            type: "error",
            message: "Method not allowed"
        },
        {
            status: 405
        }
    )
}

export default function Login() {
    const data = useActionData<typeof action>()

    useEffect(() => {
        if (data) {
            switch (data?.type) {
                default:
                    if (data?.message) {
                        error(data.message)
                    }
                    error("Unknown response")
                    break
                case "success":
                    success(data?.message)
                    break
                case "error":
                    error(data?.message)
                    break
                case "redirect":
            }
        }
    }, [data])

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a
                    href="#"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    Hello world
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <Form
                            initialValues={{ username: "", password: "" }}
                            validationSchema={validator}>
                            <div>
                                <Input name="username" label="Email" required />
                            </div>
                            <div>
                                <Input name="password" type="password" label="Password" required />
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-sky-500 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Sign in
                            </button>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    )
}
