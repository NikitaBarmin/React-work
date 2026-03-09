import { useContext, useEffect } from "react"
import { ThemeContext } from "../context/theme.context"

function ThemeButton() {
	const { theme, setTheme } = useContext(ThemeContext);
	const toggle = () => {
		setTheme(prev => prev === 'light' ? 'dark' : 'light')
	}

	useEffect(() => {
		document.body.className = theme;
	}, [theme])

	return (
		<button onClick={toggle}>Переключатель на {theme === 'dark' ? 'светлую' : 'тёмную'}</button>
	)
}

export default ThemeButton