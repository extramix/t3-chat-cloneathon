'use client'

import dynamic from "next/dynamic"

const App = dynamic(() => import("@/frontend/app"), {
    ssr: false,
})

export default function Page() {
    return <App />
}