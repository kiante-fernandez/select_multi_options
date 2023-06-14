var jsPsych = initJsPsych({
    extensions: [
        {type: jsPsychExtensionWebgazer}
    ],
    on_finish: function () {
        $.ajax({
            type: "POST",
            url: "/experiment-data",
            data: JSON.stringify(jsPsych.data.get().values()),
            contentType: "application/json"
        }).done(function() {
            alert("Data has been saved!");
            window.location.href = "finish";
        }).fail(function() {
            alert("Problem occurred while writing data. " +
                "Please contact the experimenter regarding this issue!");

        window.location.href = "finish";
    });
    }
}
);

// CONSTANTS
var TODAY = new Date();
var DD = String(TODAY.getDate()).padStart(2, '0');
var MM = String(TODAY.getMonth() + 1).padStart(2, '0');
var YYYY = TODAY.getFullYear();
const DATE = YYYY + MM + DD;


//Creating list of image paths to load for instructions.
const nImageInst = 5;
/** load all the instruction images, and remember to preload */
var instruct_img = [];
for (var i = 0; i < nImageInst; i++) {
  instruct_img.push('../../img/instruct' + i + '.png');
}
//Creating list of image paths

//These are image paths to images for the experimental treatment shown on each trial
var image_indices_lst = math.range(1, 80); //math.range() returns a js obj that has a parameter called '._data' and that has an Array of the range.

image_indices_lst = Array.from(image_indices_lst._data); // This is just a list containing the range of numbers used for each url of the
// experimental stimulus. The experimental stimuli are all saved in the /img/food/ folder. They have a prefix "food"
// and then they include the number 1-N for N number of trials.
var arrayLength = image_indices_lst.length; // arrayLength is used to show how many images/trials there are from 1-N trials.
var image_paths = [];
for (var i = 0; i < arrayLength; i++) {
    //"../../public/img/food/food" when not on local server
    // This for loop fills the image_paths list with urls to the images for each of the experimental treatments
    var path_str1 = "../../img/food/food" + String(image_indices_lst[i]) + ".jpg";
    image_paths.push(path_str1);
}

const individual_shuffled_image_names = jsPsych.randomization.shuffle(image_paths);
var individual_items = [];
individual_items = individual_shuffled_image_names.map(img => ({
  stimulus: img
}));
const shuffled_image_names = jsPsych.randomization.shuffle(image_paths);
const trial_options = shuffled_image_names.slice(0, 15); // set to low number for debugging

// Preloading files are needed to present the stimuli accurately.
const preload = {
  type: jsPsychPreload,
  images: [instruct_img, image_paths],   //  preload just the images
}

// Consent
var check_consent = function(elem) {
    if (document.getElementById('consent_checkbox').checked) {
        return true;
    }
    else {
        alert("If you wish to participate, you must check the box next to the statement ' I AGREE with the above consent.'");
        return false;
    }
    return false;
};

var informed_consent = {
    data: {
        screen_id: "consent"
    },
    type: jsPsychExternalHtml,
    url: "../../views/consent.html",
    cont_btn: "start",
    check_fn: check_consent
};

// Open Full Screen
var fullscreenEnter = {
  type: jsPsychFullscreen,
  message: `<div> Before we begin, please close any unnecessary programs or applications on your computer. <br/>
  This will help the study run more smoothly.    <br/>
   Also, please close any browser tabs that could produce popups or alerts that would interfere with the study.    <br/>
   Finally, once the study has started, <b>DO NOT EXIT</b> fullscreen mode or you will terminate the study and not receive any payment. <br/>
  <br><br/>
  The study will switch to full screen mode when you press the button below.<br/>
  When you are ready to begin, press the button.</div>
  <br><br/>`,
  fullscreen_mode: true,
};

// Welcome
// capture info from Prolific //
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

var welcome_block_Prolific = {
    data: {
        screen_id: "welcome"
    },
    type: jsPsychSurveyHtmlForm,
    preamble: "<p>Welcome to the experiment!</p>"+
    "Please complete the form",
    html: "<p>PROLIFIC ID: <input name = 'subject_id' type = 'text'/></p>",
    on_finish: function(data) {
        responses = data.response;
        jsPsych.data.addProperties({
            subject_id: subject_id, //just add it from the variable about rather than responses.
            ID_DATE: responses.subject_id + "_" + DATE,
            browser_name: bowser.name,
            browser_type: bowser.version,
            windowWidth: $(window).width(),
            windowHight: $(window).height(),
            study_id: study_id,
            session_id: session_id
        })
    }
};

// Instructions I
var instruction_block_1 = {
    data: {screen_id: "instructions"},
    type: jsPsychInstructions,
    on_start:   () =>  document.body.style.cursor = 'none',
    pages: [
        '<p>Welcome to the study!</p>' +
                "<p>Today, you will make some decisions about foods.</p>" +
                "<p>There will be multiple parts to the study, and you will receive instructions before each new part.</p>"+
                "<p>If you have any questions, please contact the experimenter at neuroeconomics.osu@gmail.com. If you are ready to begin, please press the SPACEBAR.</p>",
    ],
    key_forward: ' '
};
// EYE TRACKING
// eye instructions
var camera_instructions = {
    on_start: () => document.body.style.cursor = 'pointer',
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>In order to participate you must allow the experiment to use your camera.</p>
    <p>You will be prompted to do this on the next screen.</p>
    <p>If you do not wish to allow use of your camera, you cannot participate in this experiment.<p>
    <p>It may take up to 30 seconds for the camera to initialize after you give permission.</p>
    `,
    choices: ['Got it'],
}
var eyeTrackingInstruction1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div> <font size=120%; font color = 'green';>Calibration & Validation </font><br/>
                                             <br><br/>
                Before we begin with the study, we need to turn on and adjust your webcam for eye-tracking.   <br/>

                There are two parts to this process. The first part is calibration and the second part is validation.<br/>
                <br><br/>
                During calibration, you will see a series of dots like this: <img height="25px" width="30px" src="${instruct_img[4]}"> appear on the screen, each for 3 seconds.<br/>
                Your task is simply to stare directly at each dot until it disappears.<br/>
                Then, quickly move your eyes to the next dot and repeat.<br/>
                <br><br/>
                Validation is basically the same as calibration. You simply need to stare at each dot until it turns disappears.<br/>
                <br><br/>
                When you are ready, press the SPACEBAR to continue. </div>`,
  post_trial_gap: 500,
  choices: ' ',

}

var eyeTrackingInstruction2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div><font size=120%; font color = 'green';>Calibration & Validation </font><br/>
                                                                          <br><br/>
      When the calibration begins, you will see a video feed with your face at the top of your screen like this:  <br/>
        <br><br/>
         <img height="220px" width="270px" src="${instruct_img[0]}"><br/>
       <br><br/>
                         Try to keep your entire face within the box. When your face is in a good position, the box will turn <b><font color='green'>green</font></b>. <br/>
                         <font size=5px; font color = 'red';> <b>NOTE</b>: the video feed only appears during calibration.</font><br/>
                         <br><br/>
                         <font size=5px; >When you are ready, press the  <b>SPACEBAR</b> to continue.</font>

                         </div>`,
  post_trial_gap: 500,
  choices: ' ',

}

var eyeTrackingNote = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div><font size=120%; font color = 'green';> Calibration & Validation</font><br/>
                                                                          <br><br/>
             <font size = 5px font color = "yellow">There are several <b>IMPORTANT</b> tips that are useful for passing the calibration task:<br/></font>
             <img height="200px" width="1000px" src="${instruct_img[1]}"><br/>
             <br><br/>
             <div style="text-align-last:left">
            In addition to the tips in the figure: <br/>
            (1). Use your eyes to look around the screen and try to avoid moving your head. <br/>
            (2). Try to keep lights in front of you rather than behind you so that the webcam can clearly see your face. Avoid sitting with a window behind you. <br/>
            (3). After you have made these adjustments, check again that your face fits nicely within the box on the video feed and that the box is green. <br/></div>
             <br><br/>
             <font size=5px; font color = 'red';> <b>NOTE</b>:  <br/>
            If you are seeing this page for a 2nd time, it means the calibration and validation did not work as well as we would like.  <br/>
            Please read the tips above again, make any adjustments, and try again.  <br/>
            There are only <b>TWO</b> chances to get this right.  <br/>
            Otherwise, the study cannot proceed.  </font><br/>
            <br><br/>
             <font size=5px; >When you are ready, press the <b>SPACEBAR</b> to bring up the video feed and make these adjustments. </font></div>`,
  post_trial_gap: 500,
  choices: ' ',
}
// initialize eye tracker
var init_camera = {
    type: jsPsychWebgazerInitCamera
}
// Calibration eye tracking
var calibration_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Now lets start the calibration.</p>
    <p>You'll see a series of dots appear on the screen. Look at each dot.</p>
  `,
  choices: ['Got it'],
  on_finish: () => document.body.style.cursor = 'none',
}
var calibration = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: [
        [25,25],[75,25],[50,50],[25,75],[75,75]
    ],
    repetitions_per_point: 2,
    randomize_calibration_order: true,
    calibration_mode: "view", //if view they look at points, if click they have to click on them
    time_per_point: 3000
}
// validation eye tracking
var validation_instructions = {
 type: jsPsychHtmlButtonResponse,
 stimulus: `
   <p>Now we'll measure the accuracy of the calibration.</p>
   <p>Look at each dot as it appears on the screen.</p>
     `,
 choices: ['Got it'],
 post_trial_gap: 1000
}
var validation = {
    type: jsPsychWebgazerValidate,
    validation_points: [
        [25,25],[75,25],[50,50],[25,75],[75,75]
    ],
    roi_radius: 200,
    time_to_saccade: 1000,
    validation_duration: 2000,
    data: {
        task: 'validate'
    }
}
// recalibrate eye tracking
var recalibrate_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>The accuracy of the calibration is a little lower than we'd like.</p>
    <p>Let's try calibrating one more time.</p>
    <p>On the next screen, look at the dots.<p>
    `,
    choices: ['OK'],
}
var recalibrate = {
    timeline: [recalibrate_instructions, calibration, validation_instructions, validation],
    conditional_function: function () {
      var validation_data = jsPsych.data.get().filter({ task: 'validate' }).values()[0];
      return validation_data.percent_in_roi.some(function (x) {
        var minimum_percent_acceptable = 70;
        return x < minimum_percent_acceptable;
      });
    },
    data: {
      phase: 'recalibration'
    },
    on_finish: function () {
      trial_count++;
    }
  }
var calibration_done = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Great, we're done with calibration!</p>
    `,
    choices: ['OK']
}

  //Exposure period
var exposure_instruction = {
    data: { screen_id: "instructions" },
    on_start: () => document.body.style.cursor = 'none',
    type: jsPsychInstructions,
    pages: [
        "<p>To familiarize you with the set of snack foods in this study, we will now briefly show you each one.</p>" +
        "<p>Please press the SPACEBAR to begin</p>",
    ],
    key_forward: ' '
};
var exposure = {
    data: { screen_id: "exposure" },
    type: jsPsychImageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    trial_duration: [750],
    stimulus_height: 520,
    stimulus_width: 650,
    response_ends_trial: false,
    on_start: function () {
        document.body.style.cursor = 'none'
    }
};

var exposure_sequence = {
    timeline: [exposure],
    timeline_variables: individual_items
};

// Experiment instructions
var exp_start_instructions = {
    data: {screen_id: "instructions"},
    type: jsPsychInstructions,
    pages: [
        '<p>We are now done with the practice rounds. The next part of the study involves real decisions.</p>'+
        "<p>If you have any questions, please contact the experimenter at neuroeconomics.osu@gmail.com. If you are ready to begin, please press the SPACEBAR.</p>",
    ],
    key_forward: ' '
};

//choice task
var fixation = {
    data: { screen_id: "fixation" },
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='font-size: 80px'>+</div>",
    trial_duration: [700],
    response_ends_trial: false
};

  // get ratings //
var ratingOverview = {
    type: jsPsychHtmlKeyboardResponse,
    on_start: () => document.body.style.cursor = 'none',
    stimulus: `<div> <font size=120%; font color = 'green';>Rating task</font><br/>
                                       <br><br/>
             <font size = 5%>Now, you will make decisions about each snack food one by one. <br/>
             For each snack food, please rate it on a scale from "Not at all" to "Very much" based on how much would you like this as a daily snack.<br/>
             A "Not at all" means that you would neither like nor dislike to eat this food.<br/>
             A "Very much" means that you would really love to eat this food.<br/>
             To rate an item, use the mouse to click anywhere along the slider scale. When you have rated an item, press continue to move to proceed.<br/>                                      <br><br/>
            When you are ready, press the  <b>SPACEBAR</b> to start.  </font></div>`,
    choices: ' ',
    post_trial_gap: 500,
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rating_choice_images = [];
  rating_choice_images_zero = [];

  ratings_images = jsPsych.randomization.shuffle(trial_options);
  var numbers = Array.from({ length: 100 }, (_, index) => index + 1);

  var ratings = {
    on_start: () => document.body.style.cursor = 'pointer',
    data: {
      screen_id: "ratings",
    },
    type: jsPsychImageSliderResponse,
    stimulus_height: 520, //320
    stimulus_width: 650, //450
    timeline: ratings_images.map(img => ({
      stimulus: img,
      slider_start: jsPsych.randomization.sampleWithoutReplacement(numbers, 1)
    })),
    labels: ['Not at all', 'Very much'],
    min: 1,
    max: 100,
    require_movement: false, //set to true for experiment
    slider_width: 1000,
    response_ends_trial: true,
    button_label: [`continue`],
    on_finish: (data) => {
      if (data.rating > 0) {
        rating_choice_images.push(data.stimulus);
      }
      if (data.rating >= 0) {
        rating_choice_images_zero.push(data.stimulus);
      }
    }
  };

// Choice task

var get_choice_images = function (image_paths) {
    // Number of trials to generate
    var numSets = 50;
    // Number of images trials
    var numImagesPerSet = 4;
    // Array to store the selected sets
    var selectedSets = [];
    // Create a counter object to track the usage of each image path
    var imagePathCounter = {};
    // Generate the sets
    for (var i = 0; i < numSets; i++) {
      var selectedImages = [];
      var uniquePaths = []; // Array to store unique image paths for each set
      var numAttempts = 0;
      while (uniquePaths.length < numImagesPerSet && numAttempts < image_paths.length) {
        // Randomly select an image path from the imagePaths array
        var imagePath = jsPsych.randomization.sampleWithoutReplacement(image_paths, 1)[0];
        // Check if the selected image path is already in the set or has been used four times
        if (
          uniquePaths.indexOf(imagePath) === -1 &&
          (!imagePathCounter[imagePath] || imagePathCounter[imagePath] < 6)
        ) {
          uniquePaths.push(imagePath);
          selectedImages.push(imagePath);
          // Increment the counter for the used image path
          imagePathCounter[imagePath] = (imagePathCounter[imagePath] || 0) + 1;
        }
        numAttempts++;
      }
      if (selectedImages.length === numImagesPerSet) {
        selectedSets.push(selectedImages);
      }
    }
    var factors = {
      options: selectedSets
    };

    var factorial_values = jsPsych.randomization.factorial( {
      options: selectedSets
    }, 1);
    return factorial_values;
  };

var choice_trials = [0];

var stimulus_html = [
  //select 1
  `<div><font size=120%; font color = 'green';>Food preference: : Choose one</font><br/>
  <br><br/>
  You will now select <b><font color='green'>one</font></b> of the foods you'd prefer to eat. <br/>
  Please keep your head still, otherwise we may have to redo the calibration and validation.<br/>
  There will be a break halfway through the task. During the break you can move your head if you need to. <br/>
  As a quick reminder, you are choosing which food you would prefer to eat: <br/><br/>
  If you want to eat to the left food,  press  the <b><font color='green'>J</font></b> key; <br/>
  If you want to eat to the top food,  press  the <b><font color='green'>I</font></b> key; <br/>
  If you want to eat to the right food,  press the <b><font color='green'>L</font></b>  key;<br/>
  If you want to eat to the bottom food,  press  the <b><font color='green'>K</font></b> key; <br/>
  <br><br/>
  Once selected the food will have a <b><font color=#FF7F00>Orange</font></b> outline. <br/>
  <u><b>Once you select an food, you cannot deselect it.</b> </u><br/>
  <br><br/>
  When you are ready, press the <b>SPACE BAR</b> to begin. </div>`,
  //condition 2
  `<div><font size=120%; font color = 'green';>Food preference: choose two</font><br/>
  <br><br/>
  You will now select <b><font color='green'>two</font></b> of the foods you'd prefer to eat. <br/>
  Now, we will begin with the choice task. Please keep your head still, otherwise we may have to redo the calibration and validation.<br/>
  There will be a break halfway through the task. During the break you can move your head if you need to.    <br/>
  As a quick reminder, you are choosing which food you would prefer to eat: <br/>
  To select an food:<br/>
  If you want to eat to the left food,  press  the <b><font color='green'>J</font></b> key; <br/>
  If you want to eat to the top food,  press  the <b><font color='green'>I</font></b> key; <br/>
  If you want to eat to the right food,  press the <b><font color='green'>L</font></b>  key;<br/>
  If you want to eat to the bottom food,  press  the <b><font color='green'>K</font></b> key; <br/>
  <br><br/>
  Once selected the food will have a <b><font color=#FF7F00>Orange</font></b> outline. <br/>
  <u><b>Once you select an food, you cannot deselect it.</b> </u><br/>
  <br><br/>
  When you are ready, press the <b>SPACE BAR</b> to begin. </div>`,
  //condition 3
  `<div><font size=120%; font color = 'green';>Food preference: choose three</font><br/>
  <br><br/>
  You will now select <b><font color='green'>three</font></b> of the foods you'd prefer to eat. <br/>
  Please keep your head still, otherwise we may have to redo the calibration and validation.<br/>
  There will be a break halfway through the task. During the break you can move your head if you need to.    <br/>
  As a quick reminder, you are choosing which food you would prefer to eat: <br/>
  To select an food:<br/>
  If you want to eat to the left food,  press  the <b><font color='green'>J</font></b> key; <br/>
  If you want to eat to the top food,  press  the <b><font color='green'>I</font></b> key; <br/>
  If you want to eat to the right food,  press the <b><font color='green'>L</font></b>  key;<br/>
  If you want to eat to the bottom food,  press  the <b><font color='green'>K</font></b> key; <br/>
  <br><br/>
  Once selected the food will have a <b><font color=#FF7F00>Orange</font></b> outline. <br/>
  <u><b>Once you select an food, you cannot deselect it.</b> </u><br/>
  <br><br/>
  When you are ready, press the <b>SPACE BAR</b> to begin. </div>`,
];

var choiceInstruction_choose_one = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: stimulus_html[0],
  choices: ' ',
  post_trial_gap: 500
}
var choiceInstruction_choose_two = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: stimulus_html[1],
  choices: ' ',
  post_trial_gap: 500
}
var choiceInstruction_choose_three = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: stimulus_html[2],
  choices: ' ',
  post_trial_gap: 500
}

var trial_count = 0;
//task
var trial = {
  on_start: () => document.body.style.cursor = 'none',
  data: {
    screen_id: "trial",
    options: choice_trials[trial_count].options
  },
  type: jsPsychMutipleButtonResponse,
  stimulus: [],
  num_required_responses: jsPsych.timelineVariable('subset_size'),
  choices: () => choice_trials[trial_count].options,
  button_html: [
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-j", data-choice=0>',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-i", data-choice=1>',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-l", data-choice=2>',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-k", data-choice=3>'
  ],
  response_ends_trial: true,
  keys: ['j', 'i', 'l', 'k'],
  margin_vertical: "40px",
  margin_horizontal: "50px",
  on_finish: function (data) {
    //count how many options where selected
    //count how many objects in the res_buttons arrary.
    //Its a string, so extract the numbers then count
    matches = data.res_buttons.match(/\d+/g);
    if (matches == null) { matches = 0 };
    data.options_selected = matches.length
    trial_count++;
  },
  extensions: [
    {
        type: jsPsychExtensionWebgazer,
        params: {
            targets:
            ['#jspsych-multiple-select-response-button-j',
            '#jspsych-multiple-select-response-button-i',
            '#jspsych-multiple-select-response-button-l',
            '#jspsych-multiple-select-response-button-k'
        ]}
    }
]
};

var ratings_procedure = {
    timeline: [ratingOverview, ratings],
  };

   //make conditional timeline variable for eye tracking re-calibration
   var if_recalibrate = {
    timeline: [recalibrate],
    conditional_function: function(){
      if (trial_count == choice_trials.length/2 || trial_count == 0){
        return true;
      } else {
        return false;
      }
    }
  }
  
  var task_timeline = {
//    timeline: [fixation, trial],
    timeline: [fixation, trial, if_recalibrate],
    loop_function: function () {
      if (trial_count < choice_trials.length) {
        return true;
      } else {
        trial_count = 0;
        return false;
      }
    },
  };

 //make conditional timeline variable for choice task instructions
 var if_choose_one = {
  timeline: [choiceInstruction_choose_one],
  conditional_function: function(){
    if (jsPsych.timelineVariable('subset_size') == 1){
      return true;
    } else {
      return false;
    }
  }
 }
 var if_choose_two = {
  timeline: [choiceInstruction_choose_two],
  conditional_function: function(){
    if (jsPsych.timelineVariable('subset_size') == 2){
      return true;
    } else {
      return false;
    }
  }
 }
 var if_choose_three = {
  timeline: [choiceInstruction_choose_three],
  conditional_function: function(){
    if (jsPsych.timelineVariable('subset_size') == 3){
      return true;
    } else {
      return false;
    }
  }
 }
  var choose_k_procedure = {
    on_start: () => choice_trials = get_choice_images(image_paths),
    timeline: [if_choose_one,if_choose_two,if_choose_three, task_timeline],
    timeline_variables: [
        {subset_size: 1},
        {subset_size: 2},
        {subset_size: 3},
    ],
    randomize_order: true
}

var debrief = {
    type: jsPsychHtmlKeyboardResponse,
    on_start:   () => document.body.style.cursor = 'pointer',
    stimulus: `<div> <b><font size=100%; font color = 'green';>We have completed our experiment.</font></b><br/>
    <br><br/><b><font size=100%; font color = 'green';>Thank you for participating.</font></div>`,
    trial_duration: 600
};

var fullscreenEnd = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
    delay_after: 0
}

// timeline
var timeline = []

timeline.push(informed_consent);
timeline.push(welcome_block_Prolific); //for prolific specific data collection
timeline.push(fullscreenEnter); //start the fullscreen
timeline.push(preload);
timeline.push(instruction_block_1);

//eye tracking
timeline.push(eyeTrackingInstruction1);
timeline.push(eyeTrackingInstruction2);
timeline.push(eyeTrackingNote);
timeline.push(camera_instructions);
timeline.push(init_camera);
timeline.push(calibration_instructions);
timeline.push(calibration);
timeline.push(validation_instructions);
timeline.push(validation);
timeline.push(recalibrate);
timeline.push(calibration_done);

//task
timeline.push(ratings_procedure);
timeline.push(choose_k_procedure);
timeline.push(fullscreenEnd); //end the fullscreen
timeline.push(debrief);

//Start Experiment
jsPsych.run(timeline);
