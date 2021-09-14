type PollResult = 'up' | 'down'

const statusEl = document.querySelector<HTMLDivElement>('#status')
const statusSubEl = document.querySelector<HTMLDivElement>('#status-sub')

const lastMinuteBarsEl = document.querySelector<HTMLDivElement>('.last-minute .status-bars')
const lastMinuteUptimeEl = document.querySelector<HTMLDivElement>('.last-minute .uptime')

const lastHourBarsEl = document.querySelector<HTMLDivElement>('.last-hour .status-bars')
const lastHourUptimeEl = document.querySelector<HTMLDivElement>('.last-hour .uptime')

const check = async () => {
	const res = await fetch('https://isbrightspacedownapi.iannis.io/')
	const resText = await res.text()

	if (resText == 'up') {
		statusEl.classList.add('green')
		statusEl.innerHTML = 'Up'
		statusSubEl.innerHTML = `Wow, that's surprising!`
	}
	else {
		statusEl.classList.add('red')
		statusEl.innerHTML = 'Down'
		statusSubEl.innerHTML = `As usual.`
	}
}

const getColourForCombinedUptime = (uptime: number) => {
	const hue = Math.max(0, 120 * (uptime * 10 - 9))
	return `hsl(${ hue }deg, 40%, 50%)`
}

const getLastMinuteData = async () => {
	const res = await fetch('https://isbrightspacedownapi.iannis.io/last-minute')
	const text = await res.text()

	if (text == '') {
		lastMinuteUptimeEl.innerHTML = 'N/A'
		return
	}

	const rawData = text.split(',').map(num => +num) as number[]
	const padData = new Array(60 - rawData.length).fill(0.5) as number[]
	const data = padData.concat(rawData)

	for (let i = 0; i < 60; i++) {
		const colour = getColourForCombinedUptime(1 - data[i])
		const child = lastMinuteBarsEl.children[i] as HTMLDivElement
		child.style.backgroundColor = colour
	}

	const uptime = ((1 - data.reduce((acc, val) => acc + val) / 60) * 100).toFixed(1) + '%'
	lastMinuteUptimeEl.innerHTML = uptime
}

const getLastHourData = async () => {
	const res = await fetch('https://isbrightspacedownapi.iannis.io/last-hour')
	const text = await res.text()

	if (text == '') {
		lastMinuteUptimeEl.innerHTML = 'N/A'
		return
	}

	const rawData = text.split(',').map(num => +num) as number[]
	const padData = new Array(3600 - rawData.length).fill(0.5) as number[]
	const data = padData.concat(rawData)

	for (let i = 0; i < 60; i++) {
		let combinedUptime = 0

		for (let j = 0; j < 60; j++) {
			combinedUptime += data[i * 60 + j]
		}

		combinedUptime /= 60
		combinedUptime = 1 - combinedUptime

		const colour = getColourForCombinedUptime(combinedUptime)
		const child = lastHourBarsEl.children[i] as HTMLDivElement
		child.style.backgroundColor = colour
	}

	const uptime = ((1 - data.reduce((acc, val) => acc + val) / 3600) * 100).toFixed(1) + '%'
	lastHourUptimeEl.innerHTML = uptime
}

check()
getLastMinuteData()
getLastHourData()