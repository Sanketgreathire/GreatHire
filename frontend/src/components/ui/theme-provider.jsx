"use-client"

import * as React from "react"
import { ThemeProvider as NextThemeprovider } from "next-themes"


export function ThemeProvider({children, ...props}){
    return <NextThemeprovider {...props}></NextThemeprovider>
}