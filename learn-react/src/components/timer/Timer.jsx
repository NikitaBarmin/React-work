function Timer({ time, resetTime, toggleTime, isRunning }) {
	return (
		<div>
			<h1>{time}</h1>
			<button onClick={toggleTime}>{isRunning ? 'Stop' : 'Start'}</button>
			<button onClick={resetTime}>Reset</button>
		</div>
	);
}

export default Timer;