export const INITIAL_DATE = {
	seconds: 0,
	isRunning: false
}

export function timerReducer(state, action) {
	switch (action.type) {
		case 'START':
			return { ...state, isRunning: true };

		case 'STOP':
			return { ...state, isRunning: false };

		case 'TICK':
			return { ...state, seconds: state.seconds + 1 }
		case 'RESET':
			return { ...INITIAL_DATE };
		default:
			return state;
	}
}
