# Visualizer — A.V.A.T.A.R Plugin

![visualizer](../../core/plugins/visualizer/assets/images/visualizer.png =100x*)

--

## Description

The Visualizer plugin displays an animated window reactive to real-time audio. It simultaneously captures microphone input and Windows audio output.
Ten orb styles are available, ranging from a WebGL sphere to a Matrix rain visualizer, a circular FFT equalizer, a plasma fire, or an animated water surface.

--

## Preview

An interactive preview page is available: **[preview.html](../../core/plugins/visualizer/preview.html)**

It displays all 10 orbs as live animated thumbnails, with a direct link to open each orb fullscreen in the browser.

--

## Installation

1. Copy the folder to `<AVATAR>/resources/app/core/plugins/visualizer/`
2. Restart A.V.A.T.A.R Server
3. In Widget Studio, add the `Button_visualizer` widget (device code: `927413`)
![visualizer](../../core/plugins/visualizer/assets/widget/widget-visualizer.png =400x*)

4. Optional: configure the circular menu on the widget with label `Next Orb` and command `command=cycleOrb` (see image above)
		1--In Widget Studio → label: "Next Orb"
		2--Click Add
		3--Select plugin Visualizer
		4--In the command field: "command=cycleOrb"
		5--Click Associate
		6--Click Modify to save

--

## Orb Styles

| # | Name | Description |
|---|---|---|
| 1 | WebGL Sphere | GLSL fractal noise sphere with rotating rings |
| 2 | Neural Graph | Interconnected nodes with animated signals |
| 3 | Organic Particles | Particle cloud with repulsion and attraction |
| 4 | Matrix | Katakana rain with audio-reactive heads |
| 5 | Oscilloscope | Circular FFT wave on perimeter |
| 6 | Plasma Fire | Fire particles with audio turbulence |
| 7 | Constellation | Rotating stars, connections and shooting stars |
| 8 | Vortex Tunnel | Perspective rings with audio twist |
| 9 | Circular Equalizer | FFT bars in circle with peak hold |
| 10 | Water / Ripple | Water surface with propagated ripples |

--

## Voice Commands

| Command | Action |
|---|---|
| "open the visualizer" / "open the orb" | Opens the window |
| "close the visualizer" / "close the orb" | Closes the window |
| "orb one" / "orb sphere" | Orb 1 — WebGL Sphere |
| "orb two" / "orb graph" | Orb 2 — Neural Graph |
| "orb three" / "orb organic" | Orb 3 — Organic Particles |
| "orb four" / "orb matrix" | Orb 4 — Matrix |
| "orb five" / "orb oscilloscope" | Orb 5 — Circular Oscilloscope |
| "orb six" / "orb plasma" | Orb 6 — Plasma Fire |
| "orb seven" / "orb constellation" | Orb 7 — Constellation |
| "orb eight" / "orb vortex" | Orb 8 — Vortex Tunnel |
| "orb nine" / "orb equalizer" | Orb 9 — Circular Equalizer |
| "orb ten" / "orb ripple" | Orb 10 — Water / Ripple |

--

## Widget Usage

- **Single click**: opens or closes the window
- **Double-click**: cycles to the next orb (1→2→…→10→1)

--

## Fullscreen

Double-click on any orb, right-click, or press **F11** to toggle fullscreen. Same action to return to normal size.

--

## Configuration (visualizer.prop)

| Key | Description |
|---|---|
| `orbStyle` | Orb displayed at startup (1 to 10) |
| `autoOpen` | Open automatically when A.V.A.T.A.R starts |
| `opacity` | Window opacity (0.0 to 1.0) |
| `window.width/height` | Initial window size in pixels |
| `window.x/y` | Initial window position |
| `window.alwaysOnTop` | Always visible above other windows |

--

## Author

Plugin developed for the A.V.A.T.A.R home automation system.
Created by: **Nezumi**

<br><br>
