import cn from "classnames"
import { Router, useRouter } from "next/router"
import { useState } from "react"
import Link from 'next/link'


function ScanIcon({ sel }: any) {
	let [color, setColor] = useState("white")
	if (sel) {
		color = 'rgb(34 197 94)'
	}
	return <svg onMouseEnter={() => { setColor('rgb(34 197 94)') }} onMouseLeave={() => { setColor('white') }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={color} className="w-6 h-6">
		<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
	</svg>

}

function MenuIcon({ sel }: any) {
	let [color, setColor] = useState("white")
	if (sel) {
		color = 'rgb(34 197 94)'
	}
	return <svg onMouseEnter={() => { setColor('rgb(34 197 94)') }} onMouseLeave={() => { setColor('white') }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={color} className="w-6 h-6">
		<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
	</svg>

}

function BadgeIcon({ sel }: any) {
	let [color, setColor] = useState("white")
	if (sel) {
		color = 'rgb(34 197 94)'
	}
	return <svg onMouseEnter={() => { setColor('rgb(34 197 94)') }} onMouseLeave={() => { setColor('white') }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={color} className="w-6 h-6">
		<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
	</svg>

}


export default function () {

	let router = useRouter()
	// console.log(router.pathname)

	return <div className="w-full p-4 flex items-center content-center justify-center fixed bottom-0 left-0 pointer-events-none">
		<div className='scale-100 hover:scale-115 transition-transform transform-gpu pointer-events-auto scale-1 cursor-pointer border-2	 border-base-800 w-auto h-16 bg-black rounded-2xl text-white flex flex-row relative px-0'>
			<Link href="/"><div className="h-full px-6 flex items-center content-center justify-center hover:color-red-500">
				<ScanIcon sel={router.pathname == '/'}></ScanIcon>
			</div></Link>
			<Link href="/quests"><div className="h-full px-6 flex items-center content-center justify-center hover:color-red-500">
				<MenuIcon sel={router.pathname == '/quests'}></MenuIcon>
			</div></Link>
			<Link href="/badges"><div className="h-full px-6 flex items-center content-center justify-center">
				<BadgeIcon sel={router.pathname == '/badges'} ></BadgeIcon>
			</div>
			</Link>
			<div className={"transition-all transform-gpu ease-out absolute h-2 -bottom-1 rounded-full bg-green-500 " + cn({
				"left-1/2 w-2 -translate-x-1/2": router.pathname != '/' && router.pathname != '/quests' && router.pathname != '/badges',
				"animate-position": true,
				"left-5 w-8": router.pathname == '/',
				"left-1/2 -translate-x-1/2 w-8": router.pathname == '/quests',
				'right-5 w-8': router.pathname == '/badges'
			})} />
		</div>
	</div>
}