
<h1 align="center">
  <br>
  <a><img src="https://raw.githubusercontent.com/shriramrav/ViSync/master/public/icon.png" alt="ViSync icon" width="200"></a>
  <br>
  ViSync
  <br>
</h1>

<h4 align="center">A chrome extension to synchronize video players in real-time.</h4>

<p align="center">
  <a href="https://github.com/shriramrav/ViSync/blob/master/LICENSE.txt">
    <img src="https://img.shields.io/badge/License-MIT-lightblue.svg"
         alt="MIT License Icon">
  </a>
</p>

<p align="center">
<a href="#Features">Features</a> •
<a href="#Installation-And-Usage">Installation & Usage</a> •
  <a href="#Credits">Credits</a> 
</p>

<p align="center">
<img src="https://raw.githubusercontent.com/shriramrav/images/master/sync%20demo%203.webp" height=450>
</p>


<a name="#Features" ></a>
## Features
- Ability to create and connect to private rooms
- Support for locating video players inside iframes (non-nested)
- Automatic server connection upon opening the main page to reduce time spent while creating/joining rooms
	- (Inactivity on the main page will cause the client to disconnect after 30 seconds)  

<a name="#Installation-And-Usage" ></a>
## Installation & Usage
- First, [download](https://github.com/shriramrav/ViSync/releases/download/v1.0.0/ViSync.zip) the zip file containing the unpacked extension.
- After unzipping the file, navigate to the page `chrome://extensions` and use the "**Load unpacked**" button to add the extension to your browser.
	- Please note: [developer mode](https://developer.chrome.com/docs/extensions/mv3/getstarted/) must be enabled for this method to work.
- To connect to rooms, the active tab must contain a loaded video player. While ViSync listens for new iframes being created in the page, the main page will only show up once a source has been found.

If you find an issue, please create a new issue on this repository page to help further improve this project. 

<a id="#Credits" ></a>
## Credits
- Special thanks to [Aarya Patel]() for providing insightful knowledge regarding Chrome Manifest V3.
