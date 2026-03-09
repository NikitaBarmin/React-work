import Rating from "./Rating";
import { useState } from "react";
function Form({ onSubmit }) {

	const [clear, setClear] = useState(0)
	const submitRate = (e) => {
		e.preventDefault();
		const data = new FormData(e.target)
		const rating = Number(Object.fromEntries(data).value);
		if (!rating) {
			return;
		}
		onSubmit(rating)
		setClear(prev => prev + 1)
	}
	return (
		<form onSubmit={submitRate}>
			<Rating name='value' key={clear} />
			<button>Отправить</button>
		</form>
	)
}

export default Form