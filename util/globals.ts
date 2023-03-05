

var CHAIN_ID = 80001
export function GET_CURRENT_CHAIN() {
	return CHAIN_ID
}

export function SET_CURRENT_CHAIN(chain_id: number) {
	CHAIN_ID = chain_id
}