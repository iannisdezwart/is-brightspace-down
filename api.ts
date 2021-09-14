import * as http from 'http'
import { https } from 'follow-redirects'
import * as fs from 'fs'

// Array that holds 2 days worth of polling data

const POLL_DATA_SIZE = 60 * 60 * 24 * 2
const pollData = new Uint8Array(POLL_DATA_SIZE)
let pollDataIndex = 0

// If polling data was stored, read it into the buffer

if (fs.existsSync('poll.data')) {
	const buf = fs.readFileSync('poll.data')
	pollData.set(buf, 0)
	pollDataIndex = buf.byteLength
}

const getLatestPoll = async () => {
	if (pollDataIndex == 0) {
		await poll()
	}

	return pollData[pollDataIndex]
}

const server = http.createServer(async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'https://isbrightspacedown.iannis.io')

	if (req.url == '/' || req.url == '/check') {
		const result = await getLatestPoll() ? 'down' : 'up'
		res.end(result)
	}

	else if (req.url == '/last-minute') {
		const result = getLastMinuteData()
		res.end(result)
	}

	else if (req.url == '/last-hour') {
		const result = getLastHourData()
		res.end(result)
	}

	else if (req.url == '/last-24-hours') {
		const result = getLast24HoursData()
		res.end(result)
	}

	else {
		res.writeHead(404)
		res.end('404 Not Found')
	}
})

const pollBrightspace = () => new Promise<number>(resolve => {
	const req = https.request({
		hostname: 'brightspace.tudelft.nl',
		port: 443,
		path: '/',
		method: 'GET',
		timeout: 3000,
		beforeRedirect: (options, { headers }) => {
			const newCookie = headers['set-cookie'] || []

			options.headers = {
				'Accept': '*/*',
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 OPR/78.0.4093.184',
				'Cookie': newCookie
			}
		}
	}, bsRes => {
		bsRes.on('data', () => {})
		bsRes.on('end', () => {
			resolve(0)
		})
	})

	req.on('timeout', () => {
		resolve(1)
	})

	req.end()
})

const poll = async () => {
	// If the poll is full, clear half of it

	if (pollDataIndex == POLL_DATA_SIZE) {
		pollData.set(pollData.slice(POLL_DATA_SIZE / 2, POLL_DATA_SIZE - 1))
		pollDataIndex /= 2
	}

	// Poll brightspace and save the result

	const pollResult = await pollBrightspace()
	pollData[++pollDataIndex] = pollResult
	console.log(`polled: ${ pollResult }, pollDataIndex: ${ pollDataIndex }`)
}

setInterval(poll, 1000)

const getLastMinuteData = () => {
	return pollData.slice(Math.max(0, pollDataIndex - 60), pollDataIndex).join(',')
}

const getLastHourData = () => {
	return pollData.slice(Math.max(0, pollDataIndex - 3600), pollDataIndex).join(',')
}

const getLast24HoursData = () => {
	return pollData.slice(Math.max(0, pollDataIndex - 86400), pollDataIndex).join(',')
}

server.listen(+process.argv[2] || 3002)

// On termination, save the poll data

process.on('SIGINT', () => {
	fs.writeFileSync('poll.data', pollData.slice(0, pollDataIndex))
	process.exit()
})