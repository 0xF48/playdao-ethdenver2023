
import QuestCardAPIWrapper from '../components/QuestCardAPIWrapper'
import { useMyBadges, useOrganization } from '../util/hooks'
import { useRouter } from 'next/router'
import _ from 'lodash'
import type { NextPage } from 'next';
import Link from 'next/link'
import ErrorView from './LoadingView';

export default function QuestsListView() {

	const router = useRouter();
	const { dao_id } = router.query;
	let { loading, data, error } = useOrganization(dao_id)
	let { loading: badges_loading, badges, error: badges_error } = useMyBadges()


	if (loading || badges_loading) {
		return <div>loading...</div>
	}
	if (error) {
		return <ErrorView error={error}></ErrorView>
	}

	var quests = []

	if (data && data.dao) {
		let dao = data.dao

		quests = data.dao.questTypes.map((quest_type: any) => {
			let badge_ok = false
			if (!quest_type.contributorDeps.length) {
				badge_ok = true
			}

			quest_type.contributorDeps.forEach((badge: any) => {
				// console.log(badge)
				badges.forEach((my_badge: any) => {
					if (badge.badgeType.badgeTypeID == my_badge.badgeTypeID) {
						badge_ok = true
					}
				})
			})
			if (!badge_ok) {
				return undefined
			}
			return <div key={quest_type.questTypeID}>
				{quest_type.quests.map((quest: any) => {

					return <QuestCardAPIWrapper key={quest.questID} questId={quest.questID} />
				})}
			</div>
		})
	}

	return <div className="flex flex-col items-center w-full justify-center">
		<div className='font-extrabold text-2xl text-black'>QUEST FEED</div>
		{quests}
	</div>
}