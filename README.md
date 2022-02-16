# Cheeky Avo 

This desktop app is an open-source project inspired by Property Price Checker [https://propertyprice.co.nz](https://propertyprice.co.nz) </br>
The most significant difference from the above project is that this app does not use any of TM's APIs or store any of TM's proprietary data.
## Motivation (same as PPC)

 In New Zealand, it is often hard to ascertain the value that a property will sell for, so this additional pricing data point will allow the user to form a more complete picture of the likely sale price with other supplementary information from Homes and One Roof. It will also <b>save you time</b> between narrowing the search parameters on TM to find the listing price range. Instead of having a range of $50K or $100K, this tool <b>gets the exact price that the real estate agent has put as the listing price on TM</b>.</br>

The content on this app is for informational purposes only. This information should not be taken as financial, investment or legal advice.

## App Screenshot

![example usage](./src//assets//images//example.png)

## Installation for Non-Techies
Latest version can be found [here](https://github.com/cheekyavo/cheekyavo/releases)

### Windows
1. Download the setup exe
1. Run it

### Mac
1. Download the 'darwin' zip file
1. Extract the zip file in your Downloads folder
1. Right click the app and select 'Open'. (Only needed the first time)

## Installation for Techies

### Local Dev
1. `npm install`
2. `npm start`

### Releasing new versions
1. `npm version <major|minor|patch>`
1. `git push --tags`
1. When the build is complete check the release and publish it.