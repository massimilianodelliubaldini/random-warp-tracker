# random-warp-tracker

Playing a warp randomizer? Use this website to track your progress!

https://mpm11011.github.io/random-warp-tracker/

## How to use

Visit the [HowTo](https://mpm11011.github.io/random-warp-tracker/howto.html) page.

## About

I wrote this site to practice web development. My goals for this project:

1. **Speed:** The site must be fast, both in terms of performance and user navigation. If I hope to see this site used in a speedrun, it must be much faster than other tracking methods, including spreadsheets and note-taking. 

2. **User Friendliness:** The user should not have to visit the HowTo page to learn how to use the tracker, but the HowTo page gives the user a sandbox to play around in. All the controls must be accessible with only a mouse, since the user will be using their other hand to play the game.

3. **Minimal reliance on JS plugins and packages:** I don't want to weigh down the site with excess packages, and I want the site to be as self-sufficient as possible. That said, I do use jQuery and a handful of plugins to make it easy for the user to navigate and easy for me to code. Acknowledgements are below.  

4. **Extensibility:** Right now the site only tracks one game, but I wrote all the world and warp information in JSON. This means I can map out another game, add the images, and run it, all without having to modify code.

4. **Rapid prototyping:** I'm using GitHub Pages as my web host, which means all the logic is client-side. However, my reliance on JSON means I can't run it locally for testing due to CORS policies (the HowTo page is written to be a static map, so it doesn't need to load JSON). So, I update the site frequently to see my changes in action and adjust as needed.

## To-Do Items

1. Write a game selector.

2. Refactor to remove bad practices.

## Dependencies

* jQuery 3.6.0
	* maphilight
	* contextMenu

## Acknowledgments

* /u/twiddlebit - [Warp Randomizer Tracker](https://old.reddit.com/r/pokemon/comments/qizqd7/i_made_a_tracking_spreadsheet_for_the_pokemon/)
	* Serves as the inspiration for this project. I also rely on the concepts and definitions set therein. 
* PointCrow, XLuma, Turtleisaac, AtSign, et al. - Warp Randomizer mod
* Bulbapedia - World images
* Nintendofreak106 - [Lavaridge Center interior](https://www.spriters-resource.com/fullview/38099/)
* David Lynch - [maphilight](https://davidlynch.org/blog/2008/03/maphilight-image-map-mouseover-highlighting/)
* SWIS - [jQuery-contextMenu](https://github.com/swisnl/jQuery-contextMenu)
