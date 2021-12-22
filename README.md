# select_multi_options
Jspych experiment code for selecting multiple options project

Things to do:
~~- how do we mark which the type of item each option selected is? We need a data id that tells us which jpg was selected~~
- do we add the mouse tracking still since we know when an option is selected?
~~- eye tracking calibration phase (see web gazer extension)~~
~~- how do we prevent subjects from deselecting options~~
~~- how are we saving the data? Dropbox.~~
~~- where are we sending the data after collection~~
~~- where are we deploying the web application? Heroku.~~
~~- add full screen~~
~~- add constent form~~
~~- data 'object issue' (why do we get the words object back instead of the data?)~~
- get browser and screen data
- did subjects leave the screen? Get interaction data
- change eye tracking instructions to match the labs protocol

introduction:
~~- condition randomization~~
calibration screen (only one?)

condition specific instructions:
~~- randomization procedure for two conditions~~

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
- thank subjects /tell them about rating task?


ratings for the options? (still up for discussion)

instructions III
- thank you
- generate the reward
    - randomly sample number, if X then we send you the snacks

deploying
~~- use flask web application? No, use node.js~~
~~- run on cognition.io or Heroku or something else? Heroku.~~
~~- send data directly to drive? or save of some container?~~
