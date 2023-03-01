
import type { NextPage } from 'next';

import FooterMenu from '../components/FooterMenu';
import ShareOrganizationView from '../components/ShareOrganizationView'
import QuestListView from '../components/QuestListView'
import RequestValidationView from '../components/RequestValidationView'
import ValidationView from '../components/ValidationView'
import BadgeListView from '../components/BadgeListView'

import { redirect } from 'next/navigation';
export default async function Home({ params }: any) {
	redirect('/quests');
}

// const Main: NextPage = () => {
// 	return (
// 		<div className=' bg-base-900 min-h-screen p-6 w-full text-base-100 text-xl'>

// 			<main>
				
// 				<div className='flex flex-col w-full p-4'>
// 					{/* <ShareOrganizationView /> */}
// 					{/* <QuestListView /> */}
// 					{/* <RequestValidationView></RequestValidationView> */}
// 					{/* <ValidationView></ValidationView> */}
// 					<BadgeListView />
// 				</div>
// 			</main>
// 			<FooterMenu></FooterMenu>

// 		</div>
// 	);
// };

// export default Main;
