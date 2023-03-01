import { QUERY_DAO } from './queries';
import { useQuery } from '@apollo/client'

export function useOrganization() {
	const { data, loading, error } = useQuery(QUERY_DAO);
	return { data, loading, error };
}