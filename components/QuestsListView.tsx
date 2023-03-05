
import QuestCardAPIWrapper from '../components/QuestCardAPIWrapper'
import { useMyBadges, useOrganization } from '../util/hooks'
import { useRouter } from 'next/router'
import _ from 'lodash'
import type { NextPage } from 'next';
import Link from 'next/link'

export default function QuestsListView() {

	const router = useRouter();
	const { dao_id } = router.query;
	let { loading, data, error } = useOrganization(dao_id)
	let { loading: badges_loading, badges, error: badges_error } = useMyBadges()
	console.log(badges)

	if (loading) {
		return <div>loading...</div>
	}
	if (error) {
		return <div>{error.message}</div>
	}

	var quests = []

	if (data && data.dao) {
		let dao = data.dao

		quests = data.dao.questTypes.map((quest_type: any) => {
			return <div key={quest_type.questTypeID}>
				{quest_type.quests.map((quest: any) => {

					return <QuestCardAPIWrapper key={quest.questID} questId={quest.questID} />
				})}
			</div>
		})
	}

	return <div className="flex flex-col items-center w-full justify-center">
		<div style={{ fontFamily: 'Tilt Warp' }} className='font-extrabold text-2xl text-base-200'>quest feed</div>
		{quests}
	</div>
}