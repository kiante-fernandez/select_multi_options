# select_multi_options
Jspych experiment code for selecting multiple options project

Things to do:
~~- how do we mark which the type of item each option selected is? We need a data id that tells us which jpg was selected~~
~~- eye tracking calibration phase (see web gazer extension)~~
~~- how do we prevent subjects from deselecting options~~
~~- how are we saving the data? Dropbox.~~
~~- where are we sending the data after collection~~
~~- where are we deploying the web application? Heroku.~~
~~- add full screen~~
~~- add constent form~~
~~- data 'object issue' (why do we get the words object back instead of the data?)~~
~~- get browser data~~
~~- get screen data~~
- did subjects leave the screen? Get interaction data
- change eye tracking instructions to match the labs protocol
~~- Create the practice trials~~
~~- add the get ratings task afterwards (piloting in demo mode now)~~

~~change the color of the yellow (it's too bright?)~~

introduction:
~~- condition randomization~~
calibration screen (only one?)

condition specific instructions:
~~- randomization procedure for two conditions~~

practice trials:
~~animals as example? Find more than one example set; landmarks.
use same structure as main task~~

choice trial:
~~- fixation onset ~~
~~- presentation of all the options 15~~
- mouse start at the bottom of the screen
~~- subjects can move mouse to select options~~
~~- subjects can select options with mouse~~
~~- options highlighted when selected~~
~~- subjects cannot un-click options~~
~~- trial does not end when click options~~
~~- trial ends by pressing space bar~~
~~- rt is recorded at each option selected and final keyboard press~~
~~-   food option names are recorded with trial names~~
~~-   on finish have the trial calculate the number of option selected~~

instructions II
- attention check? Write in box (Please name one of the items you saw: )
~~- thank subjects /tell them about rating task?~~


~~ratings for the options? (still up for discussion)~~

instructions III (debrief)
- thank you
- generate the reward
    - randomly sample number, if X then we send you the snacks

deploying
~~- use flask web application? No, use node.js~~
~~- run on cognition.io or Heroku or something else? Heroku.~~
~~- send data directly to drive? or save of some container?~~

Uma notes:

after the 1st practice trial they got stuck. Check to make sure the exp goes forward

~~on an eye tracking study page it talks about a dot and no dot exisits... fix that in instructions~~

~~the yellow text is hard to read, maybe try orange, this would also mean changing the box color the come around the items~~

the browser full screen and ask for permission to use the camera place. make sure that the order never makes an error come up for some folks (.i.e. swap the current order)

~~highlight the amount of money people get and BOLD it too~~

~~when talking about foods say: snack foods or snacks!~~

~~make sure the software can detect the size of the screen people are using and record that. Are things on the screen changing dynamically with the size, or staying constant?~~


notes from pilot experiment

the screen resolution is different for each device.
This changes the array oreientation of the items


~~you need to fix so that people can select nothing and it wont break~~



need to:
add recalibration screen after every 50 trials.  (needs to be tested)
update data saving so it goes to google drive
move the demo script to the experiment js file  
add a reward distribution screen
