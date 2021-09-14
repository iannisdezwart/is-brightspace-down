import { compilePages, importGoogleFont, inlineJS, inlineSASS, inlineSVG, PageShell } from 'page-compiler'

const main = async () => {
	const pageShell = new PageShell({
		head: /* html */ `
		${ await importGoogleFont('Urbanist', [
			{ weight: 300, italic: false },
			{ weight: 400, italic: false },
			{ weight: 600, italic: false },
		]) }

		${ await inlineSASS('src/sass/index.sass') }
		`
	})

	compilePages([
		{
			html: pageShell.render('⬇️ IsBrightspaceDown', /* html */ `
			<div id="app">
				<div id="is-it-down">
					<div id="logo">${ inlineSVG('src/svg/logo.svg') }</div>
					<div id="status">Checking...</div>
					<div id="status-sub">&nbsp;</div>
				</div>

				<div id="past-status">
					<div class="last-minute status-bar-container">
						<p class="status-bar-header">Last minute</p>

						<div class="status-bars">
							${ /* html */ `
							<div class="bar"></div>
							`.repeat(60) }
						</div>

						<div class="status-bar-legend">
							<div class="from">1 minute ago</div>
							<div class="line"></div>
							<div class="uptime">loading...</div>
							<div class="line"></div>
							<div class="to">now</div>
						</div>
					</div>

					<div class="last-hour status-bar-container">
						<p class="status-bar-header">Last hour</p>

						<div class="status-bars">
							${ /* html */ `
							<div class="bar"></div>
							`.repeat(60) }
						</div>

						<div class="status-bar-legend">
							<div class="from">1 hour ago</div>
							<div class="line"></div>
							<div class="uptime">loading...</div>
							<div class="line"></div>
							<div class="to">now</div>
						</div>
					</div>
				</div>

				<div id="api">
					<h1>API documentation</h1>
					<p>
						The API is hosted at
						<a href="https://isbrightspacedownapi.iannis.io">
							https://isbrightspacedownapi.iannis.io
						</a>.
					</p>
					<p>
						<a href="https://isbrightspacedownapi.iannis.io/check">
							/check
						</a>
						returns 'up' or 'down' if brightspace is currently up or down.
					</p>
					<p>
						<a href="https://isbrightspacedownapi.iannis.io/">
							/
						</a>
						is an alias for the
						<a href="https://isbrightspacedownapi.iannis.io/check">
							/check
						</a>
						endpoint.
					</p>
					<p>
						<a href="https://isbrightspacedownapi.iannis.io/last-minute">
							/last-minute
						</a>
						returns a comma-seperated list of 60 booleans.
						Each entry in the list represents if brightspace was down or up
						at that second. The last boolean is the newest value.
						1 = down, 0 = up.
					</p>
					<p>
						<a href="https://isbrightspacedownapi.iannis.io/last-hour">
							/last-hour
						</a>
						does the same as the previous, but returns a list of 3600 booleans.
					</p>
					<br>
					<p>
						Now it's your turn: use the API to create something cool!
						Add an icon to your status bar showing whether brightspace is down
						or not, code a raspberry PI to flash an LED if brightspace is
						down or go into an entirely different direction!
						It would be cool to see someone hacking into the TU Delft
						servers linking the API to the fire alarm too ;-).
						Options are endless!
					</p>
					<em>Cool ideas will be featured on this site.</em>
				</div>

				<div id="footer">
					<br><br>
					<em>Owned & maintained by <a href="https://iannis.io/">Iannis de Zwart</a></em>
				</div>
			</div>

			${ await inlineJS('src/js/index.js') }
			`, {
				author: 'Iannis de Zwart',
				description: `No, it's not you. Brightspace is down again. Ugh...`,
				keywords: [
					'TU Delft',
					'Delft University of Technology',
					'Delft University of Technical Difficulties',
					'Brightspace'
				]
			}),
			path: '/index.html'
		}
	])
}

main()