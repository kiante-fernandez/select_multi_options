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
            window.location.href = "finish";
            alert("Data has been saved!");
            // var csv = jsPsych.data.get().csv();
            // var filename = jsPsych.data.get().values()[0].subject_id + "_" + DATE + ".csv";
            // downloadCSV(csv,filename);
        }).fail(function() {
            alert("Problem occurred while writing data to Dropbox. " +
                "Data will be saved to your computer. " +
                "Please contact the experimenter regarding this issue!");
        var csv = jsPsych.data.get().csv();
        var filename = jsPsych.data.get().values()[0].subject_id + "_" + DATE + ".csv";
        downloadCSV(csv,filename);
        window.location.href = "finish";
    });
    // jsPsych.data.displayData()
     closeFullscreen()
    }
}
);

// CONSTANTS
var TODAY = new Date();
var DD = String(TODAY.getDate()).padStart(2, '0');
var MM = String(TODAY.getMonth() + 1).padStart(2, '0');
var YYYY = TODAY.getFullYear();
const DATE = YYYY + MM + DD;

//Creating list of image paths to load.
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

// Randomly select a subset of images
const shuffled_image_names = jsPsych.randomization.shuffle(image_paths);
// Get the img paths for the selected images
const trial_options = shuffled_image_names.slice(0, 15);

// Preloading files are needed to present the stimuli accurately.
const preload = {
    type: jsPsychPreload,
    images: image_paths,
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
var welcome_block = {
    data: {
        screen_id: "welcome"
    },
    type: jsPsychSurveyHtmlForm,
    preamble: "<p>Welcome to the experiment!</p>"+
    "Please complete the form",
    html: "<p>Participant ID: <input name = 'subject_id' type = 'text'/></p>",
    on_finish: function(data) {
        responses = data.response;
        jsPsych.data.addProperties({
            subject_id: responses.subject_id,
            ID_DATE: responses.subject_id + "_" + DATE,
        })
    }
};

// Instructions I
var instruction_block_1 = {
    data: {screen_id: "instructions"},
    type: jsPsychInstructions,
    pages: [
        '<p>Welcome to the study!</p>' +
        "<p>Today, you will make some decisions about food items. </p>" +
        "<p>Please pay attention to the instructions. For part of the study, your eye movements will be tracked.</p>"+
        "<p>If you have any questions, please ask the experimenter at this time. If you are ready to begin, please press the enter key.</p>",
    ],
    key_forward: ' '
};
// EYE TRACKING
// eye instructions
var camera_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>In order to participate you must allow the experiment to use your camera.</p>
    <p>You will be prompted to do this on the next screen.</p>
    <p>If you do not wish to allow use of your camera, you cannot participate in this experiment.<p>
    <p>It may take up to 30 seconds for the camera to initialize after you give permission.</p>
    `,
    choices: ['Got it'],
}
// initialize eye tracker
var init_camera = {
    type: jsPsychWebgazerInitCamera
}
// Calibration eye tracking
var calibration_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Now you'll calibrate the eye tracking, so that the software can use the image of your eyes to predict where you are looking.</p>
    <p>You'll see a series of dots appear on the screen. Look at each dot and click on it.</p>
    `,
    choices: ['Got it'],
}
var calibration = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: [
        [25,25],[75,25],[50,50],[25,75],[75,75]
    ],
    repetitions_per_point: 2,
    randomize_calibration_order: true
}
// validation eye tracking
var validation_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Now we'll measure the accuracy of the calibration.</p>
    <p>Look at each dot as it appears on the screen.</p>
    <p style="font-weight: bold;">You do not need to click on the dots this time.</p>
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
    <p>On the next screen, look at the dots and click on them.<p>
    `,
    choices: ['OK'],
}
var recalibrate = {
    timeline: [recalibrate_instructions, calibration, validation_instructions, validation],
    conditional_function: function(){
        var validation_data = jsPsych.data.get().filter({task: 'validate'}).values()[0];
        return validation_data.percent_in_roi.some(function(x){
            var minimum_percent_acceptable = 50;
            return x < minimum_percent_acceptable;
        });
    },
    data: {
        phase: 'recalibration'
    }
}
var calibration_done = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Great, we're done with calibration!</p>
    `,
    choices: ['OK']
}
// Experiment instructions
// here we need to choose one of two frames randomly. Then we need to show the approptirate text.
var condition_instructions = [
    //condition 1
    "<p>You have been selected to buy a box of snacks. Each item costs its normal price.</p>" +
    "<p>All the items available to buy are in your box.</p>" +
    "<p>Click on all the items you want to keep in your box.</p>"+
    "<p><b>Once you select an item, you cannot deselect it.</b></p>"+
    "<p>You will have a chance to receive each item that you selected.</p>"+
    "<p>When you’re finished selecting items, press the space bar to finalize your selection.</p>"+
    "<p>If you are ready to begin, please press the space bar.</p>",
    //condition 2
    "<p>You have been selected to buy a box of snacks. Each item costs its normal price.</p>" +
    "<p>All the items available to buy will be shown.</p>" +
    "<p>Click on all the items you want to add to your box.</p>"+
    "<p><b>Once you select an item, you cannot deselect it.</b></p>"+
    "<p>You will have a chance to receive each item that you selected.</p>"+
    "<p>When you’re finished selecting items, press the space bar to finalize your selection.</p>"+
    "<p>If you are ready to begin, please press the space bar.</p>"
];
//randomly select a condition
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};
const condition_choice = getRandomInt(2);
// expected output: 0, 1

//we need to get some indicator that tells us what conditoin this was
var instruction_block_2 = {
    data: {screen_id: "framing", condition: condition_choice},
    type: jsPsychInstructions,
    pages: [condition_instructions[condition_choice]
],
key_forward: ' '
};
//choice task
var fixation = {
    data: {screen_id: "fixation", stimulus: "fixation"},
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='font-size: 60px'>+</div>",
    trial_duration: [500],
    response_ends_trial: false
};
var trial = {
    data: {
        screen_id: "trial",
        options: trial_options
    },
    type: jsPsychMutipleButtonResponse,
    stimulus: [],
    prompt: [],
    choices: [shuffled_image_names[0],
    shuffled_image_names[1],
    shuffled_image_names[2],
    shuffled_image_names[3],
    shuffled_image_names[4],
    shuffled_image_names[5],
    shuffled_image_names[6],
    shuffled_image_names[7],
    shuffled_image_names[8],
    shuffled_image_names[9],
    shuffled_image_names[10],
    shuffled_image_names[11],
    shuffled_image_names[12],
    shuffled_image_names[13],
    shuffled_image_names[14]
],
button_html: [
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-0">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-1">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-2">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-3">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-4">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-5">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-6">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-7">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-8">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-9">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-10">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-11">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-12">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-13">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-14">'                    ],
    response_ends_trial: true,
    keys: ' ',
    margin_vertical: "40px",
    margin_horizontal: "50px",
    on_finish: function(data) {
        //count how many options where selected
        //count how many objects in the res_buttons arrary.
        //Its a string, so extract the numbers then count
        matches = data.res_buttons.match(/\d+/g);
        data.options_selected = matches.length
    },
    extensions: [
        {
            type: jsPsychExtensionWebgazer,
            params: {
                targets:
                ['#jspsych-multiple-select-response-button-0',
                '#jspsych-multiple-select-response-button-1',
                '#jspsych-multiple-select-response-button-2',
                '#jspsych-multiple-select-response-button-3',
                '#jspsych-multiple-select-response-button-4',
                '#jspsych-multiple-select-response-button-5',
                '#jspsych-multiple-select-response-button-6',
                '#jspsych-multiple-select-response-button-7',
                '#jspsych-multiple-select-response-button-8',
                '#jspsych-multiple-select-response-button-9',
                '#jspsych-multiple-select-response-button-10',
                '#jspsych-multiple-select-response-button-11',
                '#jspsych-multiple-select-response-button-12',
                '#jspsych-multiple-select-response-button-13',
                '#jspsych-multiple-select-response-button-14'
            ]}
        }
    ]
};
// Debrief
//we need to randomly select if this subject actully gets the foods or not
var debrief = {
    data: {
        screen_id: "debrief"
    },
    type: jsPsychInstructions,
    pages: [
        "<p>We have completed our experiment. </p>" +
        "<p>Please press next.</p>"
    ],
    show_clickable_nav: true,
};

var trials_with_variables = {
    timeline: [fixation, trial],
};
// timeline
var timeline = []

timeline.push(informed_consent);
timeline.push(fullscreenEnter); //start the fullscreen
timeline.push(preload);
timeline.push(welcome_block);
timeline.push(instruction_block_1);
timeline.push(camera_instructions);
timeline.push(init_camera);
timeline.push(calibration_instructions);
timeline.push(calibration);
timeline.push(validation_instructions);
timeline.push(validation);
timeline.push(recalibrate);
timeline.push(calibration_done);
timeline.push(instruction_block_2);
timeline.push(trials_with_variables);
timeline.push(debrief);

//Start Experiment
jsPsych.run(timeline);
