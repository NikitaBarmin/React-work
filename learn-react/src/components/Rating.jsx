import { useState } from "react"

function Rating({ name }) {
	const [rating, setRating] = useState(0);

	return (
		<div style={{ display: 'flex' }}>
			{[1, 2, 3, 4, 5].map((num) => (
				<div key={num}>
					<span

						onClick={() => setRating(num)}
						style={num <= rating ? { color: 'gold', cursor: 'pointer' } : { cursor: 'pointer' }}
					>★</span>
				</div>
			))}
			<input type="hidden" name={name} value={rating} />
		</div>
	)

}

export default Rating