import { QUERY_DAO } from './queries';
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'; ``


export function useLocalStorage<T>(key: string, fallbackValue: T) {
	const [value, setValue] = useState(fallbackValue);

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue] as const;
}


export function useQuest(quest_id?: any) {
	let org = useOrganization()
	console.log('use quest', quest_id, org)
	let claimQuest = (quest_id: any) => {

	}

	return {
		loading: false,
		quest_data: null,
		error: null,
		claimQuest
	};
}

export function useOrganization(id?: any) {
	let [stored_id, setStoredId] = useState("")

	useEffect(() => {
		var got_id = id
		if (!got_id) {
			got_id = window.localStorage.getItem('daoID');
		} else {
			localStorage.setItem('daoID', got_id)
		}
		setStoredId(String(got_id))
	}, [id]);



	const { data, loading, error } = useQuery(QUERY_DAO, {
		variables: {
			id: stored_id,
		},
	});

	if (!stored_id) {
		return { data: null, loading: false, error: new Error('scan another persons DAO QR to get started') }
	}

	return { data, loading, error };
}