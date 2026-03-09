import { useState, useEffect } from "react"

function SmartNote() {
	const [text, setText] = useState('')
	const [history, setHistory] = useState(() => {
		const data = localStorage.getItem('history')
		if (data) {
			try {
				const parsedData = JSON.parse(data);
				return Array.isArray(parsedData) ? parsedData : []
			} catch (e) {
				console.log(`Ошибка: ${e}`)
				return [];
			}
		}
		return [];
	})
	const [lastText, setLastText] = useState('')

	useEffect(() => {
		if (history.length > 0) {
			setText(history[history.length - 1])
			setLastText(history[history.length - 1])
		}
	}, [])

	useEffect(() => {
		if (text === lastText) return;

		const timer = setTimeout(() => {
			const newHistory = [...history, text]
			localStorage.setItem('history', JSON.stringify(newHistory))
			setLastText(text)
			setHistory(newHistory)
		}, 800)
		return () => {
			clearTimeout(timer)
		}

	}, [text, lastText, history])

	const takePrevious = () => {
		if (history.length > 1) {
			const newArr = history.slice(0, -1);
			setHistory(newArr)
			setLastText(newArr[newArr.length - 1])
			setText(newArr[newArr.length - 1])

			localStorage.setItem('history', JSON.stringify(newArr))
		}
	}
	return (
		<div>
			<textarea
				value={text}
				rows={5}
				cols={50}
				placeholder="Начните печатать..."
				onChange={(e) => { setText(e.target.value) }}

			/>
			<div>Символов: {text.length}</div>
			<button onClick={takePrevious} disabled={history.length <= 1}>Отменить</button>
		</div>
	)
}

export default SmartNote