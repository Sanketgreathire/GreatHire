import {useTheme} from "../context/ThemeContext"
import {Sun , Moon} from "lucide-react"


const ThemeToggle = () =>{
    const {theme , toggleTheme} = useTheme();
    return (
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark: bg-transparent transition">
            
            {theme === "light" ? <Moon className="w-5 h-5 bg-transparent "/> : <Sun className="w-5 h-5 bg-transparent" />}
        </button>
    )
}

export default ThemeToggle